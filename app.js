
d3.csv("IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.csv", function(err, data) {
    var width = 960,
        height = 960;

    var dataValues = {};

    // calculates the gender difference in obesity/overweight trends
    data.forEach(function(d) {
        if (!dataValues[d.location_name]) {
            dataValues[d.location_name] = {};
        }
        if (!dataValues[d.location_name][d.year]) {
            dataValues[d.location_name][d.year] = {};
        }

        var locationYear = dataValues[d.location_name][d.year];
        if (d.age_group_id === "9") {
            if (d.sex === "male") {
                if (d.metric === "obese") {
                    locationYear.male_obesity = d.mean * 100;
                } else {
                    locationYear.male_overweight = d.mean * 100;
                }
            }
            if (d.sex === "female") {
                if (d.metric === "obese") {
                    locationYear.female_obesity = d.mean * 100;
                } else {
                    locationYear.female_overweight = d.mean * 100;
                }
            }
        }

        if (locationYear.male_obesity && locationYear.male_overweight && locationYear.female_obesity && locationYear.female_overweight) {
            var delta = (locationYear.male_obesity + locationYear.male_overweight) - (locationYear.female_obesity + locationYear.female_overweight);
            locationYear.delta = delta;
        }
    })

    console.log(dataValues);

    var projection = d3.geo.mercator()
        .scale((width + 1) / 2 / Math.PI)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var graticule = d3.geo.graticule();

    var svg = d3.select("#canvas-svg").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    d3.json("/world-topo-min.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;

        svg.append("path")
        .datum(graticule)
        .attr("class", "choropleth")
        .attr("d", path);

        var g = svg.append("g");

        g.append("path")
        .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
        .attr("class", "equator")
        .attr("d", path);

        var country = g.selectAll(".country").data(countries);

        country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .style("fill", "grey")
        .on("mousemove", function(d) {
            var html = "";

            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.properties.name;
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            // html += (valueHash[d.properties.name] ? valueFormat(valueHash[d.properties.name]) : "");
            html += "";
            html += "</span>";
            html += "</div>";

            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();

            var coordinates = d3.mouse(this);

            var map_width = $('.choropleth')[0].getBoundingClientRect().width;

            if (d3.event.pageX < map_width / 2) {
                d3.select("#tooltip-container")
                    .style("top", (d3.event.layerY + 15) + "px")
                    .style("left", (d3.event.layerX + 15) + "px");
            } else {
                var tooltip_width = $("#tooltip-container").width();
                d3.select("#tooltip-container")
                    .style("top", (d3.event.layerY + 15) + "px")
                    .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            });

    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
    });

    d3.select(self.frameElement).style("height", height + "px");
});
