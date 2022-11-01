
exports.up = async function(knex) {
    
	await knex.schema.table('status', (table) => {
        table.text('explanation');
		table.integer('step_id');
    });
	
	const tbl = knex.table('status');
	await knex('status').truncate();
	await tbl.insert(
		{	
			name: 'הכנת תכנית', 
			step_id: 0, 
			explanation:''
		});
		await tbl.insert(
		{
			name: 'על שולחן הוועדה', 
			step_id: 1, 
			explanation:'התכנית הוגשה לוועדת התכנון המוסמכת לאשרה ועברה את תנאי הסף לקליטת התכנית. כעת יחלו הדיונים בתכנית, במסגרתם הוועדה רשאית לדרוש ממגיש התכנית לערוך שינויים ותיקונים בתכנית, עד שתהיה לשביעות רצון הוועדה לצורך הפקדתה.'
		});
		await tbl.insert(
		{
			name: 'הסכמה עקרונית', 
			step_id: 2, 
			explanation:'הוועדה קיבלה החלטה בדבר הפקדת התכנית ופרסומה להתנגדויות ולהערות הציבור. החלטה שכזו יכולה להיות להפקיד ולפרסם את התכנית כפי שהיא, אולם ברוב המקרים הוועדה מחליטה על הפקדה בתנאים, בכפוף לביצוע שינויים מסוימים שפורטו בהחלטתה.'
		});
		await tbl.insert(
		{
			name: 'התנגדויות והערות הציבור', 
			step_id: 3, 
			explanation:'התכנית הופקדה ופורסמה להתנגדויות ולהערות הציבור. כל המעוניין בקרקע או בפרט תכנוני בתכנית ורואה עצמו נפגע ממנה רשאי להגיש התנגדות תוך חודשיים ממועד פרסום התכנית. ועדת התכנון רשאית להאריך תקופה זו בחודש נוסף. לאחר תקופה זו תחל הוועדה לשמוע את ההתנגדויות שיוגשו, לדון ולהכריע בהן.'
		});
		await tbl.insert({
			name: 'תכנית מאושרת', 
			step_id: 4, 
			explanation:'תם ההליך התכנוני. הוועדה קיבלה החלטה על אישור התכנית.'
		});
		await tbl.insert({
			name: 'תכנית מבוטלת', 
			step_id: 5, 
			explanation:''
		});

};

exports.down = async function(knex) {
    await knex('status').truncate();

    await knex.schema.table('status', table => {
		table.dropColumns('explanation');
		table.dropColumns('step_id');
    });	
	
	const tbl = knex.table('status');
	await tbl.insert({name: 'טרום הפקדה – שלבי תכנון מוקדמים'});
	await tbl.insert({name: 'בהפקדה – X ימים להגשת התנגדות'});
	await tbl.insert({name: 'דיון בהתנגדויות'});
	await tbl.insert({name: 'הועבר לדיון בבית  משפט'});
	await tbl.insert({name: 'תכנית מאושרת'});
	await tbl.insert({name: 'פרויקט בביצוע'});
	await tbl.insert({name: 'מאבק הסתיים'});

};


