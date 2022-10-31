
exports.up = async function(knex) {
    const tbl = knex.table('status');

	await knex('status').truncate();
    await tbl.insert({name: 'הכנת תכנית'});
    await tbl.insert({name: 'על שולחן הוועדה'});
    await tbl.insert({name: 'הסכמה עקרונית'});
	await tbl.insert({name: 'התנגדויות והערות הציבור'});
	await tbl.insert({name: 'תכנית מאושרת'});
	await tbl.insert({name: 'תכנית מבוטלת'});



};

exports.down = async function(knex) {
    await knex('status').truncate();
	
	const tbl = knex.table('status');
    await tbl.insert({name: 'טרום הפקדה – שלבי תכנון מוקדמים'});
    await tbl.insert({name: 'בהפקדה – X ימים להגשת התנגדות'});
    await tbl.insert({name: 'דיון בהתנגדויות'});
	await tbl.insert({name: 'הועבר לדיון בבית  משפט'});
	await tbl.insert({name: 'תכנית מאושרת'});
	await tbl.insert({name: 'פרויקט בביצוע'});
	await tbl.insert({name: 'מאבק הסתיים'});

};
