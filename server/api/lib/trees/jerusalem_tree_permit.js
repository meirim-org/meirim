const proxy = require('./../proxy');
const cheerio = require('cheerio');
const TreePermit = require('../../model/tree_permit');
const {
	REGIONAL_OFFICE, START_DATE, PERMIT_NUMBER, APPROVER_TITLE, ACTION, APPROVER_NAME,
	END_DATE, LAST_DATE_TO_OBJECTION, TOTAL_TREES, REASON_DETAILED,
	GUSH, HELKA, PLACE, STREET,
	TREES_PER_PERMIT, PERMIT_ISSUE_DATE,
} = require('../../model/tree_permit_constants');
const { formatDate } = require('./utils');
const Log = require('../log');

const TREES_JERUSALEM_URL = 'https://www.jerusalem.muni.il/he/residents/environment/improvingcity/trees-conservation/';

const example = `<div class="table-responsive">
<table class="table table-hover">
	<thead>
		<tr>
						<th>שם רחוב</th>
						<th>מספר עצים/סוג עץ</th>
						<th>גוש / חלקה</th>
						<th>סיבת העקירה / העתקה</th>
						<th>תאריך הוצאת הרשיון - תוקף הרשיון</th>
						<th>ניתן להגיש ערר עד ליום</th>
		</tr>
	</thead>
	<tbody>
			<tr>
								<td>עין גדי 7 (כריתה)</td>
								<td>אילנטה בלוטית-2
פיטוספורום-גלוני-8
אזדרכת מצויה-1
כליל מצויה-1
רוביניה בת שיטה-1</td>
								<td>30114
67</td>
								<td>תוספת 3 קומות תמ"א 38</td>
								<td>28.8.2022
11.9.2022
11.9.2025</td>
								<td>11.9.2022</td>
			</tr>
			<tr>
								<td>העלוי 9 (כריתה)</td>
								<td>אזדרכת מצויה-4
אשחר רחב עלים-1
משמש מצוי-1
סיגלון-1
פיקוס התאנה-1
רוביניה בת שיטה-1</td>
								<td>30162
10</td>
								<td>הרחבת דירות ו-2 קומות - תמ"א 38</td>
								<td>28.8.2022
11.9.2022
11.9.2025</td>
								<td>11.9.2022</td>
			</tr>
			<tr>
								<td>הגדנ"ע 38 (כריתה)</td>
								<td>אילנטה בלוטית-4
שקד מצוי-1</td>
								<td>30006
44</td>
								<td>הרחבה ותוספת קומות תמ"א 38</td>
								<td>28.8.2022
11.9.2022
11.9.2025</td>
								<td>11.9.2022</td>
			</tr>
			<tr>
								<td>אפרתה 23 (כריתה)</td>
								<td>ברוש גדול פירות-10</td>
								<td>30115
63</td>
								<td>הוספת 2 קומות וחניה</td>
								<td>14.8.2022
28.8.2022
28.8.2025</td>
								<td>28.8.2022</td>
			</tr>
			<tr>
								<td>טללים 14 (כריתה)</td>
								<td>אלביציה צהובה-2</td>
								<td>307171
19</td>
								<td>תוספת בניה, ממ"ד ומרפסת</td>
								<td>11.8.2022
25.8.2022
25.8.2025</td>
								<td>25.8.2022</td>
			</tr>
			<tr>
								<td>שלמה המלך 7 (כריתה)</td>
								<td>אילנטה בלוטית-3</td>
								<td>30831
4</td>
								<td>הרחבת מלון, תוספת 2 קומות</td>
								<td>10.8.2022
24.8.2022
24.9.2025</td>
								<td>24.8.2022</td>
			</tr>
			<tr>
								<td>אהרונוב, תרצה שדר' הרצל (כריתה)</td>
								<td>ברוש מצוי-2</td>
								<td>30163
187</td>
								<td>הסדרי תנועה,
תוכנית רמזורים</td>
								<td>10.8.2022
24.8.2022
24.9.2024</td>
								<td>24.8.2022</td>
			</tr>
			<tr>
								<td>שמואל בית 12 - בית החולים שע"צ (כריתה)</td>
								<td>אורן קנרי-3
מכנף נאה-1</td>
								<td>30164
420</td>
								<td>בניית מכון רדיותרפיה</td>
								<td>8.8.2022
22.8.2022
22.8.2025</td>
								<td>22.8.2022</td>
			</tr>
			<tr>
								<td>כביש בגין (כריתה)</td>
								<td>צפצפה מכסיפה-3</td>
								<td></td>
								<td>מסתירים מתקני פרסום</td>
								<td>8.8.2022
22.8.2022
22.8.2023</td>
								<td>22.8.2022</td>
			</tr>
			<tr>
								<td>מעלות דפנה 123 (כריתה)</td>
								<td>אילנטה בלוטית-1-כריתה
הדר אשכולית-1-כריתה
זית אירופי-2-כריתה
פיקוס התאנה-2-כריתה
זית אירופי-7-העתקה</td>
								<td>30130
307,341,342,343</td>
								<td>הריסה, חפירה ודיפון לחניון תת קרקעי</td>
								<td>4.8.2022
18.8.2022
18.8.2025</td>
								<td>18.8.2022</td>
			</tr>
			<tr>
								<td>משה שרת פינת אינו שאקי (כריתה)</td>
								<td>אורן ירושלים-3-כריתה
ברוש מצוי-2-כריתה
מילה סורית-1-כריתה
עוזרר קוצני-2-כריתה</td>
								<td>30193
30,97,98</td>
								<td>בניה להוסטל חניון ושפ"צ</td>
								<td>4.8.2022
18.8.2022
18.8.2025</td>
								<td>18.8.2022</td>
			</tr>
			<tr>
								<td>צומת אל פארוק עד עין א-לוזה ג'בל אל מוכבר (העתקה+כריתה)</td>
								<td>זית אירופי-13-העתקה
אלנטה בלוטית-16-כריתה
איקליפטוס מסמרי-6-כר'
ברוש מצוי-10-כריתה
אורן ירוטשלים-2-כריתה
הדר הלימון-1-כריתה
זית אירופי-15-כריתה
יוקה פילית-2-כריתה
עוזרר קוצני-1-כריתה
פיקוס התאנה-6-כריתה
רימון מצוי-2-כריתה
שקד מצוי-4-כריתה
תות שחור-1-כריתה
תמר מצוי-1-כריתה</td>
								<td>30926, 30925
70, 73, 97</td>
								<td>שדרוג והנחת תשתיות</td>
								<td>28.7.2022
11.8.2022
11.8.2025</td>
								<td>11.8.2022</td>
			</tr>
			<tr>
								<td>רשב"ג, בני בתירא אלעזר הגדול, ש"י עגנון (העתקה+כריתה)</td>
								<td>זית אירופי-1-העתקה
אלון התבור-2-העתקה
אלנטה בלוטית-4-כריתה
איקליפטוס - 1 -כריתה
בוקיצה נמוכה-4-כריתה
ברוש מצוי-1-כריתה
דולב מזרחי-11-כריתה
מילה סורית-1-כריתה
תמר מצוי-1-כריתה</td>
								<td>30006, 30143
30123
57, 117, 134</td>
								<td>שדרוג והכשרת שביל אופניים</td>
								<td>25.7.2022
8.8.2022
8.8.2025</td>
								<td>8.8.2022</td>
			</tr>
			<tr>
								<td>מעלות דפנה 123 (כריתה)</td>
								<td>ברוש מצוי-2
ברוש אריזוני-1</td>
								<td>30100
127</td>
								<td>תוספת בניה לפי תב"ע</td>
								<td>20.7.2022
3.8.2022
31.12.2024</td>
								<td>3.8.2022</td>
			</tr>
			<tr>
								<td>הרכבת, עמק רפאים (העתקה+כריתה)</td>
								<td>דולב מזרחי-2-העתקה
דולב מזרחי-1-כריתה
דולב מכסיקני-3-כריתה
מייש דרומי-2-כריתה
סיגלון-2-כריתה</td>
								<td>30016
0</td>
								<td>תשתיות רק"ל - העתקת קו מתח עליון</td>
								<td>18.7.2022
1.8.2022
1.8.2025</td>
								<td>1.8.2022</td>
			</tr>
			<tr>
								<td>רחוב סכאכיני בית חנינא (העתקה+כריתה)</td>
								<td>זית אירופי-6-העתקה
מייש דרומי-1-העתקה
צפצפה מכסיפה-1-כרי'
פיקוס התאנה-1-כרי'
ברוש מצוי-1-כרי'</td>
								<td>30611  30610
72,130,191,190</td>
								<td>שינויים גיאומטריים והנחת תשתיות</td>
								<td>18.7.2022
1.8.2022
1.8.2025</td>
								<td>1.8.2022</td>
			</tr>
			<tr>
								<td>דרך חברון 142 (כריתה+העתקה)</td>
								<td>אזדרכת מצויה-1-כריתה
בוקיצה נמוכה-14-כרי'
ברוש גדול פירות-3-כרי'
ושינגטוניה חסונה-1-כרי'
כליל החורש-9-כרי'
מייש דרומי-1-כרי'
מכנף נאה-2-כרי'
פלפלון בכות-2-כרי'
תויה מזרחית-1-כרי'
תות לבן-2-כרי'
זית אירופי-1-העתקה</td>
								<td>30092
14, 15, 20, 28</td>
								<td>חפירה ודיפון לבניית 232 יחידות דיור</td>
								<td>13.7.2022
27.7.2022
27.7.2025</td>
								<td>27.7.2022</td>
			</tr>
			<tr>
								<td>בורלא, זלמן שניאור שדרות המוזאונים (העתקה+כריתה)</td>
								<td>אלון הגלעין-העתקה
אילנטה בלוטית-34-כר'
ברוש מצוי-4-כריתה
חרוב מצוי-1-כריתה
תמר מצוי-3-כריתה
מ.ל.י.-2-כריתה</td>
								<td>30181
201</td>
								<td>פיתוח שביל אופניים חדש</td>
								<td>12.7.2022
26.7.2022
26.7.2025</td>
								<td>26.7.2022</td>
			</tr>
			<tr>
								<td>אבא ברדיצ'ב 3- גן השלום (כריתה)</td>
								<td>אורן הצנובר-2
בוקיצה נמוכה-1
ברוש מצוי-1
שיטה כחלחלה-13
תות לבן-2</td>
								<td>31382
2</td>
								<td>שדרוג לגן חדש</td>
								<td>12.7.2022
26.7.2022
26.7.2025</td>
								<td>26.7.2022</td>
			</tr>
			<tr>
								<td>חרל"פ 27 (כריתה)</td>
								<td>אורן ירושלים-1
פיקוס התאנה-1</td>
								<td>30023
164</td>
								<td>תוספת בניה - תמ"א 38</td>
								<td>11.7.2022
25.7.2022
25.7.2025</td>
								<td>25.7.2022</td>
			</tr>
	</tbody>
</table>
</div>
<nav aria-label="דפדוף">
<ul class="pagination justify-content-center">
	<li class="page-item disabled">
		<a class="page-link" href="#" onclick="return false;" aria-label="הקודם">
			<span aria-hidden="true">«</span>
			הקודם
		</a>
	</li>
		<li class="page-item disabled"><a class="page-link" href="#" onclick="getPage(0);return false;" aria-label="לעמוד 1">1</a></li>
		<li class="page-item "><a class="page-link" href="#" onclick="getPage(1);return false;" aria-label="לעמוד 2">2</a></li>
		<li class="page-item "><a class="page-link" href="#" onclick="getPage(2);return false;" aria-label="לעמוד 3">3</a></li>
		<li class="page-item "><a class="page-link" href="#" onclick="getPage(3);return false;" aria-label="לעמוד 4">4</a></li>
		<li class="page-item "><a class="page-link" href="#" onclick="getPage(4);return false;" aria-label="לעמוד 5">5</a></li>
	<li class="page-item">
		<a class="page-link" href="#" onclick="getPage(1);return false;" aria-label="הבא">
			הבא
			<span aria-hidden="true">»</span>
		</a>
	</li>
</ul>
</nav>

</div>`;



async function parseTreesHtml(url) {

	//const treesHtml = proxy.get(url);

	const dom = cheerio.load(example, {
		decodeEntities: false
	});
	if (!dom) {
		console.error('cheerio dom is null');
	}
	const keys = [];
	const result = [];
	dom('.table').find('tr').each((row, elem) => {
		if (row === 0) {
			dom(elem).find('th').each((idx, elem) => {
				const key = dom(elem).text().trim();
				console.info(`Key ${idx}`, key);
				keys.push(key);
			});
			return;
		}
		const treePermit = {};
		dom(elem).find('td,th').each((idx, elem) => {
			const value = dom(elem).text().trim();
			const key = keys[idx];
			treePermit[key] = value;
		});
		result.push(treePermit);
		console.log(treePermit);

	});
	console.log(`number of jerusalem permits: ${result.length}`);
	return result;
}

function processRawPermits(rawPermits) {
	try {
		const treePermits = rawPermits.map(raw => {
			const actionDirty = raw['שם רחוב'].match(/\(.*\)/g)[0]; // captures (כריתה), (העתקה)
			const street = raw['שם רחוב'].slice(0, raw['שם רחוב'].indexOf(actionDirty));
			const action = actionDirty.replace('(', '').replace(')', '');
			const last_date_to_objection = parsePermitDates(raw['ניתן להגיש ערר עד ליום'])[0];
			const gushHelka =  parseGushHelka(raw['גוש / חלקה']);
			const gush = gushHelka[0] ? gushHelka[0] : '';
			const helka = gushHelka[1] ? gushHelka[1] : '';
			const treesPerPermit = parseTreesPerPermit(raw['מספר עצים/סוג עץ']);
			const totalTrees = sum(Object.values(treesPerPermit));
			const dates = parsePermitDates(raw['תאריך הוצאת הרשיון - תוקף הרשיון']);
			const permitNumber = `ירושלים-${street}-${dates[0]}`;
			
			const attributes = {
				[REGIONAL_OFFICE]: 'ירושלים',
				[PLACE]: 'ירושלים',
				[APPROVER_TITLE]: 'פקיד יערות עירוני ירושלים',
				[PERMIT_NUMBER]: permitNumber,
				[STREET]: street,
				[ACTION]: action,
				[LAST_DATE_TO_OBJECTION]: last_date_to_objection,
				[GUSH]: gush,
				[HELKA]: helka,
				[REASON_DETAILED]: raw['סיבת העקירה / העתקה'],
				[TREES_PER_PERMIT]: treesPerPermit,
				[TOTAL_TREES]: totalTrees,
				[PERMIT_ISSUE_DATE]: dates[0],
				[START_DATE]: dates[1],
				[END_DATE]: dates[2],
			};
			const permit = new TreePermit(attributes);
			return permit;
		});
		return treePermits;
	}
	catch (e) {
		Log.error('error in jerusalem parse rows:' + e);
	}
}

function parseTreesPerPermit(treesInPermitStr) {
	const lines = treesInPermitStr.split('\n');
	const treesInPermit = lines.map(line => {
		const treeItem = line.split('-');
		return {
			[treeItem[0]]: treeItem[1] || 0,
		};
	});
	return Object.assign({}, ...treesInPermit);
}

function parseGushHelka(gushHelkaStr) {
	console.log('gush helka str:', gushHelkaStr);
	return gushHelkaStr? gushHelkaStr.split('\n'): [];
}

function parsePermitDates(treeDatesStr) {
	console.log('tree string', treeDatesStr);
	const dates = treeDatesStr.split('\n');
	console.log('dates', dates);
	return dates.map(date => formatDate(date,'09:00', 'DD.MM.YYYY' ));
}

function sum(treeArray) {
	const amount = treeArray.map( (item) => {return parseInt(Object.values(item)[0]) || 0; });
	return amount.reduce((total, current) => {
		return total + current;
	});
}

async function crawlTreesHTML(url, permitType ) {
	const raw = await parseTreesHtml(url);
	const treePermits = processRawPermits(raw);
	return treePermits;
}

const JERTreePermit = {
	urls:[TREES_JERUSALEM_URL]
};

module.exports = { crawlTreesHTML, JERTreePermit };



