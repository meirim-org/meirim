
exports.up =  async function(knex) {
	await knex.schema.createTableIfNotExists('status_mapping', t => {
        t.increments('id').primary();
		t.string('mavat_status').notNullable();
        t.string('meirim_status').notNullable();
    })
    .then(() =>
      knex('status_mapping').insert([
		{mavat_status:'בדיקת תנאי סף-אי קיום תנאי סף', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'בדיקת תנאי סף-קיום תנאי סף', meirim_status: 'על שולחן הוועדה'},
				{mavat_status:'ביטול תכנית בעקבות פסיקת בית משפט', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'דיון ממשלה / ועדת שרים באישור תכנית - התכנית אושרה', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'הוגשו התנגדויות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'הוחלט לאמץ הליכי הפקדה', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'הוחלט להעביר את התכנית להערות והשגות', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'הוחלט להעביר את התכנית להערות והשגות - בתנאים', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'הוחלט על פרסום דבר הכנת תכנית', meirim_status: 'הכנת תכנית'},
				{mavat_status:'החלטה בדיון באישור תכנית', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'החלטה בדיון בבקשה למתן הוראה לעריכת תמ"א', meirim_status: 'הכנת תכנית'},
				{mavat_status:'החלטה בדיון בהפקדה', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'החלטה בדיון בהתנגדויות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'החלטה בדיון לאימוץ הליכי הפקדה', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'המלצה לממשלה לאישור תכנית', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'המלצה לממשלה לאישור תכנית בתנאים', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'העברה להערות / תגובות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'התכנית אושרה', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'התכנית נדחתה', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'התכנית עמדה בבדיקה תכנונית מוקדמת', meirim_status: 'על שולחן הוועדה'},
				{mavat_status:'התכנית פורסמה להערות והשגות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'התכנית פורסמה להתנגדויות לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'התקבלו הערות / תגובות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'טיפול בתנאים לאישור-התכנית לא אושרה', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'טיפול בתנאים לאישור-התנאים מולאו', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'טיפול בתנאים להפקדה-התנאים מולאו', meirim_status: 'הסכמה עקרונית'},
				{mavat_status:'לא הוגשו התנגדויות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'משיכת התכנית ע"י היזם', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'פרסום הודעה בדבר אישור תכנית באתר אינטרנט', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'פרסום הודעה בדבר דחיית תכנית באתר אינטרנט', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'פרסום הכנת תכנית ברשומות', meirim_status: 'הכנת תכנית'},
				{mavat_status:'פרסום לאישור בעיתונים', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'פרסום לאישור ברשומות', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'פרסום להפקדה בעיתונים', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'פרסום להפקדה בעיתונים לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'פרסום להפקדה ברשומות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'פרסום להפקדה ברשומות לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'פרסום נוסח ההפקדה על גבי שלט בתחום התכנית', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'פרסום נוסח ההפקדה על גבי שלט בתחום התכנית לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'פרסום נוסח הודעה בדבר הפקדת תכנית באתר אינטרנט', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'פרסום תכנית לביטול אישור בעיתונים', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'פרסום תכנית לביטול אישור ברשומות', meirim_status: 'תכנית מאושרת'},
				{mavat_status:'פרסום תכנית לדחייה בעיתונים', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'פרסום תכנית לדחייה ברשומות', meirim_status: 'תכנית מבוטלת'},
				{mavat_status:'קבלת תכנית', meirim_status: 'על שולחן הוועדה'},
				{mavat_status:'קבלת תכנית בות"ל', meirim_status: 'על שולחן הוועדה'},
				{mavat_status:'רישום נתוני פרסום בעיתונות בדבר עריכת התמ"א', meirim_status: 'על שולחן הוועדה'},
				{mavat_status:'רישום נתוני פרסום בעיתונות על העברה להערות והשגות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'רישום נתוני פרסום ברשומות בדבר עריכת התמ"א', meirim_status: 'על שולחן הוועדה'},
				{mavat_status:'רישום נתוני פרסום ברשומות על העברה להערות והשגות', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'תיקון התכנית לקראת פרסום לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור'},
				{mavat_status:'בבדיקה תכנונית', meirim_status: 'על שולחן הוועדה'},
			]),
		  );
	  };

exports.down = function(knex) {
	return knex.schema
    .dropTableIfExists('status_mapping');
};
