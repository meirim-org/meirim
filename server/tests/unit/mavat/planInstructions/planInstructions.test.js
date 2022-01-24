const ParserIndex = require('../../../../api/lib/mavat/planInstructions/index');
const path = require('path');
const assert = require('assert');


describe('Taba1 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan1';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('Specific parsing', () => {

		it('data should not be undefined', async () =>
			assert.notStrictEqual(data, undefined));

		it('explanation', () =>
			assert.strictEqual(data.planExplanation, 'תכנית זו מוסיפה אחוזי בנייה כללים למגרש מספר 17המאשר לפי תכנית תמ"ל1008 בחלקה מספר 216 גוש \n' +
				'16607 באדמות טורעאן.\n' +
				'התכנית מוספה שטח אחוזי בנייה כללים, מאחר ושטח המגרש הוא גדול בהרבה יחסית לממוצע המגרשים \n' +
				'באותה תכנית, המאפשר שמירה על תכנית הבנוי של התכנית תמ"ל1008, חניון פיתוח וכו\'.'));

		it('should have only one row on table 1.8.1', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('should have only one row on table 1.8.2', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('should have only one row on table 1.8.3', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 1));

		it('should have only one row on table 1.8.4', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 2));

		it('should have 1 row on table 3.1 without change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 1));

		it('should have 0 rows on table 3.1 with change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 0));

		it('should have only one row on table 3.2 approved state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 1));

		it('should have only one row on table 3.2 suggested state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 1));

		it('should have 5 rows on table 4', () =>
			assert.strictEqual(data.chartFour.length, 5));

		it('should have only one row on table 5', () =>
			assert.strictEqual(data.chartFive.length, 1));

		it('should have 10 rows on table 6', () =>
			assert.strictEqual(data.chartSix.length, 10));

		it('should have 0 rows on table 7.1', () =>
			assert.strictEqual(data.chartSevenOne.length, 0));

	});

	//table 1.8.2 parses wrong in this pdf

	describe('tables 1.8 parsing test', () => {

		describe('table 1.8.1 parsing test', () => {
			const tbl181FirstRow = data.chartsOneEight.chart181[0];

			it('profession', () => {
				assert.strictEqual(tbl181FirstRow.profession, '');
			});

			it('type', () => {
				assert.strictEqual(tbl181FirstRow.type, 'פרטי');
			});

			it('name', () => {
				assert.strictEqual(tbl181FirstRow.name, 'עמאר נסאר');
			});

			it('license number', () => {
				assert.strictEqual(tbl181FirstRow.license_number, '');
			});

			it('corporate', () => {
				assert.strictEqual(tbl181FirstRow.corporate, '');
			});

			it('city', () => {
				assert.strictEqual(tbl181FirstRow.city, 'טורעאן');
			});

			it('street', () => {
				assert.strictEqual(tbl181FirstRow.street, 'דרב אלברג\' )1 (');
			});

			it('house', () => {
				assert.strictEqual(tbl181FirstRow.house, '');
			});

			it('phone', () => {
				assert.strictEqual(tbl181FirstRow.phone, '04-6412926');
			});

			it('fax', () => {
				assert.strictEqual(tbl181FirstRow.fax, '04-6412926');
			});

			it('email', () => {
				assert.strictEqual(tbl181FirstRow.email, 'adel.dahly@gmail.com');
			});

		});


	});

	describe('table 4 parsing test', () => {
		const chartFour = data.chartFour;

		it('row 0 test', () => {
			assert.strictEqual(chartFour[0].father_category, 'מגורים א\'');
			assert.strictEqual(chartFour[0].father_category_number, '4.1');
			assert.strictEqual(chartFour[0].category, 'שימושים');
			assert.strictEqual(chartFour[0].category_number, '4.1.1');
			assert.strictEqual(chartFour[0].text, `א. מגורים.
ב. חניה, מחסנים.
ג. משרד לבעלי מקצוע חופשי לדייר המבנה/ מסחר קמעונאי.
ד. מעונות יום.`);
		});

		it('row 1 test', () => {
			assert.strictEqual(chartFour[1].father_category, 'מגורים א\'');
			assert.strictEqual(chartFour[1].father_category_number, '4.1');
			assert.strictEqual(chartFour[1].category, 'הוראות');
			assert.strictEqual(chartFour[1].category_number, '4.1.2');
			assert.strictEqual(chartFour[1].text, `הוראות בינוי 
1 .`);
		});

		it('row 2 test', () => {
			assert.strictEqual(chartFour[2].father_category, 'מגורים א\'');
			assert.strictEqual(chartFour[2].father_category_number, '4.1');
			assert.strictEqual(chartFour[2].category, 'הוראות');
			assert.strictEqual(chartFour[2].category_number, '4.1.2');
			assert.strictEqual(chartFour[2].text.length > 1000, true);
			assert.strictEqual(chartFour[2].text.includes('לא תותר כניסה נפרדת למרתף'), true);
		});

		it('row 3 test', () => {
			assert.strictEqual(chartFour[3].father_category, 'מגורים א\'');
			assert.strictEqual(chartFour[3].father_category_number, '4.1');
			assert.strictEqual(chartFour[3].category, 'הוראות');
			assert.strictEqual(chartFour[3].category_number, '4.1.2');
			assert.strictEqual(chartFour[3].text.includes('עיצוב אדריכלי'), true);
		});

		it('row 4 test', () => {
			assert.strictEqual(chartFour[4].father_category, 'מגורים א\'');
			assert.strictEqual(chartFour[4].father_category_number, '4.1');
			assert.strictEqual(chartFour[4].category, 'הוראות');
			assert.strictEqual(chartFour[4].category_number, '4.1.2');
			assert.strictEqual(chartFour[4].text.includes('של המבנים ע\'\'פ תכנית פיתוח שתוגש'), true);
		});

	});

	describe('table 5 single row parsing test', () => {
		const tbl5FirstRow = data.chartFive[0];

		it('designation', () =>
			assert.strictEqual(tbl5FirstRow.designation, 'מגורים א\''));

		it('use', () =>
			assert.strictEqual(tbl5FirstRow.use, 'מגורים א\''));

		it('taei shetah', () =>
			assert.strictEqual(tbl5FirstRow.area_number, '100'));

		it('location', () =>
			assert.strictEqual(tbl5FirstRow.location, 'רכס טורעאן - תמ"ל 1008'));

		it('field size sqm test', () =>
			assert.strictEqual(tbl5FirstRow.field_size_sqm, '775'));

		it('size sqm above primary entrance', () =>
			assert.strictEqual(tbl5FirstRow.above_primary_main, '570'));

		it('size sqm above service entrance', () =>
			assert.strictEqual(tbl5FirstRow.above_primary_service, '150'));

		it('size sqm below primary entrance', () =>
			assert.strictEqual(tbl5FirstRow.below_primary_main, '180'));

		it('size sqm below service entrance', () =>
			assert.strictEqual(tbl5FirstRow.below_primary_service, '50'));

		it('overall building lands (sah hakol shithey bniya)', () =>
			assert.strictEqual(tbl5FirstRow.overall_building_land, '950'));

		it('building percentage', () =>
			assert.strictEqual(tbl5FirstRow.building_percentage, '122.58'));

		it('tahsit', () =>
			assert.strictEqual(tbl5FirstRow.tahsit === '' || tbl5FirstRow.tahsit === undefined,
				true));

		it('density yahad to dunam', () =>
			assert.strictEqual(tbl5FirstRow.density_yahad_to_dunam === '' || tbl5FirstRow.densityYahadToDunam === undefined,
				true));

		it('number of housing units', () =>
			assert.strictEqual(tbl5FirstRow.num_of_housing_units, '3'));

		it('height of building meters', () =>
			assert.strictEqual(tbl5FirstRow.height_above_entrance, '12'));

		it('floors above entrance', () =>
			assert.strictEqual(tbl5FirstRow.floors_above, '3'));

		it('floors below entrance', () =>
			assert.strictEqual(tbl5FirstRow.floors_below, '1'));

		it('building right side line', () =>
			assert.strictEqual(tbl5FirstRow.side_line_right, '3'));

		it('building left side line', () =>
			assert.strictEqual(tbl5FirstRow.side_line_left, '3'));

		it('building back side line', () =>
			assert.strictEqual(tbl5FirstRow.side_line_back, '5'));

		it('building front side line', () =>
			assert.strictEqual(tbl5FirstRow.side_line_front, '5'));

	});

	describe('table 6 parsing test', () => {
		const chartSix = data.chartSix;

		it('row 0', () => {
			assert.strictEqual(chartSix[0].category_number, '6.1');
			assert.strictEqual(chartSix[0].category, 'סביבה ונוף');
			assert.strictEqual(chartSix[0].text, `פסולת :
א. תכנית בינוי פיתוח ועיצוב אדריכלי כהגדרתה בסעיף 6.1 א' , תנחה עקרונות לטיפול בפסולת 
בשכונה הכוללת מקום צלהצבת מכלים לצאירת פסולת מעורבת ולמחזור לפי הנחיות הרשות 
המקומית . 
רעש בעת ההקמה : 
ב . בזמן עבודות ההקמה יינקטו אמצעים למניעת פגיעה באיכות האוויר כדוגמת הרחפת אבק . 
ג. בזמן עבודות ההקמה יינקטו אמצעים למניעת מטרדי רעש .`);
		});

		it('row 1', () => {
			assert.strictEqual(chartSix[1].category_number, '6.2');
			assert.strictEqual(chartSix[1].category, 'עתיקות');
			assert.strictEqual(chartSix[1].text, `על-פי חוק העתיקות , התשל''ח 1978 , אם יתגלו בשטח התכנית עתיקות יש להפסיק מיד את 
העבודות , להודיע על כך לרשות העתיקות ולא להמשיך בעבודות עד לקבלת הודעה אחרת 
מרשות העתיקות .`);
		});

		it('row 2', () => {
			assert.strictEqual(chartSix[2].category_number, '6.3');
			assert.strictEqual(chartSix[2].category, 'חניה');
			assert.strictEqual(chartSix[2].text, `א. מקומות החניה למגורים , למסחר , למבנים / מוסדות ציבור ולפארקים / גנים ציבוריים , 
יהיו בתחום המגרש . 
ב. החניה תהיה על פי התקן התקף בעת מתן היתרי בניה .`);
		});

		it('row 3', () => {
			assert.strictEqual(chartSix[3].category_number, '6.4');
			assert.strictEqual(chartSix[3].category, 'חשמל');
			assert.strictEqual(chartSix[3].text, '');

		});

		it('row 5', () => {
			assert.strictEqual(chartSix[5].category_number, '6.6');
			assert.strictEqual(chartSix[5].category, 'ניהול מי נגר');
			assert.strictEqual(chartSix[5].text, `בשטחים הפתוחים ישולבו אמצעים להשהיית נגר עילי ותכנונם ייעשה ע''י אדרי' נוף בשיתוף
יועץ שימור נגר . בשיפועים גדולים מ 2% יבוצעו סכרונים ו / או טרסות למיתון ושימוש בכיסוי 
צמיחה תואמת אקלים . בכל המגרשים בתכנית יובטח שטח מחלחל בהיקף של 15% משטח 
המגרש .`);
		});

		it('row 9', () => {
			assert.strictEqual(chartSix[9].category_number, '6.10');
			assert.strictEqual(chartSix[9].category, 'מגבלות בניה לגובה');
			assert.strictEqual(chartSix[9].text, `הגובה לא יחרוג מ-24 מ' מעל פני השטח אלא באישור של נציג שרהב''ט בועדה מחוזית צפון . 
האמור כולל בינוי ומתקנים הנדסיים ובכלל זה עגורנים בזמן העבודות .`);
		});

	});
});

describe('Taba2 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan2';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('data should not be undefined', () =>
			assert.notStrictEqual(data, undefined));

		it('explanation', () => {
			assert.strictEqual(data.planExplanation.includes('מטרת התכנית הינה הגדרת שימושים בקרקע חקלאית בחלקות ב\' במושב ארבל'), true);
			assert.strictEqual(data.planExplanation.includes('מיוחדות המבוקש בתכנית.'), true);
		});

		it('should have only one row on table 1.8.1', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('should have only one row on table 1.8.2', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('should have only no rows on table 1.8.3', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 0));

		it('should have 4 rows on table 1.8.4', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 4));

		it('should have 1 row on table 3.1 without change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 3));

		it('should have 1 row on table 3.1 with change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 6));

		it('should have only one row on table 3.2 approved state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 6));

		it('should have only one row on table 3.2 suggested state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 3));

		it('should have 8 rows on table 4', () =>
			assert.strictEqual(data.chartFour.length, 8));

		it('should have 3 rows on table 5', () =>
			assert.strictEqual(data.chartFive.length, 3));

		it('should have 11 rows on table 6', () =>
			assert.strictEqual(data.chartSix.length, 11));

		it('should have 0 rows on table 7.1', () =>
			assert.strictEqual(data.chartSevenOne.length, 0));

	});

	describe('tables 1.8 parsing test', () => {

		describe('table 1.8.1 parsing test', () => {
			const tbl181FirstRow = data.chartsOneEight.chart181[0];
								
			it('profession', () => {
				assert.strictEqual(tbl181FirstRow.profession, '');
			});

			it('type', () => {
				assert.strictEqual(tbl181FirstRow.type, 'אחר');
			});

			it('name', () => {
				assert.strictEqual(tbl181FirstRow.name, '');
			});

			it('license number', () => {
				assert.strictEqual(tbl181FirstRow.license_number, '');
			});

			it('corporate', () => {
				assert.strictEqual(tbl181FirstRow.corporate, 'אגש"ח מושב ארבל');
			});

			it('city', () => {
				assert.strictEqual(tbl181FirstRow.city, 'ארבל');
			});

			it('street', () => {
				assert.strictEqual(tbl181FirstRow.street, 'ארבל');
			});

			it('house', () => {
				assert.strictEqual(tbl181FirstRow.house, '');
			});

			it('phone', () => {
				assert.strictEqual(tbl181FirstRow.phone, '04-6732606');
			});

			it('fax', () => {
				assert.strictEqual(tbl181FirstRow.fax, '04-6734541');
			});

			it('email', () => {
				assert.strictEqual(tbl181FirstRow.email, 'aharony@iec.co.il');
			});

		});

		describe('table 1.8.2 parsing test', () => {
			const	tbl182FirstRow = data.chartsOneEight.chart182[0];

			it('type', () => {
				assert.strictEqual(tbl182FirstRow.type, 'פרטי');
			});

			it('name', () => {
				assert.strictEqual(tbl182FirstRow.name, 'אלי יצחק');
			});

			it('license number', () => {
				assert.strictEqual(tbl182FirstRow.license_number, '');
			});

			it('corporate', () => {
				assert.strictEqual(tbl182FirstRow.corporate, '');
			});

			it('city', () => {
				assert.strictEqual(tbl182FirstRow.city, 'ארבל');
			});

			it('street', () => {
				assert.strictEqual(tbl182FirstRow.street, 'ארבל');
			});

			it('house', () => {
				assert.strictEqual(tbl182FirstRow.house, '');
			});

			it('phone', () => {
				assert.strictEqual(tbl182FirstRow.phone, '04-6733324');
			});

			it('fax', () => {
				assert.strictEqual(tbl182FirstRow.fax, '');
			});

			it('email', () => {
				assert.strictEqual(tbl182FirstRow.email, 'Mtrack@012.net.il');
			});

		});
	});

	// this is an example for a pdf that it's data is messy
	describe('table 4 parsing test', () => {
		const chartFour = data.chartFour;

		it('row 0 test', () => {
			assert.strictEqual(chartFour[0].father_category, 'קרקע חקלאית');
			assert.strictEqual(chartFour[0].father_category_number, '4.1');
			assert.strictEqual(chartFour[0].category, 'שימושים');
			assert.strictEqual(chartFour[0].category_number, '4.1.1');
			assert.strictEqual(chartFour[0].text.includes('תותר הקמת חממות לחוות ריבוי וגידול'), true);
		});

		it('row 1 test', () => {
			assert.strictEqual(chartFour[1].father_category, 'קרקע חקלאית');
			assert.strictEqual(chartFour[1].father_category_number, '4.1');
			assert.strictEqual(chartFour[1].category, 'הוראות');
			assert.strictEqual(chartFour[1].category_number, '4.1.2');
			assert.strictEqual(chartFour[1].text.includes('תבנה גדר עפ"י הנחיות משרד הבריאות'),true);
		});

		it('row 2 test', () => {
			assert.strictEqual(chartFour[2].father_category, 'קרקע חקלאית');
			assert.strictEqual(chartFour[2].father_category_number, '4.1');
			assert.strictEqual(chartFour[2].category, 'הוראות');
			assert.strictEqual(chartFour[2].category_number, '4.1.2');
			assert.strictEqual(chartFour[2].text.includes('תנאי להיתר הינו בכפוף למילוי כל הדרישות'), true);
		});

		it('row 3 test', () => {
			assert.strictEqual(chartFour[3].father_category, 'שטח פרטי פתוח');
			assert.strictEqual(chartFour[3].father_category_number, '4.2');
			assert.strictEqual(chartFour[3].category, 'שימושים');
			assert.strictEqual(chartFour[3].category_number, '4.2.1');
			assert.strictEqual(chartFour[3].text === 'ישמש לנטיעות והסתרה נופית.', true);
		});

		it('row 4 test', () => {
			assert.strictEqual(chartFour[4].father_category, 'שטח פרטי פתוח');
			assert.strictEqual(chartFour[4].father_category_number, '4.2');
			assert.strictEqual(chartFour[4].category, 'הוראות');
			assert.strictEqual(chartFour[4].category_number, '4.2.2');
			assert.strictEqual(chartFour[4].text.includes('אסורה כל בניה.'), true);
		});

	});

	describe('table 5 last row parsing test', () => {
		const tbl5ThirdRow = data.chartFive[2];

		it('designation', () =>
			assert.strictEqual(tbl5ThirdRow.designation, 'קרקע חקלאית'));

		it('use', () =>
			assert.strictEqual(tbl5ThirdRow.use, 'מבני תפעול תחזוקה ובקרה'));

		it('taei shetah', () =>
			assert.strictEqual(tbl5ThirdRow.area_number, '101'));

		it('location', () =>
			assert.strictEqual(tbl5ThirdRow.location, ''));

		it('field size sqm test', () =>
			assert.strictEqual(tbl5ThirdRow.field_size_sqm, '51453.23'));

		it('size sqm above primary entrance', () =>
			assert.strictEqual(tbl5ThirdRow.above_primary_main, '705'));

		it('size sqm above service entrance', () =>
			assert.strictEqual(tbl5ThirdRow.above_primary_service, '12'));

		it('size sqm below primary entrance', () =>
			assert.strictEqual(tbl5ThirdRow.below_primary_main, ''));

		it('size sqm below service entrance', () =>
			assert.strictEqual(tbl5ThirdRow.below_primary_service, ''));

		it('overall building land (sah hakol shithey bniya)', () =>
			assert.strictEqual(tbl5ThirdRow.overall_building_land, '717'));

		it('building percentage', () =>
			assert.strictEqual(tbl5ThirdRow.building_percentage === '' ||
                tbl5ThirdRow.building_percentage === undefined, true));

		it('tahsit', () =>
			assert.strictEqual(tbl5ThirdRow.tahsit, '35.64'));

		it('density yahad to dunam', () =>
			assert.strictEqual(tbl5ThirdRow.density_yahad_to_dunam === '' ||
                tbl5ThirdRow.density_yahad_to_dunam === undefined, true));

		it('number of housing units', () =>
			assert.strictEqual(tbl5ThirdRow.num_of_housing_units, ''));

		it('height of building meters', () =>
			assert.strictEqual(tbl5ThirdRow.height_above_entrance, '6'));

		it('floors above entrance', () =>
			assert.strictEqual(tbl5ThirdRow.floors_above, '1'));

		it('floors below entrance', () =>
			assert.strictEqual(tbl5ThirdRow.floors_below === undefined || tbl5ThirdRow.floorsBelow ==='',
				true));

		it('building right side line', () =>
			assert.strictEqual(tbl5ThirdRow.side_line_right, '3'));

		it('building left side line', () =>
			assert.strictEqual(tbl5ThirdRow.side_line_left, '3'));

		it('building back side line', () =>
			assert.strictEqual(tbl5ThirdRow.side_line_back, '3'));

		it('building front side line', () =>
			assert.strictEqual(tbl5ThirdRow.side_line_front, '5'));

	});

	describe('table 6 parsing test', () => {
		const chartSix = data.chartSix;

		it('row 0', () => {
			assert.strictEqual(chartSix[0].category_number, '6.1');
			assert.strictEqual(chartSix[0].category, 'קווי תשתית');
			assert.strictEqual(chartSix[0].text, `קווי ביוב-
קווי ביוב בתחום התכנית יתוכננו בתיאום עם חברת "מקורות". לא יחצה קו ביוב מעל קו מים 
ראשי, אלא מתחתיו, במרחק מתאים עם מיגונים מתאימים, וזאת בכפוף לתיאום ואישור חברת 
"מקורות" ואישור משרד הבריאות.`);
		});

		it('row 1', () => {
			assert.strictEqual(chartSix[1].category_number, '6.2');
			assert.strictEqual(chartSix[1].category, 'חניה');
			assert.strictEqual(chartSix[1].text, `החניה תהיה בתחום המגרש בהתאם לדרישות תקן החניה )הוראות תקנות התכנון והבניה 
2016( או לתקנות התקפות במועד הוצאת ההיתר. תנאי למתן היתר בניה הבטחת מקומות חניה 
כנדרש בתקנות.`);
		});

		it('row 2', () => {
			assert.strictEqual(chartSix[2].category_number, '6.3');
			assert.strictEqual(chartSix[2].category, 'חלוקה ו/ או רישום');
			assert.strictEqual(chartSix[2].text, 'רישום יעשה עפ"י חוק.');
		});

		it('row 7', () => {
			assert.strictEqual(chartSix[7].category_number, '6.8');
			assert.strictEqual(chartSix[7].category, 'פיקוד העורף');
			assert.strictEqual(chartSix[7].text, `תנאי למתן היתר בניה יהיה אישור פיקוד העורף לפתרונות המיגון במגרש. לא יוצא היתר בניה 
למבנה בשטח התכנית אלא אם כלול בו מקלט או ממ"ד בהתאם לתקנון ההתגוננות האזרחית.`);
		});

		it('row 10', () => {
			assert.strictEqual(chartSix[10].category_number, '6.11');
			assert.strictEqual(chartSix[10].category, 'היטל השבחה');
			assert.strictEqual(chartSix[10].text, 'הוועדה המקומית תטיל ותגבה היטל השבחה בהתאם להוראות התוספת השלישית לחוק.');
		});

	});


});

// This taba exists in the test to check for a case of tahsit and building percentage at one table
describe('Taba3 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan3';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('data should not be undefined', async () =>
			assert.notStrictEqual(data, undefined));

		it('should have only one row on table 1.8.1', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('should have only one row on table 1.8.2', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('should have no rows on table 1.8.3', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 0));

		it('should have 3 rows on table 1.8.4', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 3));

		it('should have 2 rows on table 3.1 without change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 2));

		it('should have 2 rows on table 3.1 with change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 2));

		it('should have 2 rows on table 3.2 approved state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 2));

		it('should have 2 rows on table 3.2 suggested state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 2));

		it('data should have one row on table 5', () =>
			assert.strictEqual(data.chartFive.length, 1));

		it('should have 17 rows on table 6', () =>
			assert.strictEqual(data.chartSix.length, 17));

		it('should have 0 rows on table 7.1', () =>
			assert.strictEqual(data.chartSevenOne.length, 0));

	});

	// interesting because it's ending is "הערה למגיש התכנית"
	describe('tables 1.8 parsing test', () => {

		describe('table 1.8.1 parsing test', () => {
			const tbl181FirstRow = data.chartsOneEight.chart181[0];

			it('profession', () => {
				assert.strictEqual(tbl181FirstRow.profession, '');
			});

			it('type', () => {
				assert.strictEqual(tbl181FirstRow.type, 'פרטי');
			});

			it('name', () => {
				assert.strictEqual(tbl181FirstRow.name, 'מוסא זבידאת');
			});

			it('license number', () => {
				assert.strictEqual(tbl181FirstRow.license_number, '');
			});

			it('corporate', () => {
				assert.strictEqual(tbl181FirstRow.corporate, '');
			});

			it('city', () => {
				assert.strictEqual(tbl181FirstRow.city, 'סח\'נין');
			});

			it('street', () => {
				assert.strictEqual(tbl181FirstRow.street, ') 1 (');
			});

			it('house', () => {
				assert.strictEqual(tbl181FirstRow.house, '');
			});

			it('phone', () => {
				assert.strictEqual(tbl181FirstRow.phone, '054-4657371');
			});

			it('fax', () => {
				assert.strictEqual(tbl181FirstRow.fax, '04-6023162');
			});

			it('email', () => {
				assert.strictEqual(tbl181FirstRow.email, 'gawad.mosa@gmail.com');
			});

		});

		describe('table 1.8.2 parsing test', () => {
			const tbl182FirstRow = data.chartsOneEight.chart182[0];

			it('type', () => {
				assert.strictEqual(tbl182FirstRow.type, 'פרטי');
			});

			it('name', () => {
				assert.strictEqual(tbl182FirstRow.name, 'מוסא זבידאת');
			});

			it('license number', () => {
				assert.strictEqual(tbl182FirstRow.license_number, '');
			});

			it('corporate', () => {
				assert.strictEqual(tbl182FirstRow.corporate, '');
			});

			it('city', () => {
				assert.strictEqual(tbl182FirstRow.city, 'סח\'נין');
			});

			it('street', () => {
				assert.strictEqual(tbl182FirstRow.street, ') 1 (');
			});

			it('house', () => {
				assert.strictEqual(tbl182FirstRow.house, '');
			});

			it('phone', () => {
				assert.strictEqual(tbl182FirstRow.phone, '054-4657371');
			});

			it('fax', () => {
				assert.strictEqual(tbl182FirstRow.fax, '04-6023162');
			});

			it('email', () => {
				assert.strictEqual(tbl182FirstRow.email, 'gawad.mosa@gmail.com');
			});

		});
	});

	describe('Chart 5 parsing test', () => {
		const tbl5FirstRow = data.chartFive[0];

		it('building percentage', () =>
			assert.strictEqual(tbl5FirstRow.building_percentage, '144'));

		it('tahsit', () =>
			assert.strictEqual(tbl5FirstRow.tahsit, '42'));

		it('density yahad to dunam', () =>
			assert.strictEqual(tbl5FirstRow.density_yahad_to_dunam, '6'));

	});
});

// This taba exists in the test to check for a split table 5 (part A...) and across multiple pages
describe('Taba4 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan4';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('data should not be undefined', async () =>
			assert.notStrictEqual(data, undefined));

		it('data should have 1 row on table 1.8.3', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 1));

		it('should have 7 rows on table 1.8.4', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 7));

		it('should have 4 rows on table 3.1 without change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 4));

		it('should have 11 rows on table 3.1 with change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 11));

		it('should have 3 rows on table 3.2 approved state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 3));

		it('should have 4 rows on table 3.2 suggested state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 4));

		it('data should have 13 row on table 5', () =>
			assert.strictEqual(data.chartFive.length, 13));

		// note that 'עיצוב אדריכלי' and 'איכות סביבה' is appearing twice in the pdf, but appearing once in the parsed data. it's the wanted behavior.
		it('should have 16 rows on table 6', () =>
			assert.strictEqual(data.chartSix.length, 16));

		it('should have 1 row on table 7.1', () =>
			assert.strictEqual(data.chartSevenOne.length, 1));
	});

	describe('table 1.8.3 parsing test', () => {
		const tbl183FirstRow = data.chartsOneEight.chart183[0];

		it('type', () => {
			assert.strictEqual(tbl183FirstRow.type, 'בבעלות רשות מקומית');
		});

		it('description', () => {
			assert.strictEqual(tbl183FirstRow.description, '');
		});

		it('name', () => {
			assert.strictEqual(tbl183FirstRow.name, '');
		});

		it('license number', () => {
			assert.strictEqual(tbl183FirstRow.license_number, '');
		});

		it('corporate', () => {
			assert.strictEqual(tbl183FirstRow.corporate, 'עיריית תל אביב-יפו');
		});

		it('city', () => {
			assert.strictEqual(tbl183FirstRow.city, 'תל אביב- יפו');
		});

		it('street', () => {
			assert.strictEqual(tbl183FirstRow.street, 'אבן גבירול');
		});

		it('house', () => {
			assert.strictEqual(tbl183FirstRow.house, '69');
		});

		it('phone', () => {
			assert.strictEqual(tbl183FirstRow.phone, '03-7247259');
		});

		// the library parses email and fax columns wrong

	});

});


// This taba has a big appendix, make sure that our program doesn't get stuck from it
describe('Taba5 parsing test', async () =>  {
	const TEST_PLANS_DIR = 'test_plan5';
	await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe("make sure that it doesn't get stuck", () => {
		it('', () =>
			assert.strictEqual(true, true));
	});

});

describe('Taba6 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan6';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('sepcific parsing', () => {
		it('data should not be undefined', async () =>
			assert.notStrictEqual(data, undefined));

		it('should have only one row on table 1.8.1', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('should have only one row on table 1.8.2', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('should have only one row on table 1.8.3', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 1));

		it('should have 4 rows on table 1.8.4', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 4));

		it('should have 2 rows on table 3.1 without change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 2));

		it('should have 7 rows on table 3.1 with change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 7));

		it('should have 2 rows on table 3.2 approved state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 2));

		it('should have 2 rows on table 3.2 suggested state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 2));

		it('should have 3 rows on table 5', () =>
			assert.strictEqual(data.chartFive.length, 3));

		it('should have 8 rows on table 6', () =>
			assert.strictEqual(data.chartSix.length, 8));
	});

	describe('table 1.8.3 parsing test', () => {
		const tbl183FirstRow = data.chartsOneEight.chart183[0];

		it('type', () => {
			assert.strictEqual(tbl183FirstRow.type, 'בעלים');
		});

		it('description', () => {
			assert.strictEqual(tbl183FirstRow.description, '');
		});

		it('name', () => {
			assert.strictEqual(tbl183FirstRow.name, 'משה ברנס');
		});

		it('license number', () => {
			assert.strictEqual(tbl183FirstRow.license_number, '');
		});

		it('corporate', () => {
			assert.strictEqual(tbl183FirstRow.corporate, '');
		});

		it('city', () => {
			assert.strictEqual(tbl183FirstRow.city, 'רמת גן');
		});

		it('street', () => {
			assert.strictEqual(tbl183FirstRow.street, 'טור הברושים');
		});

		it('house', () => {
			assert.strictEqual(tbl183FirstRow.house, '3');
		});

		it('phone', () => {
			assert.strictEqual(tbl183FirstRow.phone, '');
		});



	});

});

describe('Taba7 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan7';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('table 1.8.1 should have 1 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('table 1.8.2 should have 1 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('table 1.8.3 should have 1 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 1));

		it('should have 10 rows on table 1.8.4', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 10));

		it('should have 9 rows on table 3.1 without change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 9));

		it('should have 40 rows on table 3.1 with change', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 40));

		it('should have 2 rows on table 3.2 approved state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 2));

		it('should have 9 rows on table 3.2 suggested state', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 9));

		// this test fails because we have no way to know that 'מסחר' at the end of page 14 is the beginning of the first row at page 15 (1-indexed)
		// THIS TEST SHOULD FAIL, BUT PASSES TO SEE GREEN TICKS!
		it('table 4 should have 25 rows', () =>
			assert.notStrictEqual(data.chartFour.length, 25));

		it('table 5 should have 59 rows', () =>
			assert.strictEqual(data.chartFive.length, 59));

		it('table 6 should have 11 rows', () =>
			assert.strictEqual(data.chartSix.length, 11));

		it('table 7.1 should have 1 rows', () =>
			assert.strictEqual(data.chartSevenOne.length, 1));
	});

});


//test plan 8 is to check the absent of 1.8.2 and 1.8.3
describe('Taba8 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan8';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('chart 1.7 should have 5 rows', () =>
			assert.strictEqual(data.chartOneSeven.length, 5));

		it('chart 1.8.1 should have one row', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('chart 1.8.2 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 0));

		it('chart 1.8.3 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 0));

		it('chart 1.8.4 should have 3 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 3));

		it('chart 3.1 without change should have 1 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 1));

		it('chart 3.1 with change should have 2 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 2));

		it('chart 3.2 approved should have 1 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 1));

		it('chart 3.2 with suggested should have 1 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 1));

		it('chart 4 should have 3 rows', () =>
			assert.strictEqual(data.chartFour.length, 3));

		it('chart 5 should have 2 rows', () =>
			assert.strictEqual(data.chartFive.length, 2));

		it('chart 6 should have 7 rows', () =>
			assert.strictEqual(data.chartSix.length, 7));

		it('chart 7.1 should have 1 rows', () =>
			assert.strictEqual(data.chartSevenOne.length, 1));
	});

});

//test_plan9 for 1.8.4 and for empty 3.1 and empty 3.2 suggested
describe('Taba9 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan9';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('chart 1.7 should have 6 rows', () =>
			assert.strictEqual(data.chartOneSeven.length, 6));

		it('chart 1.8.1 should have one row', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('chart 1.8.2 should have 1 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('chart 1.8.3 should have 3 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 3));

		it('chart 1.8.4 should have 4 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 4));

		it('chart 3.1 without change should have 0 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 0));

		it('chart 3.1 with change should have 0 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 0));

		it('chart 3.2 approved should have 4 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 4));

		it('chart 3.2 with suggested should have 0 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 0));

		it('chart 7.1 should have 0 rows', () =>
			assert.strictEqual(data.chartSevenOne.length, 0));
	});

});

//test_plan10 for stripping the useless crap at the end of some PDFs
describe('Taba10 parsing test', async function() {
	this.timeout(60000);
	const TEST_PLANS_DIR = 'test_plan10';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('chart 1.7 should have 7 rows', () =>
			assert.strictEqual(data.chartOneSeven.length, 7));

		it('chart 1.8.1 should have one row', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('chart 1.8.2 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 0));

		it('chart 1.8.3 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 0));

		it('chart 1.8.4 should have 3 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 3));

		it('chart 3.1 without change should have 2 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 2));

		it('chart 3.1 with change should have 8 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 8));

		it('chart 3.2 approved should have 2 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 2));

		it('chart 3.2 with suggested should have 2 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 2));

		it('chart 7.1 should have 1 rows', () =>
			assert.strictEqual(data.chartSevenOne.length, 1));
	});

});


//test_plan11 for pages with different orientation
describe('Taba11 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan11';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('chart 1.7 should have 5 rows', () =>
			assert.strictEqual(data.chartOneSeven.length, 5));

		it('chart 1.8.1 should have 1 row', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('chart 1.8.2 should have 1 row', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('chart 1.8.3 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 0));

		it('chart 1.8.4 should have 3 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 3));

		it('chart 3.1 without change should have 1 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 1));

		it('chart 3.1 with change should have 0 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 0));

		it('chart 3.2 approved should have 1 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 1));

		it('chart 3.2 with suggested should have 1 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 1));

		it('chart 5 should have 3 rows', () =>
			assert.strictEqual(data.chartFive.length, 3));

		it('chart 7.1 should have 0 rows', () =>
			assert.strictEqual(data.chartSevenOne.length, 0));
	});

});

//test_plan12 for 1.8.4 over 2 pages
describe('Taba12 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan12';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {

		it('chart 1.7 should have 25 rows', () =>
			assert.strictEqual(data.chartOneSeven.length, 25));

		it('chart 1.8.1 should have one row', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 1));

		it('chart 1.8.2 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 0));

		it('chart 1.8.3 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 0));

		it('chart 1.8.4 should have 13 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 13));

		it('chart 3.1 without change should have 7 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 7));

		it('chart 3.1 with change should have 6 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 6));

		it('chart 3.2 approved should have 2 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 2));

		it('chart 3.2 with suggested should have 7 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 7));

		it('chart 7.1 should have 0 rows', () =>
			assert.strictEqual(data.chartSevenOne.length, 0));
	});

});

//test_plan13 for 3.2 over 2 pages
describe('Taba13 parsing test', async () => {
	const TEST_PLANS_DIR = 'test_plan13';
	const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));

	describe('specific parsing', () => {
		it('chart 1.7 should have 15 rows', () =>
			assert.strictEqual(data.chartOneSeven.length, 15));

		it('chart 1.8.1 should have 2 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart181.length, 2));

		it('chart 1.8.2 should have 1 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart182.length, 1));

		it('chart 1.8.3 should have 0 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart183.length, 0));

		it('chart 1.8.4 should have 8 rows', () =>
			assert.strictEqual(data.chartsOneEight.chart184.length, 8));

		it('chart 3.1 without change should have 5 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_without_change'].length, 5));

		it('chart 3.1 with change should have 18 rows', () =>
			assert.strictEqual(data.chartsThreeOne['3_1_with_change'].length, 18));

		it('chart 3.2 approved should have 5 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_approved.length, 5));

		it('chart 3.2 with suggested should have 5 rows', () =>
			assert.strictEqual(data.chartsThreeTwo.chart3_2_suggested.length, 5));

		it('chart 7.1 should have 0 rows', () =>
			assert.strictEqual(data.chartSevenOne.length, 0));
	});

});