const FundingTransactionStruct = function(table) {
	table.integer('yaad_id').primary();
	table.integer('hk_id');
	table.integer('amount').notNullable();
	table.timestamps();
	return table;
};

module.exports = FundingTransactionStruct;
