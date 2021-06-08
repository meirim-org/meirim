exports.up = async function(knex, Promise) {

	await knex('tag').insert([
			{
			  name: 'מסחר',
			},
			{
			  name:'תיירות'
			}]);

};

exports.down = async function(knex, Promise) {
	await knex('tag').delete([
		{
		  name: 'מסחר',
		},
		{
		  name:'תיירות'
		}]);
};
