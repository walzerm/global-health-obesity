//world map template from https://vida.io/gists/oaYRaR8EwvpEnXBbM

//loads the obesity/overweight data
d3.json("/datareq", function(err, data) {
    var width = 860,
        height = 860;

    var dataValues = {};
    var year = 1990;
    // calculates the gender difference in obesity/overweight trends and saves it in an object
    data.forEach(function(d) {
        if (!dataValues[d.location_name]) {
            dataValues[d.location_name] = {};
        }
        if (!dataValues[d.location_name][d.year]) {
            dataValues[d.location_name][d.year] = {};
        }

        var locationYear = dataValues[d.location_name][d.year];
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
        // }

        if (locationYear.male_obesity && locationYear.male_overweight && locationYear.female_obesity && locationYear.female_overweight) {
            var delta = Math.round(locationYear.male_obesity + locationYear.male_overweight) - (locationYear.female_obesity + locationYear.female_overweight);
            locationYear.delta = delta;
        }
    })

    //sets the color scale
    var color = d3.scale.threshold()
    .domain([-23, -22, -21 -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
    .range(['#ff00ff','#ff2bff','#ff3fff','#ff4fff','#ff5cff','#ff68ff','#ff72ff','#ff7cff','#ff86ff','#ff8fff','#ff98ff','#ffa1ff','#ffa9ff','#ffb2ff','#ffbaff','#ffc2ff','#ffcaff','#ffd1ff','#ffd9ff','#ffe1ff','#ffe8ff','#fff0ff','#fff8ff','#ffffff','#f9f5ff','#f3eaff','#ede0ff','#e7d6ff','#e1ccff','#dac2ff','#d4b8ff','#cdaeff','#c6a4ff','#be9aff','#b790ff','#af86ff','#a77cff','#9e72ff','#9568ff','#8b5eff','#8154ff','#764aff','#693fff','#5b33ff','#4a27ff','#3418ff','#0000ff']);

    //Sets up the D3 map
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
        .attr("class", "choropleth")
        .attr("d", path);

    //Loads the country information
    d3.json("data/world-topo-min.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;

        var g = svg.append("g");

        g.append("path")
        .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
        .attr("class", "equator")
        .attr("d", path);

        var country = g.selectAll(".country").data(countries);

        //sets the color of the country based on combined obesity/overweight rates and year
        country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .style("fill", function(d) {
            //changes the color of a country based on year
            if (!dataValues[d.properties.name]) {
                return "grey"
            }
            var temp = dataValues[d.properties.name][year];
            return color(temp.delta);
        })
        //Adds a popup with obesity/overweight rates per country
        .on("mousemove", function(d) {
            var html = "";
            var temp = dataValues[d.properties.name][year];

            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += d.properties.name;
            html += "<br>";
            html += year;
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += "Male obesity rate: " + parseFloat(temp.male_obesity).toFixed(2) + "%";
            html += "<br>";
            html += "Female obesity rate: " + parseFloat(temp.female_obesity).toFixed(2) + "%";
            html += "<br>";
            html += "Male overweight rate: " + parseFloat(temp.male_overweight).toFixed(2) + "%";
            html += "<br>";
            html += "Female overweight rate: " + parseFloat(temp.female_overweight).toFixed(2) + "%";
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

        //for the year slider
        d3.select("#slider3").call(d3.slider().axis(true).min(1990).max(2013).on("slide", function(evt, value) {
            d3.select("#slider3text").text(value);
            year = value;
            country.style("fill", function(d) {
                if (!dataValues[d.properties.name]) {
                    return "grey"
                }
                var temp = dataValues[d.properties.name][year];
                return color(temp.delta);
            })
        }))
    });

    d3.select(self.frameElement).style("height", height + "px");
});
