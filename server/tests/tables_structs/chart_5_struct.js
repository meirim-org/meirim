const ChartFiveStruct = function(table) {
    table.increments();
    table.integer('plan_id');
    table.string('designation', 1000);
    table.string('use', 1000);
    table.string('area_number', 200);
    table.string('location', 1000);
    table.string('field_size_sqm', 200);
    table.string('above_primary_main', 200);
    table.string('above_primary_service', 200);
    table.string('below_primary_main', 200);
    table.string('below_primary_service', 200);
    table.string('building_percentage', 200);
    table.string('tahsit', 200);
    table.string('density_yahad_to_dunam', 200);
    table.string('num_of_housing_units', 200);
    table.string('floors_above', 200);
    table.string('floors_below', 200);
    table.string('overall_building_land', 200);
    table.string('height_above_entrance', 200);
    table.string('side_line_right', 200);
    table.string('side_line_left', 200);
    table.string('side_line_back', 200);
    table.string('side_line_front', 200);
	return table;
};

module.exports = ChartFiveStruct;
