const FundingTransactionStruct = function(table) {
	table.integer('yaad_id').primary();;
	table.boolean('recurring').notNullable();
	table.integer('amount').notNullable();
	table.timestamps();
	return table;
};

module.exports = FundingTransactionStruct;
