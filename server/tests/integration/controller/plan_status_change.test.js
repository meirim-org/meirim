const expect = require('chai').expect;
const { mockDatabase } = require('../../mock');
const structs = require('../../tables_structs');
const { PlanStatusChangeController } = require('../../../api/controller');

describe('plan status change controller', function() {
	const tables = ['status','status_mapping','plan_status_change'];
	status1 = [{
		id: '1',
		name: 'הכנת תכנית',
		explanation: '',
		step_id: 0,
	},{
		id: '2',
		name: 'על שולחן הוועדה',
		explanation: 'התכנית הוגשה לוועדת התכנון המוסמכת לאשרה ועברה את תנאי הסף לקליטת התכנית. כעת יחלו הדיונים בתכנית, במסגרתם הוועדה רשאית לדרוש ממגיש התכנית לערוך שינויים ותיקונים בתכנית, עד שתהיה לשביעות רצון הוועדה לצורך הפקדתה.',
		step_id: 1,
	},{
		id: '3',
		name: 'הסכמה עקרונית',
		explanation: 'הוועדה קיבלה החלטה בדבר הפקדת התכנית ופרסומה להתנגדויות ולהערות הציבור. החלטה שכזו יכולה להיות להפקיד ולפרסם את התכנית כפי שהיא, אולם ברוב המקרים הוועדה מחליטה על הפקדה בתנאים, בכפוף לביצוע שינויים מסוימים שפורטו בהחלטתה.',
		step_id: 2,
	},{
		id: '4',
		name: 'התנגדויות והערות הציבור',
		explanation: 'התכנית הופקדה ופורסמה להתנגדויות ולהערות הציבור. כל המעוניין בקרקע או בפרט תכנוני בתכנית ורואה עצמו נפגע ממנה רשאי להגיש התנגדות תוך חודשיים ממועד פרסום התכנית. ועדת התכנון רשאית להאריך תקופה זו בחודש נוסף. לאחר תקופה זו תחל הוועדה לשמוע את ההתנגדויות שיוגשו, לדון ולהכריע בהן.',
		step_id: 3,
	},{
		id: '5',
		name: 'תכנית מאושרת',
		explanation: 'תם ההליך התכנוני. הוועדה קיבלה החלטה על אישור התכנית.',
		step_id: 4,
	},{
		id: '6',
		name: 'תכנית מבוטלת',
		explanation: '',
		step_id: 5,
	}];

	status_mapping1 = 
	[{mavat_status:'בדיקת תנאי סף-אי קיום תנאי סף', meirim_status: 'תכנית מבוטלת'},
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
	{mavat_status:'בבדיקה תכנונית', meirim_status: 'על שולחן הוועדה'}];

	beforeEach(async function() {
		await mockDatabase.createTables(tables);
		await mockDatabase.insertData(['status'], { 'status': [status1] });
		await mockDatabase.insertData(['status_mapping'], { 'status_mapping': [status_mapping1] });
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('returns all 4 status steps, with the first one being current and complete, if the plan does not have any status changes', async function () {
	
		const req = {
			params: {
				id: 1 
			},
		};
		statusjson = await PlanStatusChangeController.byPlan(req);
		expect(statusjson.steps.length,' 4 steps').to.eql(4);
		// check step 1
		expect(statusjson.steps[0].stepId).to.eql(1);
		expect(statusjson.steps[0].completed,' step 1 is completed').to.eql(true);
		expect(statusjson.steps[0].current,' step 1 is current').to.eql(true);
		// check step 2
		expect(statusjson.steps[1].stepId).to.eql(2);
		expect(statusjson.steps[1].completed,' step 2 is not completed').to.eql(false);
		expect(statusjson.steps[1].current,' step 2 is not current').to.eql(false);
		// check step 3
		expect(statusjson.steps[2].stepId).to.eql(3);
		expect(statusjson.steps[2].completed,' step 3 is not completed').to.eql(false);
		expect(statusjson.steps[2].current,' step 3 is not current').to.eql(false);
		// check step 4
		expect(statusjson.steps[3].stepId).to.eql(4);
		expect(statusjson.steps[3].completed,' step 4 is not completed').to.eql(false);
		expect(statusjson.steps[3].current,' step 4 is not current').to.eql(false);		
	});

	it('marks the first step as being current, if it is the only status', async function () {
		const planStatusChange = {
			plan_id: 2,
			status: 'בדיקת תנאי סף-קיום תנאי סף',
			date: '2021-11-08T09:00'

		};
		
		await mockDatabase.insertData(['plan_status_change'], { 'plan_status_change': [planStatusChange] });

		const req = {
			params: {
				id: 2 
			},
		};
		statusjson = await PlanStatusChangeController.byPlan(req);

		expect(statusjson.steps.length,' 4 steps').to.eql(4);
		// check step 1
		expect(statusjson.steps[0].stepId).to.eql(1);
		expect(statusjson.steps[0].completed,' step 1 is completed').to.eql(true);
		expect(statusjson.steps[0].current,' step 1 is current').to.eql(true);
		// check step 2
		expect(statusjson.steps[1].stepId).to.eql(2);
		expect(statusjson.steps[1].completed,' step 2 is not completed').to.eql(false);
		expect(statusjson.steps[1].current,' step 2 is not current').to.eql(false);
		// check step 3
		expect(statusjson.steps[2].stepId).to.eql(3);
		expect(statusjson.steps[2].completed,' step 3 is not completed').to.eql(false);
		expect(statusjson.steps[2].current,' step 3 is not current').to.eql(false);
		// check step 4
		expect(statusjson.steps[3].stepId).to.eql(4);
		expect(statusjson.steps[3].completed,' step 4 is not completed').to.eql(false);
		expect(statusjson.steps[3].current,' step 4 is not current').to.eql(false);		
	});

	it('marks previous steps as complete, if the plan is approved', async function () {
		const planStatusChange = [{
			plan_id: 3,
			status: 'בדיקת תנאי סף-קיום תנאי סף',
			date: '2021-11-08T09:00'

		},{
			plan_id: 3,
			status: 'התכנית אושרה',
			date: '2022-11-08T09:00'

		}];
		
		await mockDatabase.insertData(['plan_status_change'], { 'plan_status_change': [planStatusChange] });

		const req = {
			params: {
				id: 3 
			},
		};
		statusjson = await PlanStatusChangeController.byPlan(req);

		expect(statusjson.steps.length,' 4 steps').to.eql(4);
		// check step 1
		expect(statusjson.steps[0].stepId).to.eql(1);
		expect(statusjson.steps[0].completed,' step 1 is completed').to.eql(true);
		expect(statusjson.steps[0].current,' step 1 is not current').to.eql(false);
		// check step 2
		expect(statusjson.steps[1].stepId).to.eql(2);
		expect(statusjson.steps[1].completed,' step 2 is completed').to.eql(true);
		expect(statusjson.steps[1].current,' step 2 is not current').to.eql(false);
		// check step 3
		expect(statusjson.steps[2].stepId).to.eql(3);
		expect(statusjson.steps[2].completed,' step 3 is completed').to.eql(true);
		expect(statusjson.steps[2].current,' step 3 is not current').to.eql(false);
		// check step 4
		expect(statusjson.steps[3].stepId).to.eql(4);
		expect(statusjson.steps[3].completed,' step 4 is completed').to.eql(true);
		expect(statusjson.steps[3].current,' step 4 is current').to.eql(true);		
	});

	it('adds 5th step and marks it current, if plan is canceled', async function () {
		const planStatusChange = [{
			plan_id: 4,
			status: 'בדיקת תנאי סף-קיום תנאי סף',
			date: '2021-11-08T09:00'

		},{
			plan_id: 4,
			status: 'התכנית נדחתה',
			date: '2022-11-08T09:00'

		}];
		
		await mockDatabase.insertData(['plan_status_change'], { 'plan_status_change': [planStatusChange] });

		const req = {
			params: {
				id: 4 
			},
		};
		statusjson = await PlanStatusChangeController.byPlan(req);

		expect(statusjson.steps.length,' 5 steps').to.eql(5);
		// check step 1
		expect(statusjson.steps[0].stepId).to.eql(1);
		expect(statusjson.steps[0].completed,' step 1 is completed').to.eql(true);
		expect(statusjson.steps[0].current,' step 1 is not current').to.eql(false);
		// check step 2
		expect(statusjson.steps[1].stepId).to.eql(2);
		expect(statusjson.steps[1].completed,' step 2 is completed').to.eql(true);
		expect(statusjson.steps[1].current,' step 2 is not current').to.eql(false);
		// check step 3
		expect(statusjson.steps[2].stepId).to.eql(3);
		expect(statusjson.steps[2].completed,' step 3 is completed').to.eql(true);
		expect(statusjson.steps[2].current,' step 3 is not current').to.eql(false);
		// check step 4
		expect(statusjson.steps[3].stepId).to.eql(4);
		expect(statusjson.steps[3].completed,' step 4 is completed').to.eql(false);
		expect(statusjson.steps[3].current,' step 4 is current').to.eql(false);	
		// check step 5
		expect(statusjson.steps[4].stepId).to.eql(5);
		expect(statusjson.steps[4].completed,' step 5 is completed').to.eql(true);
		expect(statusjson.steps[4].current,' step 5 is current').to.eql(true);				
	});	


});