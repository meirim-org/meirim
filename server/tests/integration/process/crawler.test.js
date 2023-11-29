const assert = require('chai').assert;
const nock = require('nock');
const puppeteerBrowser = require('puppeteer/lib/cjs/puppeteer/common/Browser').Browser;
const requestPromise = require('request-promise');
const sinon = require('sinon');
const fs = require('fs');
const Log = require('../../../api/lib/log');
const path = require('path');
const { mockDatabase } = require('../../mock');
const { wait } = require('../../utils');

const tables = [
	'plan', 'notification', 'alert', 'person', 'tables_18_interests_in_plan',
	'table_4_area_designation_and_usage', 'table_5_building_rights',
	'table_6_additional_instructions', 'file', 'plan_area_changes', 'tag', 'plan_tag', 'plan_links'
];

describe('Crawler', function() {
	let sinonSandbox;

	let planController;
	let cronController;

	let plans;

	beforeEach(async function() {
		await mockDatabase.createTables(tables);

		// spy on the Log.error method so we can test if it was called during crawling
		// (meaning an error was printed)
		sinonSandbox = sinon.createSandbox();
		sinonSandbox.spy(Log, 'error');

		planController = require('../../../api/controller/plan');
		cronController = require('../../../api/controller/cron');
		
		// make sure file path to download exists
		const pathToChk = path.join(__dirname, '../../../api/lib/mavat/tmp');
		//Log.info(`make sure path exists ${pathToChk}`);
		fs.mkdirSync(pathToChk, { recursive: true });
	});

	afterEach(async function() {
		// restore mocked functions
		await sinonSandbox.restore();

		// wait a few seconds for all database activity to finish
		await wait(3);
		await mockDatabase.dropTables(tables);
	});

	it('should run', async function() {
		this.timeout(60000);

		// make sure there are currently no plans in the database
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 0);

		// Log.error was definitely not called yet
		//assert.equal(Log.error.callCount, 0, 'no error messages should be logged');

		// run crawler cron with limit of 2 plans
		await cronController.iplan(2);

		// make sure Log.error hasn't been called during the crawling process
		//assert.equal(Log.error.callCount, 0, 'no error messages should be logged');

		// now there should be 2 plans
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 2);
	});
});

describe('Crawler scraped data', function() {
	let sinonSandbox;

	let planController;
	let cronController;
	let chartOneEightModel;
	let chartFourModel;
	let chartFiveModel;
	let chartSixModel;
	let fileModel;

	let plans;
	let plan;
	let chartOneEightRows;
	let chartFourRows;
	let chartFiveRows;
	let chartSixRows;
	let fileRows;

	beforeEach(async function() {
		await mockDatabase.createTables(tables);

		// use sinon to override puppeteer browser newPage function so for each newly
		// created page we can register an event handler to intercept requests and do
		// the actual resource fetching ourselves. this allows us to mock puppeteer
		// responses using nock just the same as we mock normal fetch responses so that
		// we can mock the mavat plan page contents
		sinonSandbox = sinon.createSandbox();
		const newPageStub = sinonSandbox.stub(puppeteerBrowser.prototype, 'newPage').callsFake(
			sinonSandbox.fake(async () => {
				// create a new page using the original function
				const newPage = await newPageStub.wrappedMethod.call(newPageStub.thisValues[0]);

				// this is required for us to be able to respond with custom responses
				await newPage.setRequestInterception(true);

				// register the event handler
				newPage.on('request', (request) => {
					const options = {
						gzip: true,  // allow both gzipped and non-gzipped responses
						url: request.url(),
						method: request.method(),
						headers: request.headers(),
						body: request.postData()
					};

					// use request-promise (which uses the http/https modules) to actually
					// make the request. if the request matches a nock rule the response
					// will be mocked
					requestPromise(options, (err, response, body) => {
						if (err) {
							request.abort(500);
						} else {
							request.respond({
								status: response.statusCode,
								headers: response.headers,
								body: body
							});
						}
					});
				});

				// return the new page with the registered event handler
				return newPage;
			})
		);

		// make sure nock is active
		if (!nock.isActive())
			nock.activate();

		planController = require('../../../api/controller/plan');
		cronController = require('../../../api/controller/cron');
		chartOneEightModel = require('../../../api/model/plan_chart_one_eight_row');
		chartFourModel = require('../../../api/model/plan_chart_four_row');
		chartFiveModel = require('../../../api/model/plan_chart_five_row');
		chartSixModel = require('../../../api/model/plan_chart_six_row');
		fileModel = require('../../../api/model/file');
	});

	afterEach(async function() {
		// restore unmocked networking
		nock.restore();

		// restore mocked functions
		await sinonSandbox.restore();

		await mockDatabase.dropTables(tables);
	});

	it('should produce correct plan data', async function() {
		this.timeout(60000);
		
		// make sure there are currently no plans in the database
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 0);

		// mock iplan result page
		const iPlanScope = nock('https://ags.iplan.gov.il', { allowUnmocked: true })
			.get('/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query')
			// allow all query string params so we don't deal with field names etc.
			.query(true)
			// actual reply copied from iplan of a single plan
			 .reply(200, { 'displayFieldName':'pl_number','fieldAliases':{ 'objectid':'OBJECTID','plan_county_name':'ישוב','entity_subtype_desc':'סוג תכנית','pl_number':'מספר תכנית','pl_name':'שם תכנית','pl_area_dunam':'שטח תכנית רשום','depositing_date':'דיון בהפקדה','pl_date_8':'פרסום אישור','pl_landuse_string':'יעודי קרקע','station_desc':'סטטוס','pl_by_auth_of':'סמכות','pl_url':'PL_URL','shape_area':'shape_area','quantity_delta_120':'יחד מוצע שינוי','quantity_delta_125':'מר מגורים מוצע','last_update':'LAST_UPDATE','pl_order_print_version':'PL_ORDER_PRINT_VERSION','pl_tasrit_prn_version':'PL_TASRIT_PRN_VERSION', },'geometryType':'esriGeometryPolygon','spatialReference':{ 'wkid':102100,'latestWkid':3857 },'fields':[{ 'name':'objectid','type':'esriFieldTypeOID','alias':'OBJECTID' },{ 'name':'plan_county_name','type':'esriFieldTypeString','alias':'ישוב','length':78 },{ 'name':'entity_subtype_desc','type':'esriFieldTypeString','alias':'סוג תכנית','length':78 },{ 'name':'pl_number','type':'esriFieldTypeString','alias':'מספר תכנית','length':78 },{ 'name':'pl_name','type':'esriFieldTypeString','alias':'שם תכנית','length':78 },{ 'name':'pl_area_dunam','type':'esriFieldTypeDouble','alias':'שטח תכנית בדונם' },{ 'name':'depositing_date','type':'esriFieldTypeDate','alias':'הפקדה','length':8 },{ 'name':'pl_date_8','type':'esriFieldTypeDate','alias':'פרסום לאישור ברשומות','length':8 },{ 'name':'pl_landuse_string','type':'esriFieldTypeString','alias':'PL_LANDUSE_STRING','length':4000 },{ 'name':'station_desc','type':'esriFieldTypeString','alias':'STATION_DESC','length':26 },{ 'name':'pl_by_auth_of','type':'esriFieldTypeDouble','alias':'סמכות' },{ 'name':'pl_url','type':'esriFieldTypeString','alias':'PL_URL','length':255 }, { 'name':'shape_area','type':'esriFieldTypeDouble','alias':'shape_area' },{ 'name':'quantity_delta_120','type':'esriFieldTypeDouble','alias':'יחד מוצע שינוי' },{ 'name':'quantity_delta_125','type':'esriFieldTypeDouble','alias':'מר מגורים מוצע' },{ 'name':'last_update','type':'esriFieldTypeString','alias':'LAST_UPDATE','length':20 },{ 'name':'pl_order_print_version','type':'esriFieldTypeDouble','alias':'PL_ORDER_PRINT_VERSION' },{ 'name':'pl_tasrit_prn_version','type':'esriFieldTypeDouble','alias':'PL_TASRIT_PRN_VERSION' }],'features':[{ 'attributes':{ 'objectid':17737,'plan_county_name':'סח\'נין','entity_subtype_desc':'תכנית מתאר מקומית','pl_number':'262-0907907','pl_name':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין','pl_area_dunam':0.65600000000000003,'depositing_date':null,'pl_date_8':null,'pl_landuse_string':'מגורים ב','station_desc':'סמכות מקומית בתהליך','pl_by_auth_of':3,'pl_url':'https://mavat.iplan.gov.il/SV4/1/2005099108/310','shape_area':656.2206166598944,'quantity_delta_120':0,'quantity_delta_125':0,'last_update':'20201003092718      ','pl_order_print_version':1,'pl_tasrit_prn_version':1 },'geometry':{ 'rings':[[[3930053.80647879,3876669.3068521186],[3930064.968131646,3876668.5508384234],[3930070.2667117235,3876669.4035235811],[3930070.9940953101,3876649.9953845385],[3930038.6509795687,3876649.3163289493],[3930036.3711044192,3876650.5552507825],[3930033.3768539387,3876650.9356909227],[3930021.2490044674,3876652.6631158828],[3930023.3139998987,3876665.7636409458],[3930027.2544126092,3876670.919169195],[3930034.105045598,3876670.5496508735],[3930042.8205890162,3876670.0507389829],[3930053.80647879,3876669.3068521186]]] } }] });
 
		const newMavatScope = nock('https://mavat.iplan.gov.il', { allowUnmocked: true })
			.get('/rest/api/SV4/1/?mid=2005099108')
			// actual reply copied from a browser performing the API response
			.replyWithFile(
				200,
				`${__dirname}/files/new_mavat_plan_json_page.html`,
				{ 'Content-Type': 'text/html' }
			).get('/rest/api/Attacments/?eid=6000661941817&edn=9F9FF6CF1A89FA43A8705326272E61E75BCE98F745EDFE9FC08FF33E934A19AA') 
			 .replyWithFile(
			 	200,
			 	`${__dirname}/files/mavat_plan_instructions.pdf`,
			 	{ 'Content-Type': 'application/pdf' }
			 );


		// run crawler cron with limit of 1 plan
		await cronController.iplan(1);

		iPlanScope.done();
		newMavatScope.done();

		// now there should be a single plan
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 1, 'only a single plan should be available');
		assert.equal(plans.models[0].id, 1, 'single plan\'s id should be the first one');

		// read specific plan to obtain all fields
		plan = await planController.read({ params: { id: 1 } });

		// make sure all fields are correct
		assert.equal(plan.id, 1, 'read plan id is correct');
		assert.equal(plan.attributes.sent, 0, 'read plan sent value is the default');
		assert.equal(plan.attributes.OBJECTID, 17737, 'read plan object id is correct');
		assert.equal(plan.attributes.PLAN_COUNTY_NAME, 'סח\'נין', 'read plan county name is correct');
		assert.equal(plan.attributes.PL_NUMBER, '262-0907907', 'read plan number is correct');
		assert.equal(plan.attributes.MP_ID, '2005099108', 'plan MP_ID is correct');
		assert.equal(plan.attributes.PL_NAME, 'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין', 'read plan name is correct');
		assert.equal(plan.attributes.PLAN_CHARACTOR_NAME, '', 'read charactor name is the default value');
		assert.deepEqual(plan.attributes.data, { 'OBJECTID':17737,'PLAN_COUNTY_NAME':'סח\'נין','ENTITY_SUBTYPE_DESC':'תכנית מתאר מקומית','PL_NUMBER':'262-0907907','PL_NAME':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין','PL_AREA_DUNAM':0.656,'DEPOSITING_DATE':null,'PL_DATE_8':null,'PL_LANDUSE_STRING':'מגורים ב','PL_BY_AUTH_OF':3,'PL_URL':'https://mavat.iplan.gov.il/SV4/1/2005099108/310','SHAPE_AREA':656.2206166598944,'STATION_DESC':'סמכות מקומית בתהליך','QUANTITY_DELTA_120':0,'QUANTITY_DELTA_125':0,'STATION_DESC': 'סמכות מקומית בתהליך','LAST_UPDATE':'20201003092718      ','PL_ORDER_PRINT_VERSION':1,'PL_TASRIT_PRN_VERSION':1, 'MP_ID': '2005099108', 'plan_new_mavat_url': 'https://mavat.iplan.gov.il/SV4/1/2005099108/310' }, 'read plan data is correct');
		assert.deepEqual(plan.attributes.geom, { 'type':'Polygon','coordinates':[[[35.30427401772001,32.85949663407329],[35.304175329793075,32.85950224735488],[35.304097036734454,32.85950601208433],[35.30403549645126,32.85950880042529],[35.30400009912162,32.859469897419274],[35.30398154895205,32.859371042330814],[35.304090495277485,32.859358007368165],[35.304117393087196,32.8593551366076],[35.304137873554126,32.85934578783543],[35.30442841670619,32.859350911916685],[35.30442188250825,32.85949736354464],[35.304374284553575,32.8594909292837],[35.30427401772001,32.85949663407329]]] }, 'read plan geometry is correct');
		assert.deepEqual(plan.attributes.geom_centroid, { 'x': 35.304210661250686, 'y': 32.8594249085996 });
		assert.equal(plan.attributes.plan_url, 'https://mavat.iplan.gov.il/SV4/1/2005099108/310', 'read plan url is correct');
		assert.equal(plan.attributes.goals_from_mavat, 'שינוי בהוראות וזכויות הבניה במגרש בנוי בשכונה המזרחית בסכנין', 'read plan goals from mavat are correct');
		assert.equal(plan.attributes.main_details_from_mavat, 'הסדרת קוי בניין\r\nהגדלת תכסית קרקע\r\nהגדלת אחוזי בניה\r\nקביעת תנאים להריסת סככה חורגת בתוואי דרך\r\nקביעת תנאים למתן היתר בניה', 'read plan main details from mavat are correct');
		assert.equal(plan.attributes.jurisdiction, 'מקומית', 'read plan jurisdiction is correct');
		assert.equal(plan.attributes.status, 'סמכות מקומית בתהליך', 'read plan status is correct');
		assert.deepEqual(JSON.parse(plan.attributes.areaChanges), [[
			{ '1': '2000889725', '2': '120', '3': 'מגורים (יח"ד)', '4': 'יח"ד', '5': '+7', '6': '', '7': '7', '8': '', '9': ' ' },
			{ '1': '2000889727', '2': '125', '3': 'מגורים (מ"ר)', '4': 'מ"ר', '5': '+945', '6': '', '7': '945', '8': '', '9': ' ' }
		]], 'read plan area changes are correct');
		assert.equal(plan.attributes.rating, 0, 'read plan rating is the default value');
		assert.equal(plan.attributes.views, 0, 'read plan views are the default value');
		assert.equal(plan.attributes.erosion_views, 0, 'read plan erosion views are the default value');
		assert.isTrue(plan.attributes.explanation.startsWith('התכנית שייכת למגרש מאושר מס'), 'pdf-read plan explanation is correct');
		// creation date should be less than current date and should equal update date
		assert.isBelow(plan.attributes.created_at.getTime(), (new Date().getTime() + 1000), 'plan created_at value earlier than current time');
		assert.approximately(plan.attributes.created_at.getTime(), plan.attributes.updated_at.getTime(), 5000, 'plan created_at and updated_at times are within 5 seconds of each other (since the plan is actually created with iplan data and then updated with mavat data)');

		// since there are no controllers for the pdf table data models, use the models directly
		// fetch all chart one point eight rows
		chartOneEightRows = await chartOneEightModel.fetchAll();
		// assert.equal(chartOneEightRows.length, 2, 'two chart 1.8 rows were scraped');

		// make sure all first chart one point eight row fields are correct
		assert.equal(chartOneEightRows.models[0].id, 1, 'first chart 1.8 row id is correct');
		assert.equal(chartOneEightRows.models[0].attributes.plan_id, 1, 'first chart 1.8 row is related to the correct plan');
		assert.equal(chartOneEightRows.models[0].attributes.origin, '1.8.1', 'first chart 1.8 row origin is correct');
		assert.equal(chartOneEightRows.models[0].attributes.profession, '', 'first chart 1.8 row profession is correct');
		assert.equal(chartOneEightRows.models[0].attributes.type, 'פרטי', 'first chart 1.8 row type is correct');
		assert.equal(chartOneEightRows.models[0].attributes.description, null, 'first chart 1.8 row description is correct');
		assert.equal(chartOneEightRows.models[0].attributes.name, 'מגיש שם', 'first chart 1.8 row name is correct');
		assert.equal(chartOneEightRows.models[0].attributes.license_number, '', 'first chart 1.8 row license_number is correct');
		assert.equal(chartOneEightRows.models[0].attributes.corporate, '', 'first chart 1.8 row corporate is correct');
		assert.equal(chartOneEightRows.models[0].attributes.city, 'סח\'נין', 'first chart 1.8 row city is correct');
		assert.equal(chartOneEightRows.models[0].attributes.street, 'מרכז העיר', 'first chart 1.8 row street is correct');
		assert.equal(chartOneEightRows.models[0].attributes.house, '', 'first chart 1.8 row house is correct');
		assert.equal(chartOneEightRows.models[0].attributes.phone, '111-1111111', 'first chart 1.8 row phone is correct');
		assert.equal(chartOneEightRows.models[0].attributes.fax, '000-0000000', 'first chart 1.8 row fax is correct');
		assert.equal(chartOneEightRows.models[0].attributes.email, '', 'first chart 1.8 row email is correct');

		// make sure all second chart one point eight row fields are correct
		assert.equal(chartOneEightRows.models[1].id, 2, 'second chart 1.8 row id is correct');
		assert.equal(chartOneEightRows.models[1].attributes.plan_id, 1, 'second chart 1.8 row is related to the correct plan');
		assert.equal(chartOneEightRows.models[1].attributes.origin, '1.8.2', 'second chart 1.8 row origin is correct');
		assert.equal(chartOneEightRows.models[1].attributes.profession, null, 'second chart 1.8 row profession is correct');
		assert.equal(chartOneEightRows.models[1].attributes.type, 'פרטי', 'second chart 1.8 row type is correct');
		assert.equal(chartOneEightRows.models[1].attributes.description, null, 'second chart 1.8 row description is correct');
		assert.equal(chartOneEightRows.models[1].attributes.name, 'יזם שם', 'second chart 1.8 row name is correct');
		assert.equal(chartOneEightRows.models[1].attributes.license_number, '', 'second chart 1.8 row license_number is correct');
		assert.equal(chartOneEightRows.models[1].attributes.corporate, '', 'second chart 1.8 row corporate is correct');
		assert.equal(chartOneEightRows.models[1].attributes.city, 'סח\'נין', 'second chart 1.8 row city is correct');
		assert.equal(chartOneEightRows.models[1].attributes.street, 'מרכז העיר', 'second chart 1.8 row street is correct');
		assert.equal(chartOneEightRows.models[1].attributes.house, '', 'second chart 1.8 row house is correct');
		assert.equal(chartOneEightRows.models[1].attributes.phone, '333-3333333', 'second chart 1.8 row phone is correct');
		assert.equal(chartOneEightRows.models[1].attributes.fax, '222-2222222', 'second chart 1.8 row fax is correct');
		assert.equal(chartOneEightRows.models[1].attributes.email, '', 'second chart 1.8 row email is correct');

		// fetch all chart four rows
		chartFourRows = await chartFourModel.fetchAll();
		assert.equal(chartFourRows.length, 2, 'two chart 4 rows were scraped');

		// make sure all first chart four row fields are correct
		assert.equal(chartFourRows.models[0].id, 1, 'first chart 4 row id is correct');
		assert.equal(chartFourRows.models[0].attributes.plan_id, 1, 'first chart 4 row is related to the correct plan');
		assert.equal(chartFourRows.models[0].attributes.category_number, '4.1.1', 'first chart 4 row category number is correct');
		assert.equal(chartFourRows.models[0].attributes.category, 'שימושים', 'first chart 4 row category is correct');
		assert.equal(chartFourRows.models[0].attributes.father_category_number, '4.1', 'first chart 4 row father category number is correct');
		assert.equal(chartFourRows.models[0].attributes.father_category, 'מגורים ב\'', 'first chart 4 row father category is correct');
		assert.equal(chartFourRows.models[0].attributes.text, 'בתי מגורים\nמועדונים חברתיים - באישור הועדה המקומית ובתנאי שלא יגרמו למטרדי רעש לדיירים\nגני ילדים, פעוטונים, מגרשי משחקים, גנים, שטחי חניה\nמשרדים לבעלי מקצועות חופשיים\nחניות פרטיות ומשותפות להחניית רכב או מכונה חקלאית\nחנויות למסחר קמעונאי, מספרות ומכוני יופי, הכל בתנאי שסה"כ שטחיהם לא יעלה על רבע )1/4( \nמסה"כ השטחים המותרים לבניה במגרש, תוך הקצאת מקומות חניה עפ"י תקן החניה ובתחום \nהמגרש', 'first chart 4 row text is correct');

		// make sure all second chart four row fields are correct
		assert.equal(chartFourRows.models[1].id, 2, 'second chart 4 row id is correct');
		assert.equal(chartFourRows.models[1].attributes.plan_id, 1, 'second chart 4 row is related to the correct plan');
		assert.equal(chartFourRows.models[1].attributes.category_number, '4.1.2', 'second chart 4 row category number is correct');
		assert.equal(chartFourRows.models[1].attributes.category, 'הוראות', 'second chart 4 row category is correct');
		assert.equal(chartFourRows.models[1].attributes.father_category_number, '4.1', 'second chart 4 row father category number is correct');
		assert.equal(chartFourRows.models[1].attributes.father_category, 'מגורים ב\'', 'second chart 4 row father category is correct');
		assert.equal(chartFourRows.models[1].attributes.text, 'בינוי ו/או פיתוח \nרשאית הועדה המקומית להגדיל זכויות בניה לצורכי מסחר קמעונאי באזורי מגורים מתוך סה"כ \nאחוזי הבניה המותרים וזאת בתנאים הבאים :\nא. קבלת אישור משרד התחבורה בדבר תפקוד הדרך והצמתים הסמוכים ובדבר התקנת מקומות \nחניה בתוך המגרש.\nב. אישור המשרד לאיכות הסביבה בדבר אי הפרעות הפונקציות המסחריות למבני המגורים \nהסמוכים', 'second chart 4 row text is correct');

		// fetch all chart five rows
		chartFiveRows = await chartFiveModel.fetchAll();
		assert.equal(chartFiveRows.length, 1, 'one chart 5 row was scraped');

		// make sure all first chart five row fields are correct
		assert.equal(chartFiveRows.models[0].id, 1, 'first chart 5 row id is correct');
		assert.equal(chartFiveRows.models[0].attributes.plan_id, 1, 'first chart 5 row is related to the correct plan');
		assert.equal(chartFiveRows.models[0].attributes.designation, 'מגורים ב\'', 'first chart 5 row designation is correct');
		assert.equal(chartFiveRows.models[0].attributes.use, null, 'first chart 5 row use is correct');
		assert.equal(chartFiveRows.models[0].attributes.area_number, '3', 'first chart 5 row area_number is correct');
		assert.equal(chartFiveRows.models[0].attributes.location, null, 'first chart 5 row location is correct');
		assert.equal(chartFiveRows.models[0].attributes.field_size_sqm, '656', 'first chart 5 row field_size_sqm is correct');
		assert.equal(chartFiveRows.models[0].attributes.above_primary_main, '150', 'first chart 5 row above_primary_main is correct');
		assert.equal(chartFiveRows.models[0].attributes.above_primary_service, '20', 'first chart 5 row above_primary_service is correct');
		assert.equal(chartFiveRows.models[0].attributes.below_primary_main, null, 'first chart 5 row below_primary_main is correct');
		assert.equal(chartFiveRows.models[0].attributes.below_primary_service, null, 'first chart 5 row below_primary_service is correct');
		assert.equal(chartFiveRows.models[0].attributes.building_percentage, '170) 1(', 'first chart 5 row building_percentage is correct');
		assert.equal(chartFiveRows.models[0].attributes.tahsit, '65', 'first chart 5 row tahsit is correct');
		assert.equal(chartFiveRows.models[0].attributes.density_yahad_to_dunam, null, 'first chart 5 row density_yahad_to_dunam is correct');
		assert.equal(chartFiveRows.models[0].attributes.num_of_housing_units, '7', 'first chart 5 row num_of_housing_units is correct');
		assert.equal(chartFiveRows.models[0].attributes.floors_above, '4', 'first chart 5 row floors_above is correct');
		assert.equal(chartFiveRows.models[0].attributes.floors_below, null, 'first chart 5 row floors_below is correct');
		assert.equal(chartFiveRows.models[0].attributes.overall_building_land, null, 'first chart 5 row overall_building_land is correct');
		assert.equal(chartFiveRows.models[0].attributes.height_above_entrance, '15) 2(', 'first chart 5 row height_above_entrance is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_right, ')3(', 'first chart 5 row side_line_right is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_left, ')3(', 'first chart 5 row side_line_left is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_back, ')3(', 'first chart 5 row side_line_back is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_front, ')3(', 'first chart 5 row side_line_front is correct');

		// fetch all chart six rows
		chartSixRows = await chartSixModel.fetchAll();
		assert.equal(chartSixRows.length, 13, 'thirteen chart 6 rows were scraped');

		// make sure all first chart six row fields are correct
		assert.equal(chartSixRows.models[0].id, 1, 'first chart 6 row id is correct');
		assert.equal(chartSixRows.models[0].attributes.plan_id, 1, 'first chart 6 row is related to the correct plan');
		assert.equal(chartSixRows.models[0].attributes.category_number, '6.1', 'first chart 6 row category number is correct');
		assert.equal(chartSixRows.models[0].attributes.category, 'הוראות מתאריות', 'first chart 6 row category is correct');
		assert.equal(chartSixRows.models[0].attributes.text.slice(0, 17), 'מניין אחוזי בנייה', 'first chart 6 row text beginning is correct');

		// make sure all third chart six row fields are correct
		assert.equal(chartSixRows.models[1].id, 2, 'second chart 6 row id is correct');
		assert.equal(chartSixRows.models[1].attributes.plan_id, 1, 'second chart 6 row is related to the correct plan');
		assert.equal(chartSixRows.models[1].attributes.category_number, '6.2', 'second chart 6 row category number is correct');
		assert.equal(chartSixRows.models[1].attributes.category, 'עתיקות', 'second chart 6 row category is correct');
		assert.equal(chartSixRows.models[1].attributes.text.slice(0, 18), 'כל עבודה בתחום שטח', 'second chart 6 row text beginning is correct');

		// fetch all file rows
		fileRows = await fileModel.fetchAll();
		assert.equal(fileRows.length, 7, 'seven file rows were scraped');

		// make sure all first file row fields are correct
		assert.equal(fileRows.models[0].id, 1, 'first file row id is correct');
		assert.equal(fileRows.models[0].attributes.plan_id, 1, 'first file row is related to the correct plan');
		assert.equal(fileRows.models[0].attributes.tree_id, null, 'first file row tree id is correct');
		assert.equal(fileRows.models[0].attributes.type, 'PDF', 'first file row type is correct');
		assert.equal(fileRows.models[0].attributes.extension, 'pdf', 'first file row extension is correct');
		assert.equal(fileRows.models[0].attributes.link, 'https://mavat.iplan.gov.il/rest/api/Attacments/?eid=77000661941773&edn=7A5902AE1493843AE0D9F82C89CE7F879827799F5BEF228F96E04936E0A26016', 'first file row link is correct');
		assert.equal(fileRows.models[0].attributes.source, 'MAVAT', 'first file row source is correct');
		assert.equal(fileRows.models[0].attributes.name, 'מצב מאושר', 'first file row name is correct');

		// make sure all last file row fields are correct
		assert.equal(fileRows.models[6].id, 7, 'last file row id is correct');
		assert.equal(fileRows.models[6].attributes.plan_id, 1, 'last file row is related to the correct plan');
		assert.equal(fileRows.models[6].attributes.tree_id, null, 'last file row tree id is correct');
		assert.equal(fileRows.models[6].attributes.type, 'KML', 'last file row type is correct');
		assert.equal(fileRows.models[6].attributes.extension, 'kml', 'last file row extension is correct');
		assert.equal(fileRows.models[6].attributes.link, 'https://mavat.iplan.gov.il/rest/api/Attacments/?eid=77000770914577&edn=A17F3A8FDE918395B6FA88BBF1566A7A200C8A95012F581944D3BE764A024A2D', 'last file row link is correct');
		assert.equal(fileRows.models[6].attributes.source, 'MAVAT', 'last file row source is correct');
		assert.equal(fileRows.models[6].attributes.name, 'גבול התכנית תלת מימד (KML)', 'last file row name is correct');
	});

	it('should update existing plan data', async function() {
		this.timeout(60000);

		// make sure there are currently no plans in the database
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 0);

		// mock iplan result page
		const iPlanScope = nock('https://ags.iplan.gov.il', { allowUnmocked: true })
			.get('/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query')
			// allow all query string params so we don't deal with field names etc.
			.query(true)
			// actual reply copied from iplan of a single plan
			.reply(200, { 'displayFieldName':'pl_number','fieldAliases':{ 'objectid':'OBJECTID','plan_county_name':'ישוב','entity_subtype_desc':'סוג תכנית','pl_number':'מספר תכנית','pl_name':'שם תכנית','pl_area_dunam':'שטח תכנית רשום','depositing_date':'דיון בהפקדה','pl_date_8':'פרסום אישור','pl_landuse_string':'יעודי קרקע','station_desc':'סטטוס','pl_by_auth_of':'סמכות','pl_url':'PL_URL','shape_area':'shape_area','quantity_delta_120':'יחד מוצע שינוי','quantity_delta_125':'מר מגורים מוצע','last_update':'LAST_UPDATE','pl_order_print_version':'PL_ORDER_PRINT_VERSION','pl_tasrit_prn_version':'PL_TASRIT_PRN_VERSION' },'geometryType':'esriGeometryPolygon','spatialReference':{ 'wkid':102100,'latestWkid':3857 },'fields':[{ 'name':'objectid','type':'esriFieldTypeOID','alias':'OBJECTID' },{ 'name':'plan_county_name','type':'esriFieldTypeString','alias':'ישוב','length':78 },{ 'name':'entity_subtype_desc','type':'esriFieldTypeString','alias':'סוג תכנית','length':78 },{ 'name':'pl_number','type':'esriFieldTypeString','alias':'מספר תכנית','length':78 },{ 'name':'pl_name','type':'esriFieldTypeString','alias':'שם תכנית','length':78 },{ 'name':'pl_area_dunam','type':'esriFieldTypeDouble','alias':'שטח תכנית בדונם' },{ 'name':'depositing_date','type':'esriFieldTypeDate','alias':'הפקדה','length':8 },{ 'name':'pl_date_8','type':'esriFieldTypeDate','alias':'פרסום לאישור ברשומות','length':8 },{ 'name':'pl_landuse_string','type':'esriFieldTypeString','alias':'PL_LANDUSE_STRING','length':4000 },{ 'name':'station_desc','type':'esriFieldTypeString','alias':'STATION_DESC','length':26 },{ 'name':'pl_by_auth_of','type':'esriFieldTypeDouble','alias':'סמכות' },{ 'name':'pl_url','type':'esriFieldTypeString','alias':'PL_URL','length':255 }, { 'name':'shape_area','type':'esriFieldTypeDouble','alias':'shape_area' },{ 'name':'quantity_delta_120','type':'esriFieldTypeDouble','alias':'יחד מוצע שינוי' },{ 'name':'quantity_delta_125','type':'esriFieldTypeDouble','alias':'מר מגורים מוצע' },{ 'name':'last_update','type':'esriFieldTypeString','alias':'LAST_UPDATE','length':20 },{ 'name':'pl_order_print_version','type':'esriFieldTypeDouble','alias':'PL_ORDER_PRINT_VERSION' },{ 'name':'pl_tasrit_prn_version','type':'esriFieldTypeDouble','alias':'PL_TASRIT_PRN_VERSION' }],'features':[{ 'attributes':{ 'objectid':17737,'plan_county_name':'סח\'נין','entity_subtype_desc':'תכנית מתאר מקומית','pl_number':'262-0907907','pl_name':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין','pl_area_dunam':0.65600000000000003,'depositing_date':null,'pl_date_8':null,'pl_landuse_string':'מגורים ב','station_desc':'סמכות מקומית בתהליך','pl_by_auth_of':3,'pl_url':'https://mavat.iplan.gov.il/SV4/1/2005099108/310','shape_area':656.2206166598944,'quantity_delta_120':0,'quantity_delta_125':0,'last_update':'20201003092718      ','pl_order_print_version':1,'pl_tasrit_prn_version':1 },'geometry':{ 'rings':[[[3930053.80647879,3876669.3068521186],[3930064.968131646,3876668.5508384234],[3930070.2667117235,3876669.4035235811],[3930070.9940953101,3876649.9953845385],[3930038.6509795687,3876649.3163289493],[3930036.3711044192,3876650.5552507825],[3930033.3768539387,3876650.9356909227],[3930021.2490044674,3876652.6631158828],[3930023.3139998987,3876665.7636409458],[3930027.2544126092,3876670.919169195],[3930034.105045598,3876670.5496508735],[3930042.8205890162,3876670.0507389829],[3930053.80647879,3876669.3068521186]]] } }] });

		// mock mavat single plan page
		const newMavatScope = nock('https://mavat.iplan.gov.il', { allowUnmocked: true })
			.get('/rest/api/SV4/1/?mid=2005099108')
			// actual reply copied from a browser performing the API response
			.replyWithFile(
				200,
				`${__dirname}/files/new_mavat_plan_json_page.html`,
				{ 'Content-Type': 'text/html' }
			).get('/rest/api/Attacments/?eid=6000661941817&edn=9F9FF6CF1A89FA43A8705326272E61E75BCE98F745EDFE9FC08FF33E934A19AA') 
			 .replyWithFile(
			 	200,
			 	`${__dirname}/files/mavat_plan_instructions.pdf`,
			 	{ 'Content-Type': 'application/pdf' }
			 );
	
		// run crawler cron with limit of 1 plan
		await cronController.iplan(1);

		iPlanScope.done();
		newMavatScope.done();

		// now there should be a single plan
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 1, 'only a single plan should be available');
		assert.equal(plans.models[0].id, 1, 'single plan\'s id should be the first one');

		// read specific plan to obtain all fields
		plan = await planController.read({ params: { id: 1 } });

		// make sure all fields are correct
		assert.equal(plan.id, 1, 'read plan id is correct');
		assert.equal(plan.attributes.sent, 0, 'read plan sent value is the default');
		assert.equal(plan.attributes.OBJECTID, 17737, 'read plan object id is correct');
		assert.equal(plan.attributes.PLAN_COUNTY_NAME, 'סח\'נין', 'read plan county name is correct');
		assert.equal(plan.attributes.PL_NUMBER, '262-0907907', 'read plan number is correct');
		assert.equal(plan.attributes.PL_NAME, 'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין', 'read plan name is correct');
		assert.equal(plan.attributes.PLAN_CHARACTOR_NAME, '', 'read charactor name is the default value');
		assert.deepEqual(plan.attributes.data, { 'MP_ID': '2005099108', 'plan_new_mavat_url': 'https://mavat.iplan.gov.il/SV4/1/2005099108/310', 'OBJECTID':17737,'PLAN_COUNTY_NAME':'סח\'נין','ENTITY_SUBTYPE_DESC':'תכנית מתאר מקומית','PL_NUMBER':'262-0907907','PL_NAME':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין','PL_AREA_DUNAM':0.656,'DEPOSITING_DATE':null,'PL_DATE_8':null,'PL_LANDUSE_STRING':'מגורים ב','PL_BY_AUTH_OF':3,'PL_URL':'https://mavat.iplan.gov.il/SV4/1/2005099108/310','SHAPE_AREA':656.2206166598944,'STATION_DESC':'סמכות מקומית בתהליך','QUANTITY_DELTA_120':0,'QUANTITY_DELTA_125':0,'LAST_UPDATE':'20201003092718      ','PL_ORDER_PRINT_VERSION':1,'PL_TASRIT_PRN_VERSION':1 }, 'read plan data is correct');
		assert.deepEqual(plan.attributes.geom, { 'type':'Polygon','coordinates':[[[35.30427401772001,32.85949663407329],[35.304175329793075,32.85950224735488],[35.304097036734454,32.85950601208433],[35.30403549645126,32.85950880042529],[35.30400009912162,32.859469897419274],[35.30398154895205,32.859371042330814],[35.304090495277485,32.859358007368165],[35.304117393087196,32.8593551366076],[35.304137873554126,32.85934578783543],[35.30442841670619,32.859350911916685],[35.30442188250825,32.85949736354464],[35.304374284553575,32.8594909292837],[35.30427401772001,32.85949663407329]]] }, 'read plan geometry is correct');
		assert.deepEqual(plan.attributes.geom_centroid, { 'x': 35.304210661250686, 'y': 32.8594249085996 });
		assert.equal(plan.attributes.plan_url, 'https://mavat.iplan.gov.il/SV4/1/2005099108/310', 'read plan url is correct');
		assert.equal(plan.attributes.goals_from_mavat, 'שינוי בהוראות וזכויות הבניה במגרש בנוי בשכונה המזרחית בסכנין', 'read plan goals from mavat are correct');
		assert.equal(plan.attributes.main_details_from_mavat, 'הסדרת קוי בניין\r\nהגדלת תכסית קרקע\r\nהגדלת אחוזי בניה\r\nקביעת תנאים להריסת סככה חורגת בתוואי דרך\r\nקביעת תנאים למתן היתר בניה', 'read plan main details from mavat are correct');
		assert.equal(plan.attributes.jurisdiction, 'מקומית', 'read plan jurisdiction is correct');
		assert.equal(plan.attributes.status, 'סמכות מקומית בתהליך', 'read plan status is correct');
		assert.deepEqual(JSON.parse(plan.attributes.areaChanges), [[
			{ '1': '2000889725', '2': '120', '3': 'מגורים (יח"ד)', '4': 'יח"ד', '5': '+7', '6': '', '7': '7', '8': '', '9': ' ' },
			{ '1': '2000889727', '2': '125', '3': 'מגורים (מ"ר)', '4': 'מ"ר', '5': '+945', '6': '', '7': '945', '8': '', '9': ' ' }
		]], 'read plan area changes are correct');
		assert.equal(plan.attributes.rating, 0, 'read plan rating is the default value');
		assert.equal(plan.attributes.views, 0, 'read plan views are the default value');
		assert.equal(plan.attributes.erosion_views, 0, 'read plan erosion views are the default value');
		assert.isTrue(plan.attributes.explanation.startsWith('התכנית שייכת למגרש מאושר מס'), 'pdf-read plan explanation is correct');

		// creation date should be less than current date and should equal update date
		assert.isBelow(plan.attributes.created_at.getTime(), new Date().getTime(), 'plan created_at value earlier than current time');
		assert.approximately(plan.attributes.created_at.getTime(), plan.attributes.updated_at.getTime(), 5000, 'plan created_at and updated_at times are within 5 seconds of each other (since the plan is actually created with iplan data and then updated with mavat data)');

		// since there are no controllers for the pdf table data models, use the models directly
		// fetch all chart one point eight rows
		chartOneEightRows = await chartOneEightModel.fetchAll();
		// assert.equal(chartOneEightRows.length, 2, 'two chart 1.8 rows were scraped');

		// make sure all first chart one point eight row fields are correct
		assert.equal(chartOneEightRows.models[0].id, 1, 'first chart 1.8 row id is correct');
		assert.equal(chartOneEightRows.models[0].attributes.plan_id, 1, 'first chart 1.8 row is related to the correct plan');
		assert.equal(chartOneEightRows.models[0].attributes.origin, '1.8.1', 'first chart 1.8 row origin is correct');
		assert.equal(chartOneEightRows.models[0].attributes.profession, '', 'first chart 1.8 row profession is correct');
		assert.equal(chartOneEightRows.models[0].attributes.type, 'פרטי', 'first chart 1.8 row type is correct');
		assert.equal(chartOneEightRows.models[0].attributes.description, null, 'first chart 1.8 row description is correct');
		assert.equal(chartOneEightRows.models[0].attributes.name, 'מגיש שם', 'first chart 1.8 row name is correct');
		assert.equal(chartOneEightRows.models[0].attributes.license_number, '', 'first chart 1.8 row license_number is correct');
		assert.equal(chartOneEightRows.models[0].attributes.corporate, '', 'first chart 1.8 row corporate is correct');
		assert.equal(chartOneEightRows.models[0].attributes.city, 'סח\'נין', 'first chart 1.8 row city is correct');
		assert.equal(chartOneEightRows.models[0].attributes.street, 'מרכז העיר', 'first chart 1.8 row street is correct');
		assert.equal(chartOneEightRows.models[0].attributes.house, '', 'first chart 1.8 row house is correct');
		assert.equal(chartOneEightRows.models[0].attributes.phone, '111-1111111', 'first chart 1.8 row phone is correct');
		assert.equal(chartOneEightRows.models[0].attributes.fax, '000-0000000', 'first chart 1.8 row fax is correct');
		assert.equal(chartOneEightRows.models[0].attributes.email, '', 'first chart 1.8 row email is correct');

		// make sure all second chart one point eight row fields are correct
		assert.equal(chartOneEightRows.models[1].id, 2, 'second chart 1.8 row id is correct');
		assert.equal(chartOneEightRows.models[1].attributes.plan_id, 1, 'second chart 1.8 row is related to the correct plan');
		assert.equal(chartOneEightRows.models[1].attributes.origin, '1.8.2', 'second chart 1.8 row origin is correct');
		assert.equal(chartOneEightRows.models[1].attributes.profession, null, 'second chart 1.8 row profession is correct');
		assert.equal(chartOneEightRows.models[1].attributes.type, 'פרטי', 'second chart 1.8 row type is correct');
		assert.equal(chartOneEightRows.models[1].attributes.description, null, 'second chart 1.8 row description is correct');
		assert.equal(chartOneEightRows.models[1].attributes.name, 'יזם שם', 'second chart 1.8 row name is correct');
		assert.equal(chartOneEightRows.models[1].attributes.license_number, '', 'second chart 1.8 row license_number is correct');
		assert.equal(chartOneEightRows.models[1].attributes.corporate, '', 'second chart 1.8 row corporate is correct');
		assert.equal(chartOneEightRows.models[1].attributes.city, 'סח\'נין', 'second chart 1.8 row city is correct');
		assert.equal(chartOneEightRows.models[1].attributes.street, 'מרכז העיר', 'second chart 1.8 row street is correct');
		assert.equal(chartOneEightRows.models[1].attributes.house, '', 'second chart 1.8 row house is correct');
		assert.equal(chartOneEightRows.models[1].attributes.phone, '333-3333333', 'second chart 1.8 row phone is correct');
		assert.equal(chartOneEightRows.models[1].attributes.fax, '222-2222222', 'second chart 1.8 row fax is correct');
		assert.equal(chartOneEightRows.models[1].attributes.email, '', 'second chart 1.8 row email is correct');

		// fetch all chart four rows
		chartFourRows = await chartFourModel.fetchAll();
		assert.equal(chartFourRows.length, 2, 'two chart 4 rows were scraped');

		// make sure all first chart four row fields are correct
		assert.equal(chartFourRows.models[0].id, 1, 'first chart 4 row id is correct');
		assert.equal(chartFourRows.models[0].attributes.plan_id, 1, 'first chart 4 row is related to the correct plan');
		assert.equal(chartFourRows.models[0].attributes.category_number, '4.1.1', 'first chart 4 row category number is correct');
		assert.equal(chartFourRows.models[0].attributes.category, 'שימושים', 'first chart 4 row category is correct');
		assert.equal(chartFourRows.models[0].attributes.father_category_number, '4.1', 'first chart 4 row father category number is correct');
		assert.equal(chartFourRows.models[0].attributes.father_category, 'מגורים ב\'', 'first chart 4 row father category is correct');
		assert.equal(chartFourRows.models[0].attributes.text, 'בתי מגורים\nמועדונים חברתיים - באישור הועדה המקומית ובתנאי שלא יגרמו למטרדי רעש לדיירים\nגני ילדים, פעוטונים, מגרשי משחקים, גנים, שטחי חניה\nמשרדים לבעלי מקצועות חופשיים\nחניות פרטיות ומשותפות להחניית רכב או מכונה חקלאית\nחנויות למסחר קמעונאי, מספרות ומכוני יופי, הכל בתנאי שסה"כ שטחיהם לא יעלה על רבע )1/4( \nמסה"כ השטחים המותרים לבניה במגרש, תוך הקצאת מקומות חניה עפ"י תקן החניה ובתחום \nהמגרש', 'first chart 4 row text is correct');

		// make sure all second chart four row fields are correct
		assert.equal(chartFourRows.models[1].id, 2, 'second chart 4 row id is correct');
		assert.equal(chartFourRows.models[1].attributes.plan_id, 1, 'second chart 4 row is related to the correct plan');
		assert.equal(chartFourRows.models[1].attributes.category_number, '4.1.2', 'second chart 4 row category number is correct');
		assert.equal(chartFourRows.models[1].attributes.category, 'הוראות', 'second chart 4 row category is correct');
		assert.equal(chartFourRows.models[1].attributes.father_category_number, '4.1', 'second chart 4 row father category number is correct');
		assert.equal(chartFourRows.models[1].attributes.father_category, 'מגורים ב\'', 'second chart 4 row father category is correct');
		assert.equal(chartFourRows.models[1].attributes.text, 'בינוי ו/או פיתוח \nרשאית הועדה המקומית להגדיל זכויות בניה לצורכי מסחר קמעונאי באזורי מגורים מתוך סה"כ \nאחוזי הבניה המותרים וזאת בתנאים הבאים :\nא. קבלת אישור משרד התחבורה בדבר תפקוד הדרך והצמתים הסמוכים ובדבר התקנת מקומות \nחניה בתוך המגרש.\nב. אישור המשרד לאיכות הסביבה בדבר אי הפרעות הפונקציות המסחריות למבני המגורים \nהסמוכים', 'second chart 4 row text is correct');

		// fetch all chart five rows
		chartFiveRows = await chartFiveModel.fetchAll();
		assert.equal(chartFiveRows.length, 1, 'one chart 5 row was scraped');

		// make sure all first chart five row fields are correct
		assert.equal(chartFiveRows.models[0].id, 1, 'first chart 5 row id is correct');
		assert.equal(chartFiveRows.models[0].attributes.plan_id, 1, 'first chart 5 row is related to the correct plan');
		assert.equal(chartFiveRows.models[0].attributes.designation, 'מגורים ב\'', 'first chart 5 row designation is correct');
		assert.equal(chartFiveRows.models[0].attributes.use, null, 'first chart 5 row use is correct');
		assert.equal(chartFiveRows.models[0].attributes.area_number, '3', 'first chart 5 row area_number is correct');
		assert.equal(chartFiveRows.models[0].attributes.location, null, 'first chart 5 row location is correct');
		assert.equal(chartFiveRows.models[0].attributes.field_size_sqm, '656', 'first chart 5 row field_size_sqm is correct');
		assert.equal(chartFiveRows.models[0].attributes.above_primary_main, '150', 'first chart 5 row above_primary_main is correct');
		assert.equal(chartFiveRows.models[0].attributes.above_primary_service, '20', 'first chart 5 row above_primary_service is correct');
		assert.equal(chartFiveRows.models[0].attributes.below_primary_main, null, 'first chart 5 row below_primary_main is correct');
		assert.equal(chartFiveRows.models[0].attributes.below_primary_service, null, 'first chart 5 row below_primary_service is correct');
		assert.equal(chartFiveRows.models[0].attributes.building_percentage, '170) 1(', 'first chart 5 row building_percentage is correct');
		assert.equal(chartFiveRows.models[0].attributes.tahsit, '65', 'first chart 5 row tahsit is correct');
		assert.equal(chartFiveRows.models[0].attributes.density_yahad_to_dunam, null, 'first chart 5 row density_yahad_to_dunam is correct');
		assert.equal(chartFiveRows.models[0].attributes.num_of_housing_units, '7', 'first chart 5 row num_of_housing_units is correct');
		assert.equal(chartFiveRows.models[0].attributes.floors_above, '4', 'first chart 5 row floors_above is correct');
		assert.equal(chartFiveRows.models[0].attributes.floors_below, null, 'first chart 5 row floors_below is correct');
		assert.equal(chartFiveRows.models[0].attributes.overall_building_land, null, 'first chart 5 row overall_building_land is correct');
		assert.equal(chartFiveRows.models[0].attributes.height_above_entrance, '15) 2(', 'first chart 5 row height_above_entrance is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_right, ')3(', 'first chart 5 row side_line_right is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_left, ')3(', 'first chart 5 row side_line_left is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_back, ')3(', 'first chart 5 row side_line_back is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_front, ')3(', 'first chart 5 row side_line_front is correct');

		// fetch all chart six rows
		chartSixRows = await chartSixModel.fetchAll();
		assert.equal(chartSixRows.length, 13, 'thirteen chart 6 rows were scraped');

		// make sure all first chart six row fields are correct
		assert.equal(chartSixRows.models[0].id, 1, 'first chart 6 row id is correct');
		assert.equal(chartSixRows.models[0].attributes.plan_id, 1, 'first chart 6 row is related to the correct plan');
		assert.equal(chartSixRows.models[0].attributes.category_number, '6.1', 'first chart 6 row category number is correct');
		assert.equal(chartSixRows.models[0].attributes.category, 'הוראות מתאריות', 'first chart 6 row category is correct');
		assert.equal(chartSixRows.models[0].attributes.text.slice(0, 17), 'מניין אחוזי בנייה', 'first chart 6 row text beginning is correct');

		// make sure all third chart six row fields are correct
		assert.equal(chartSixRows.models[1].id, 2, 'second chart 6 row id is correct');
		assert.equal(chartSixRows.models[1].attributes.plan_id, 1, 'second chart 6 row is related to the correct plan');
		assert.equal(chartSixRows.models[1].attributes.category_number, '6.2', 'second chart 6 row category number is correct');
		assert.equal(chartSixRows.models[1].attributes.category, 'עתיקות', 'second chart 6 row category is correct');
		assert.equal(chartSixRows.models[1].attributes.text.slice(0, 18), 'כל עבודה בתחום שטח', 'second chart 6 row text beginning is correct');

		// fetch all file rows
		fileRows = await fileModel.fetchAll();
		assert.equal(fileRows.length, 7, 'seven file rows were scraped');

		// make sure all first file row fields are correct
		assert.equal(fileRows.models[0].id, 1, 'first file row id is correct');
		assert.equal(fileRows.models[0].attributes.plan_id, 1, 'first file row is related to the correct plan');
		assert.equal(fileRows.models[0].attributes.tree_id, null, 'first file row tree id is correct');
		assert.equal(fileRows.models[0].attributes.type, 'PDF', 'first file row type is correct');
		assert.equal(fileRows.models[0].attributes.extension, 'pdf', 'first file row extension is correct');
		assert.equal(fileRows.models[0].attributes.link, 'https://mavat.iplan.gov.il/rest/api/Attacments/?eid=77000661941773&edn=7A5902AE1493843AE0D9F82C89CE7F879827799F5BEF228F96E04936E0A26016', 'first file row link is correct');
		assert.equal(fileRows.models[0].attributes.source, 'MAVAT', 'first file row source is correct');
		assert.equal(fileRows.models[0].attributes.name, 'מצב מאושר', 'first file row name is correct');

		// make sure all last file row fields are correct
		assert.equal(fileRows.models[6].id, 7, 'last file row id is correct');
		assert.equal(fileRows.models[6].attributes.plan_id, 1, 'last file row is related to the correct plan');
		assert.equal(fileRows.models[6].attributes.tree_id, null, 'last file row tree id is correct');
		assert.equal(fileRows.models[6].attributes.type, 'KML', 'last file row type is correct');
		assert.equal(fileRows.models[6].attributes.extension, 'kml', 'last file row extension is correct');
		assert.equal(fileRows.models[6].attributes.link, 'https://mavat.iplan.gov.il/rest/api/Attacments/?eid=77000770914577&edn=A17F3A8FDE918395B6FA88BBF1566A7A200C8A95012F581944D3BE764A024A2D', 'last file row link is correct');
		assert.equal(fileRows.models[6].attributes.source, 'MAVAT', 'last file row source is correct');
		assert.equal(fileRows.models[6].attributes.name, 'גבול התכנית תלת מימד (KML)', 'last file row name is correct');

		// new iplan values with the same LAST_UPDATE value will not result in data being updated
		iPlanScope
			.get('/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query')
			// allow all query string params so we don't deal with field names etc.
			.query(true)
			// actual reply copied from iplan of a single plan
			.reply(200, { 'displayFieldName':'PLAN_NAME','fieldAliases':{ 'OBJECTID':'OBJECTID','PLAN_AREA_CODE':'קוד מרחב תכנון','JURSTICTION_CODE':'קוד גבול שיפוט','PLAN_COUNTY_NAME':'ישוב','PLAN_COUNTY_CODE':'קוד ישוב','ENTITY_SUBTYPE_DESC':'סוג תכנית','PL_NUMBER':'מספר תכנית','PL_NAME':'שם תכנית','PL_AREA_DUNAM':'שטח תכנית בדונם','DEPOSITING_DATE':'הפקדה','PL_DATE_8':'פרסום לאישור ברשומות','מטרות':'מטרות','PL_LANDUSE_STRING':'PL_LANDUSE_STRING','STATION':'תחנה','STATION_DESC':'STATION_DESC','PL_BY_AUTH_OF':'סמכות','PL_URL':'PL_URL','Shape_Area':'SHAPE_Area','QUANTITY_DELTA_120':'QUANTITY_DELTA_120','QUANTITY_DELTA_60':'תעסוקה','QUANTITY_DELTA_75':'מסחר','QUANTITY_DELTA_80':'מבני ציבור','QUANTITY_DELTA_105':'תירות','QUANTITY_DELTA_125':'מגורים','LAYER_ID':'LAYER_ID','DEFQ':'DEFQ','MAVAT_CODE':'MAVAT_CODE','REMARKS':'REMARKS','LAST_UPDATE':'LAST_UPDATE','PL_ORDER_PRINT_VERSION':'PL_ORDER_PRINT_VERSION','PL_TASRIT_PRN_VERSION':'PL_TASRIT_PRN_VERSION','pa_concat':'pa_concat','ja_concat':'ja_concat','en_concat':'en_concat' },'geometryType':'esriGeometryPolygon','spatialReference':{ 'wkid':102100,'latestWkid':3857 },'fields':[{ 'name':'OBJECTID','type':'esriFieldTypeOID','alias':'OBJECTID' },{ 'name':'PLAN_AREA_CODE','type':'esriFieldTypeDouble','alias':'קוד מרחב תכנון' },{ 'name':'JURSTICTION_CODE','type':'esriFieldTypeDouble','alias':'קוד גבול שיפוט' },{ 'name':'PLAN_COUNTY_NAME','type':'esriFieldTypeString','alias':'ישוב','length':78 },{ 'name':'PLAN_COUNTY_CODE','type':'esriFieldTypeDouble','alias':'קוד ישוב' },{ 'name':'ENTITY_SUBTYPE_DESC','type':'esriFieldTypeString','alias':'סוג תכנית','length':78 },{ 'name':'PL_NUMBER','type':'esriFieldTypeString','alias':'מספר תכנית','length':78 },{ 'name':'PL_NAME','type':'esriFieldTypeString','alias':'שם תכנית','length':78 },{ 'name':'PL_AREA_DUNAM','type':'esriFieldTypeDouble','alias':'שטח תכנית בדונם' },{ 'name':'DEPOSITING_DATE','type':'esriFieldTypeDate','alias':'הפקדה','length':8 },{ 'name':'PL_DATE_8','type':'esriFieldTypeDate','alias':'פרסום לאישור ברשומות','length':8 },{ 'name':'מטרות','type':'esriFieldTypeString','alias':'מטרות','length':250 },{ 'name':'PL_LANDUSE_STRING','type':'esriFieldTypeString','alias':'PL_LANDUSE_STRING','length':4000 },{ 'name':'STATION','type':'esriFieldTypeDouble','alias':'תחנה' },{ 'name':'STATION_DESC','type':'esriFieldTypeString','alias':'STATION_DESC','length':26 },{ 'name':'PL_BY_AUTH_OF','type':'esriFieldTypeDouble','alias':'סמכות' },{ 'name':'PL_URL','type':'esriFieldTypeString','alias':'PL_URL','length':255 },{ 'name':'Shape_Area','type':'esriFieldTypeDouble','alias':'SHAPE_Area' },{ 'name':'QUANTITY_DELTA_120','type':'esriFieldTypeDouble','alias':'QUANTITY_DELTA_120' },{ 'name':'QUANTITY_DELTA_60','type':'esriFieldTypeDouble','alias':'תעסוקה' },{ 'name':'QUANTITY_DELTA_75','type':'esriFieldTypeDouble','alias':'מסחר' },{ 'name':'QUANTITY_DELTA_80','type':'esriFieldTypeDouble','alias':'מבני ציבור' },{ 'name':'QUANTITY_DELTA_105','type':'esriFieldTypeDouble','alias':'תירות' },{ 'name':'QUANTITY_DELTA_125','type':'esriFieldTypeDouble','alias':'מגורים' },{ 'name':'LAYER_ID','type':'esriFieldTypeInteger','alias':'LAYER_ID' },{ 'name':'DEFQ','type':'esriFieldTypeInteger','alias':'DEFQ' },{ 'name':'MAVAT_CODE','type':'esriFieldTypeInteger','alias':'MAVAT_CODE' },{ 'name':'REMARKS','type':'esriFieldTypeString','alias':'REMARKS','length':200 },{ 'name':'LAST_UPDATE','type':'esriFieldTypeString','alias':'LAST_UPDATE','length':20 },{ 'name':'PL_ORDER_PRINT_VERSION','type':'esriFieldTypeDouble','alias':'PL_ORDER_PRINT_VERSION' },{ 'name':'PL_TASRIT_PRN_VERSION','type':'esriFieldTypeDouble','alias':'PL_TASRIT_PRN_VERSION' },{ 'name':'pa_concat','type':'esriFieldTypeString','alias':'pa_concat','length':500 },{ 'name':'ja_concat','type':'esriFieldTypeString','alias':'ja_concat','length':500 },{ 'name':'en_concat','type':'esriFieldTypeString','alias':'en_concat','length':500 }],'features':[{ 'attributes':{ 'OBJECTID':17738,'PLAN_AREA_CODE':263,'JURSTICTION_CODE':7501,'PLAN_COUNTY_NAME':'גם סח\'נין','PLAN_COUNTY_CODE':7501,'ENTITY_SUBTYPE_DESC':'תכנית מתאר מקומית מעודכנת','PL_NUMBER':'262-0907907','PL_NAME':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין - מעודכנן','PL_AREA_DUNAM':0.65600000000000004,'DEPOSITING_DATE':null,'PL_DATE_8':null,'מטרות':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין ^ שינוי בהוראות וזכויות הבניה במגרש בנוי בשכונה המזרחית בסכנין ^ הסדרת קוי בניין\r\nהגדלת תכסית קרקע\r\nהגדלת אחוזי בניה\r\nקביעת תנאים להריסת סככה חורגת בתוואי דרך\r\nקביעת תנאים למתן היתר בניה\r\nמעודכן','PL_LANDUSE_STRING':'מגורים ג','STATION':71,'STATION_DESC':'סמכות מקומית בתהליך מעודכן','PL_BY_AUTH_OF':4,'PL_URL':'http://mavat.moin.gov.il/MavatPS//SV4.aspx?tid=4&mp_id=6oPTq5cInWPLIDZGBgm%2FSnfalx%2FVwm9UcvmKLvTYaL%2FuYZolDZ5tUxUpY3ytnoDHbxhrz2lPI%2ByU%2F9tTjWKx2ulXWKLPLb4PmLuaqSOPt7Y%3D&et=2','Shape_Area':656.2206166598945,'QUANTITY_DELTA_120':0,'QUANTITY_DELTA_60':1,'QUANTITY_DELTA_75':1,'QUANTITY_DELTA_80':1,'QUANTITY_DELTA_105':1,'QUANTITY_DELTA_125':1,'LAYER_ID':4058838,'DEFQ':null,'MAVAT_CODE':20011,'REMARKS':null,'LAST_UPDATE':'20201003092718      ','PL_ORDER_PRINT_VERSION':2,'PL_TASRIT_PRN_VERSION':2,'pa_concat':'לב הגליל מעודכן','ja_concat':'סח\'נין מעודכן','en_concat':null },'geometry':{ 'rings':[[[3930053.80647880,3876669.3068521187],[3930064.968131647,3876668.5508384235],[3930070.2667117236,3876669.4035235812],[3930070.9940953102,3876649.9953845386],[3930038.6509795688,3876649.3163289494],[3930036.3711044193,3876650.5552507826],[3930033.3768539388,3876650.9356909228],[3930021.2490044675,3876652.6631158829],[3930023.3139998988,3876665.7636409459],[3930027.2544126093,3876670.919169196],[3930034.105045599,3876670.5496508736],[3930042.8205890163,3876670.0507389830],[3930053.80647880,3876669.3068521187]]] } }] });

		// run crawler cron again with limit of 1 plan
		await cronController.iplan(1);

		iPlanScope.done();
		newMavatScope.done();

		// there should still be only one plan
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 1, 'only a single updated plan should be available');
		assert.equal(plans.models[0].id, 1, 'updated single plan\'s id should still be the first one');

		// read specific plan to obtain all fields
		plan = await planController.read({ params: { id: 1 } });

		// make sure all fields were not changed
		assert.equal(plan.attributes.OBJECTID, 17737, 'read plan object id was not changed');
		assert.equal(plan.attributes.PLAN_COUNTY_NAME, 'סח\'נין', 'read plan county name was not changed');
		assert.equal(plan.attributes.PL_NAME, 'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין', 'updated read plan name was not changed');
		assert.equal(plan.attributes.plan_url, 'https://mavat.iplan.gov.il/SV4/1/2005099108/310', 'updated read plan url was not changed');
		assert.equal(plan.attributes.status, 'סמכות מקומית בתהליך', 'updated read plan status was not changed');

		// wait 5 seconds to test updated_at field
		await wait(5);

		// new iplan values with an updated LAST_UPDATE value will be crawled and saved
		iPlanScope
			.get('/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query')
			// allow all query string params so we don't deal with field names etc.
			.query(true)
			// actual reply copied from iplan of a single plan
			.reply(200, { 'displayFieldName':'pl_number','fieldAliases':{ 'objectid':'OBJECTID','plan_county_name':'ישוב','entity_subtype_desc':'סוג תכנית','pl_number':'מספר תכנית','pl_name':'שם תכנית','pl_area_dunam':'שטח תכנית רשום','depositing_date':'דיון בהפקדה','pl_date_8':'פרסום אישור','pl_landuse_string':'יעודי קרקע','station_desc':'סטטוס','pl_by_auth_of':'סמכות','pl_url':'PL_URL','shape_area':'shape_area','quantity_delta_120':'יחד מוצע שינוי','quantity_delta_125':'מר מגורים מוצע','last_update':'LAST_UPDATE','pl_order_print_version':'PL_ORDER_PRINT_VERSION','pl_tasrit_prn_version':'PL_TASRIT_PRN_VERSION', },'geometryType':'esriGeometryPolygon','spatialReference':{ 'wkid':102100,'latestWkid':3857 },'fields':[{ 'name':'objectid','type':'esriFieldTypeOID','alias':'OBJECTID' },{ 'name':'plan_county_name','type':'esriFieldTypeString','alias':'ישוב','length':78 },{ 'name':'entity_subtype_desc','type':'esriFieldTypeString','alias':'סוג תכנית','length':78 },{ 'name':'pl_number','type':'esriFieldTypeString','alias':'מספר תכנית','length':78 },{ 'name':'pl_name','type':'esriFieldTypeString','alias':'שם תכנית','length':78 },{ 'name':'pl_area_dunam','type':'esriFieldTypeDouble','alias':'שטח תכנית בדונם' },{ 'name':'depositing_date','type':'esriFieldTypeDate','alias':'הפקדה','length':8 },{ 'name':'pl_date_8','type':'esriFieldTypeDate','alias':'פרסום לאישור ברשומות','length':8 },{ 'name':'pl_landuse_string','type':'esriFieldTypeString','alias':'PL_LANDUSE_STRING','length':4000 },{ 'name':'station_desc','type':'esriFieldTypeString','alias':'STATION_DESC','length':26 },{ 'name':'pl_by_auth_of','type':'esriFieldTypeDouble','alias':'סמכות' },{ 'name':'pl_url','type':'esriFieldTypeString','alias':'PL_URL','length':255 }, { 'name':'shape_area','type':'esriFieldTypeDouble','alias':'shape_area' },{ 'name':'quantity_delta_120','type':'esriFieldTypeDouble','alias':'יחד מוצע שינוי' },{ 'name':'quantity_delta_125','type':'esriFieldTypeDouble','alias':'מר מגורים מוצע' },{ 'name':'last_update','type':'esriFieldTypeString','alias':'LAST_UPDATE','length':20 },{ 'name':'pl_order_print_version','type':'esriFieldTypeDouble','alias':'PL_ORDER_PRINT_VERSION' },{ 'name':'pl_tasrit_prn_version','type':'esriFieldTypeDouble','alias':'PL_TASRIT_PRN_VERSION' }],'features':[{ 'attributes':{ 'objectid':17738,'plan_county_name':'גם סח\'נין','entity_subtype_desc':'תכנית מתאר מקומית מעודכנת','pl_number':'262-0907907','pl_name':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין - מעודכן','pl_area_dunam':0.657,'depositing_date':null,'pl_date_8':null,'pl_landuse_string':'מגורים ג','station_desc':'סמכות מקומית בתהליך מעודכן','pl_by_auth_of':4,'pl_url':'https://mavat.iplan.gov.il/SV4/1/2005099108/310','shape_area':656.2206166598945,'quantity_delta_120':1,'quantity_delta_125':1,'last_update':'20201003092719      ','pl_order_print_version':2,'pl_tasrit_prn_version':2 },'geometry':{ 'rings':[[[3930153.80647880,3876669.3068521187],[3930164.968131647,3876668.5508384235],[3930170.2667117236,3876669.4035235812],[3930170.9940953102,3876649.9953845386],[3930138.6509795688,3876649.3163289494],[3930136.3711044193,3876650.5552507826],[3930133.3768539388,3876650.9356909228],[3930121.2490044675,3876652.6631158829],[3930123.3139998988,3876665.7636409459],[3930127.2544126093,3876670.919169196],[3930134.105045599,3876670.5496508736],[3930142.8205890163,3876670.0507389830],[3930153.80647880,3876669.3068521187]]] } }] });

			
		// mock mavat single plan page
		newMavatScope
			.get('/rest/api/SV4/1/?mid=2005099108')
		// actual reply copied from a browser performing the API response
			.replyWithFile(
				200,
				`${__dirname}/files/new_mavat_plan_json_page_updated.html`,
				{ 'Content-Type': 'text/html' }
			).get('/rest/api/Attacments/?eid=6000661941817&edn=9F9FF6CF1A89FA43A8705326272E61E75BCE98F745EDFE9FC08FF33E934A19AA')
		 // reply is an updated modified pdf file from mavat (personal details removed)
		 .replyWithFile(
			200,
		 	`${__dirname}/files/mavat_plan_instructions.updated.pdf`,
		 	{ 'Content-Type': 'application/pdf' }
		 );

		// run crawler cron with limit of 1 plan
		await cronController.iplan(1);

		iPlanScope.done();
		newMavatScope.done();

		// there should still be only one plan
		plans = await planController.browse({ query: { status: null, query: null } });
		assert.equal(plans.length, 1, 'only a single updated plan should be available');
		assert.equal(plans.models[0].id, 1, 'updated single plan\'s id should still be the first one');

		// read specific plan to obtain all fields
		plan = await planController.read({ params: { id: 1 } });

		// make sure all fields are correct
		assert.equal(plan.id, 1, 'updated read plan id is correct');
		assert.equal(plan.attributes.sent, 0, 'updated read plan sent value is the default');
		assert.equal(plan.attributes.OBJECTID, 17738, 'updated read plan object id is correct');
		assert.equal(plan.attributes.PLAN_COUNTY_NAME, 'גם סח\'נין', 'updated read plan county name is correct');
		assert.equal(plan.attributes.PL_NUMBER, '262-0907907', 'updated read plan number is correct');
		assert.equal(plan.attributes.PL_NAME, 'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין - מעודכן', 'updated read plan name is correct');
		assert.equal(plan.attributes.PLAN_CHARACTOR_NAME, '', 'updated read charactor name is the default value');
		assert.deepEqual(plan.attributes.data, { 'OBJECTID':17738,'PLAN_COUNTY_NAME':'גם סח\'נין','ENTITY_SUBTYPE_DESC':'תכנית מתאר מקומית מעודכנת','PL_NUMBER':'262-0907907','PL_NAME':'שינוי בהוראות וזכויות הבניה בית עטיה אבו סאלח - סכנין - מעודכן','PL_AREA_DUNAM':0.657,'DEPOSITING_DATE':null,'PL_DATE_8':null,'PL_LANDUSE_STRING':'מגורים ג','STATION_DESC':'סמכות מקומית בתהליך מעודכן','PL_BY_AUTH_OF':4,'PL_URL':'https://mavat.iplan.gov.il/SV4/1/2005099108/310','SHAPE_AREA':656.2206166598945,'QUANTITY_DELTA_120':1,'QUANTITY_DELTA_125':1,'LAST_UPDATE':'20201003092719      ','PL_ORDER_PRINT_VERSION':2,'PL_TASRIT_PRN_VERSION':2, plan_new_mavat_url: 'https://mavat.iplan.gov.il/SV4/1/2005099108/310', MP_ID: '2005099108' }, 'updated read plan data is correct');
		assert.deepEqual(plan.attributes.geom, { 'type': 'Polygon','coordinates': [[[35.30517233300422,32.85949663407329],[35.305073645077194,32.85950224735488],[35.30499535201859,32.85950601208433],[35.30493381173538,32.8595088004253],[35.30489841440574,32.859469897419274],[35.30487986423617,32.859371042330814],[35.3049888105616,32.859358007368165],[35.305015708371315,32.8593551366076],[35.305036188838244,32.85934578783543],[35.305326731990306,32.859350911916685],[35.30532019779237,32.85949736354464],[35.30527259983771,32.8594909292837],[35.30517233300422,32.85949663407329]]] }, 'updated read plan geometry is correct');
		assert.deepEqual(plan.attributes.geom_centroid, { 'x': 35.305108976534804, 'y': 32.8594249085996 });
		assert.equal(plan.attributes.plan_url, 'https://mavat.iplan.gov.il/SV4/1/2005099108/310', 'updated read plan url is correct');
		assert.equal(plan.attributes.goals_from_mavat, 'שינוי בהוראות וזכויות הבניה במגרש בנוי בשכונה המזרחית בסכנין - מעודכן', 'updated read plan goals from mavat are correct');
		assert.equal(plan.attributes.main_details_from_mavat, 'הסדרת קוי בניין\r\nהגדלת תכסית קרקע\r\nהגדלת אחוזי בניה\r\nקביעת תנאים להריסת סככה חורגת בתוואי דרך\r\nקביעת תנאים למתן היתר בניה', 'updated read plan main details from mavat are correct');
		assert.equal(plan.attributes.jurisdiction, 'מקומית מעודכן', 'updated read plan jurisdiction is correct');
		assert.equal(plan.attributes.status, 'סמכות מקומית בתהליך מעודכן', 'updated read plan status is correct');
		assert.deepEqual(JSON.parse(plan.attributes.areaChanges), [[
			{ '1': '2000889726', '2': '121', '3': 'מגורים (יח"ד)', '4': 'יח"ד', '5': '+7', '6': '', '7': '7', '8': '', '9': ' ' },
			{ '1': '2000889728', '2': '126', '3': 'מגורים (מ"ר)', '4': 'מ"ר', '5': '+945', '6': '', '7': '945', '8': '', '9': ' ' }
		]], 'updated read plan area changes are correct');
		assert.equal(plan.attributes.rating, 0, 'updated read plan rating is the default value');
		assert.equal(plan.attributes.views, 0, 'updated read plan views are the default value');
		assert.equal(plan.attributes.erosion_views, 0, 'updated read plan erosion views are the default value');
		assert.isTrue(plan.attributes.explanation.startsWith('התכנית שייכת למגרש מאושר מס'), 'pdf-read plan explanation is correct');

		// creation date should be less than current date minus 5 seconds and update should be
		// above it. creation date should not equal update date
		assert.isBelow(plan.attributes.created_at.getTime(), new Date().getTime() - 3000, 'plan created_at value earlier than current time minus 3 seconds');
		assert.isAbove(plan.attributes.updated_at.getTime(), new Date().getTime() - 3000, 'plan updated_at value later than current time minus 3 seconds');
		assert.isAbove(plan.attributes.updated_at.getTime() - plan.attributes.created_at.getTime(), 500, 'plan created_at and updated_at differ by more than 5 seconds of each other (since the plan is actually created with iplan data and then updated with mavat data)');

		// fetch all chart one point eight rows - both should be updated
		chartOneEightRows = await chartOneEightModel.fetchAll();
		assert.equal(chartOneEightRows.length, 2, 'updated two chart 1.8 rows were scraped');

		// make sure all first chart one point eight row fields are correct
		assert.equal(chartOneEightRows.models[0].id, 3, 'first chart 1.8 row id is correct');
		assert.equal(chartOneEightRows.models[0].attributes.plan_id, 1, 'first chart 1.8 row is related to the correct plan');
		assert.equal(chartOneEightRows.models[0].attributes.origin, '1.8.1', 'first chart 1.8 row origin is correct');
		assert.equal(chartOneEightRows.models[0].attributes.profession, '', 'first chart 1.8 row profession is correct');
		assert.equal(chartOneEightRows.models[0].attributes.type, 'פומבי', 'first chart 1.8 row type is correct');
		assert.equal(chartOneEightRows.models[0].attributes.description, null, 'first chart 1.8 row description is correct');
		assert.equal(chartOneEightRows.models[0].attributes.name, 'אחר מגיש שם', 'first chart 1.8 row name is correct');
		assert.equal(chartOneEightRows.models[0].attributes.license_number, '', 'first chart 1.8 row license_number is correct');
		assert.equal(chartOneEightRows.models[0].attributes.corporate, '', 'first chart 1.8 row corporate is correct');
		assert.equal(chartOneEightRows.models[0].attributes.city, 'סח\'נין', 'first chart 1.8 row city is correct');
		assert.equal(chartOneEightRows.models[0].attributes.street, 'העיר מרכז', 'first chart 1.8 row street is correct');
		assert.equal(chartOneEightRows.models[0].attributes.house, '', 'first chart 1.8 row house is correct');
		assert.equal(chartOneEightRows.models[0].attributes.phone, '333-3333333', 'first chart 1.8 row phone is correct');
		assert.equal(chartOneEightRows.models[0].attributes.fax, '222-2222222', 'first chart 1.8 row fax is correct');
		assert.equal(chartOneEightRows.models[0].attributes.email, '', 'first chart 1.8 row email is correct');

		// make sure all second chart one point eight row fields are correct
		assert.equal(chartOneEightRows.models[1].id, 4, 'second chart 1.8 row id is correct');
		assert.equal(chartOneEightRows.models[1].attributes.plan_id, 1, 'second chart 1.8 row is related to the correct plan');
		assert.equal(chartOneEightRows.models[1].attributes.origin, '1.8.2', 'second chart 1.8 row origin is correct');
		assert.equal(chartOneEightRows.models[1].attributes.profession, null, 'second chart 1.8 row profession is correct');
		assert.equal(chartOneEightRows.models[1].attributes.type, 'פומבי', 'second chart 1.8 row type is correct');
		assert.equal(chartOneEightRows.models[1].attributes.description, null, 'second chart 1.8 row description is correct');
		assert.equal(chartOneEightRows.models[1].attributes.name, 'אחר יזם שם', 'second chart 1.8 row name is correct');
		assert.equal(chartOneEightRows.models[1].attributes.license_number, '', 'second chart 1.8 row license_number is correct');
		assert.equal(chartOneEightRows.models[1].attributes.corporate, '', 'second chart 1.8 row corporate is correct');
		assert.equal(chartOneEightRows.models[1].attributes.city, 'סח\'נין', 'second chart 1.8 row city is correct');
		assert.equal(chartOneEightRows.models[1].attributes.street, 'העיר מזרח', 'second chart 1.8 row street is correct');
		assert.equal(chartOneEightRows.models[1].attributes.house, '', 'second chart 1.8 row house is correct');
		assert.equal(chartOneEightRows.models[1].attributes.phone, '555-5555555', 'second chart 1.8 row phone is correct');
		assert.equal(chartOneEightRows.models[1].attributes.fax, '444-4444444', 'second chart 1.8 row fax is correct');
		assert.equal(chartOneEightRows.models[1].attributes.email, '', 'second chart 1.8 row email is correct');

		// fetch all chart four rows - both should be updated
		chartFourRows = await chartFourModel.fetchAll();
		assert.equal(chartFourRows.length, 2, 'updated two chart 4 rows were scraped');

		// make sure all first chart four row fields are correct
		assert.equal(chartFourRows.models[0].id, 3, 'first chart 4 row id is correct');
		assert.equal(chartFourRows.models[0].attributes.plan_id, 1, 'first chart 4 row is related to the correct plan');
		assert.equal(chartFourRows.models[0].attributes.category_number, '4.1.3', 'first chart 4 row category number is correct');
		assert.equal(chartFourRows.models[0].attributes.category, 'מעודכן שימושים', 'first chart 4 row category is correct');
		assert.equal(chartFourRows.models[0].attributes.father_category_number, '4.1', 'first chart 4 row father category number is correct');
		assert.equal(chartFourRows.models[0].attributes.father_category, 'מגורים ב\'', 'first chart 4 row father category is correct');
		assert.equal(chartFourRows.models[0].attributes.text, 'בתי מגורים\nמועדונים חברתיים - באישור הועדה המקומית ובתנאי שלא יגרמו למטרדי רעש לדיירים\nגני ילדים, פעוטונים, מגרשי משחקים, גנים, שטחי חניה\nמשרדים לבעלי מקצועות חופשיים\nחניות פרטיות ומשותפות להחניית רכב או מכונה חקלאית\nחנויות למסחר קמעונאי, מספרות ומכוני יופי, הכל בתנאי שסה"כ שטחיהם לא יעלה על רבע )1/4( \nמסה"כ השטחים המותרים לבניה במגרש, תוך הקצאת מקומות חניה עפ"י תקן החניה ובתחום \nמעודכן המגרש', 'first chart 4 row text is correct');

		// make sure all second chart four row fields are correct
		assert.equal(chartFourRows.models[1].id, 4, 'second chart 4 row id is correct');
		assert.equal(chartFourRows.models[1].attributes.plan_id, 1, 'second chart 4 row is related to the correct plan');
		assert.equal(chartFourRows.models[1].attributes.category_number, '4.1.4', 'second chart 4 row category number is correct');
		assert.equal(chartFourRows.models[1].attributes.category, 'מעודכן הוראות', 'second chart 4 row category is correct');
		assert.equal(chartFourRows.models[1].attributes.father_category_number, '4.1', 'second chart 4 row father category number is correct');
		assert.equal(chartFourRows.models[1].attributes.father_category, 'מגורים ב\'', 'second chart 4 row father category is correct');
		assert.equal(chartFourRows.models[1].attributes.text, 'בינוי ו/או פיתוח \nרשאית הועדה המקומית להגדיל זכויות בניה לצורכי מסחר קמעונאי באזורי מגורים מתוך סה"כ \nאחוזי הבניה המותרים וזאת בתנאים הבאים :\nא. קבלת אישור משרד התחבורה בדבר תפקוד הדרך והצמתים הסמוכים ובדבר התקנת מקומות \nחניה בתוך המגרש.\nב. אישור המשרד לאיכות הסביבה בדבר אי הפרעות הפונקציות המסחריות למבני המגורים \nמעודכן הסמוכים', 'second chart 4 row text is correct');

		// fetch all chart five rows - the single row was updated
		chartFiveRows = await chartFiveModel.fetchAll();
		assert.equal(chartFiveRows.length, 1, 'one chart 5 row was scraped');

		// make sure all first chart five row fields are correct
		assert.equal(chartFiveRows.models[0].id, 2, 'first chart 5 row id is correct');
		assert.equal(chartFiveRows.models[0].attributes.plan_id, 1, 'first chart 5 row is related to the correct plan');
		assert.equal(chartFiveRows.models[0].attributes.designation, 'ג\' מגורים', 'first chart 5 row designation is correct');
		assert.equal(chartFiveRows.models[0].attributes.use, null, 'first chart 5 row use is correct');
		assert.equal(chartFiveRows.models[0].attributes.area_number, '4', 'first chart 5 row area_number is correct');
		assert.equal(chartFiveRows.models[0].attributes.location, null, 'first chart 5 row location is correct');
		assert.equal(chartFiveRows.models[0].attributes.field_size_sqm, '657', 'first chart 5 row field_size_sqm is correct');
		assert.equal(chartFiveRows.models[0].attributes.above_primary_main, '151', 'first chart 5 row above_primary_main is correct');
		assert.equal(chartFiveRows.models[0].attributes.above_primary_service, '21', 'first chart 5 row above_primary_service is correct');
		assert.equal(chartFiveRows.models[0].attributes.below_primary_main, null, 'first chart 5 row below_primary_main is correct');
		assert.equal(chartFiveRows.models[0].attributes.below_primary_service, null, 'first chart 5 row below_primary_service is correct');
		assert.equal(chartFiveRows.models[0].attributes.building_percentage, '(2) 170', 'first chart 5 row building_percentage is correct');
		assert.equal(chartFiveRows.models[0].attributes.tahsit, '66', 'first chart 5 row tahsit is correct');
		assert.equal(chartFiveRows.models[0].attributes.density_yahad_to_dunam, null, 'first chart 5 row density_yahad_to_dunam is correct');
		assert.equal(chartFiveRows.models[0].attributes.num_of_housing_units, '8', 'first chart 5 row num_of_housing_units is correct');
		assert.equal(chartFiveRows.models[0].attributes.floors_above, '5', 'first chart 5 row floors_above is correct');
		assert.equal(chartFiveRows.models[0].attributes.floors_below, null, 'first chart 5 row floors_below is correct');
		assert.equal(chartFiveRows.models[0].attributes.overall_building_land, null, 'first chart 5 row overall_building_land is correct');
		assert.equal(chartFiveRows.models[0].attributes.height_above_entrance, '(3) 15', 'first chart 5 row height_above_entrance is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_right, '(4)', 'first chart 5 row side_line_right is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_left, '(4)', 'first chart 5 row side_line_left is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_back, '(4)', 'first chart 5 row side_line_back is correct');
		assert.equal(chartFiveRows.models[0].attributes.side_line_front, '(4)', 'first chart 5 row side_line_front is correct');

		// fetch all chart six rows - one should be updated
		chartSixRows = await chartSixModel.fetchAll();
		assert.equal(chartSixRows.length, 13, 'thirteen chart 6 rows were scraped');

		// make sure all first chart six row fields are correct
		assert.equal(chartSixRows.models[0].id, 14, 'first chart 6 row id is correct');
		assert.equal(chartSixRows.models[0].attributes.plan_id, 1, 'first chart 6 row is related to the correct plan');
		assert.equal(chartSixRows.models[0].attributes.category_number, '6.1', 'first chart 6 row category number is correct');
		assert.equal(chartSixRows.models[0].attributes.category, 'הוראות מתאריות', 'first chart 6 row category is correct');
		assert.equal(chartSixRows.models[0].attributes.text.slice(0, 17), 'מניין אחוזי בנייה', 'first chart 6 row text beginning is correct');

		// make sure all third chart six row fields are correct
		assert.equal(chartSixRows.models[1].id, 15, 'second chart 6 row id is correct');
		assert.equal(chartSixRows.models[1].attributes.plan_id, 1, 'second chart 6 row is related to the correct plan');
		assert.equal(chartSixRows.models[1].attributes.category_number, '6.14', 'second chart 6 row category number is correct');
		assert.equal(chartSixRows.models[1].attributes.category, 'מעודכן עתיקות', 'second chart 6 row category is correct');
		assert.equal(chartSixRows.models[1].attributes.text.slice(0, 18), 'כל עבודה בתחום שטח', 'second chart 6 row text beginning is correct');

		// fetch all file rows
		fileRows = await fileModel.fetchAll();
		assert.equal(fileRows.length, 7, 'seven file rows were scraped');

		// make sure all first file row fields are correct
		assert.equal(fileRows.models[0].id, 8, 'first file row id is correct');
		assert.equal(fileRows.models[0].attributes.plan_id, 1, 'first file row is related to the correct plan');
		assert.equal(fileRows.models[0].attributes.tree_id, null, 'first file row tree id is correct');
		assert.equal(fileRows.models[0].attributes.type, 'PDF', 'first file row type is correct');
		assert.equal(fileRows.models[0].attributes.extension, 'pdf', 'first file row extension is correct');
		assert.equal(fileRows.models[0].attributes.link, 'https://mavat.iplan.gov.il/rest/api/Attacments/?eid=77000661941773&edn=7A5902AE1493843AE0D9F82C89CE7F879827799F5BEF228F96E04936E0A26016', 'first file row link is correct');
		assert.equal(fileRows.models[0].attributes.source, 'MAVAT', 'first file row source is correct');
		assert.equal(fileRows.models[0].attributes.name, 'מצב מאושר', 'first file row name is correct');
	});
});
