
exports.up = function(knex, Promise) {
    return knex.schema.createTable('obesity_data', function(table) {
        table.increments();
        table.integer('location_id');
        table.string('location');
        table.string('location_name');
        table.integer('year');
        table.integer('age_group_id');
        table.string('age_group');
        table.integer('age_start');
        table.integer('age_end');
        table.integer('sex_id');
        table.string('sex');
        table.string('unit');
        table.string('metric');
        table.string('measure');
        table.float('mean');
        table.float('lower');
        table.float('upper');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('obesity_data');
};
