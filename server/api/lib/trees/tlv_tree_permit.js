const proxy = require('./../proxy');
const cheerio = require('cheerio');
const Config = require('../../lib/config');
const TreePermit = require('../../model/tree_permit');
const {
	REGIONAL_OFFICE, PERMIT_NUMBER, APPROVER_TITLE, ACTION,
	LAST_DATE_TO_OBJECTION, TOTAL_TREES,
	PLACE, STREET, START_DATE,
	TREES_PER_PERMIT, PERSON_REQUEST_NAME, TREE_PERMIT_URL,
	GUSH, HELKA, REASON_DETAILED
} = require('../../model/tree_permit_constants');
const { formatDate, figureStartDate } = require('./utils');
const Log = require('../log');

const STREET_NAME = 'שם הרחוב';
const OBJECTION_TILL = 'תאריך אחרון להגשת התנגדויות:';
const TREE_NUM = 'כמות העצים:';
const TREE_TYPE =  'מין העץ:';
const LICENSE_NUMBER = 'מספר רישיון';
const LICENSE_OWNER = 'שם בעל הרישיון';
const LICENSE_REASON = 'סיבה:';
const TEL_AVIV_CITY = 'תל אביב-יפו';
const SHORT_ACTION = 'כריתה';
const APPROVER = 'שם פקיד היערות המאשר:';
const HOUR_PERMIT = '09:00';
const DATE_FORMAT_PERMIT = 'DD/MM/YYYY';
const PERMIT_GUSH = 'גוש:';
const PERMIT_HELKA = 'חלקה:';

const TREES_TEL_AVIV_URL = Config.get('trees.tlvUrl');
const tlvTreePermit = {
	urls: [TREES_TEL_AVIV_URL]
};


const tempConstTrees = `<table class="table-scrl">
<caption class="offset ng-binding">הודעות על אישור כריתה או העתקה של עצים</caption>
<thead>
    <tr>
        <!-- ngRepeat: header in tab.Table[0].Fields | limitTo:3 --><th ng-repeat="header in tab.Table[0].Fields | limitTo:3" class="ng-binding ng-scope">מספר רישיון</th><!-- end ngRepeat: header in tab.Table[0].Fields | limitTo:3 --><th ng-repeat="header in tab.Table[0].Fields | limitTo:3" class="ng-binding ng-scope">כתובת</th><!-- end ngRepeat: header in tab.Table[0].Fields | limitTo:3 --><th ng-repeat="header in tab.Table[0].Fields | limitTo:3" class="ng-binding ng-scope">פעולה</th><!-- end ngRepeat: header in tab.Table[0].Fields | limitTo:3 -->
        <!-- ngIf: tab.Table[0].Fields.length > 3 --><th ng-if="tab.Table[0].Fields.length > 3" class="ng-scope"><span class="sr-only">עמודת מידע</span></th><!-- end ngIf: tab.Table[0].Fields.length > 3 -->
    </tr>
</thead>
<tbody>
    <!-- ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6207" class="ng-scope">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6207</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">המלך ג'ורג' 35</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6207" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6207</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6207</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass2ED2A2C320634BE0A1F09414EC11F4BE"><p>​בטיחות. העץ בנטייה חזקה<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">29/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6911</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">35</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClassB0ED51A9B7764854A61E6275A7B36405"><p>​תמר מצוי- דקל<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גביאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6267" class="ng-scope odd">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6267</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">בבלי 16</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6267" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6267</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6267</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope odd" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass45178D5B43E64C1190920C4475543754"><p>​גדם של מכנף, ללא ערך נופי<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">28/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6107</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">424</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClassB2BE90F6E7F948949A2041424087E9B1"><p>​מכנף נאה<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים בריאל - פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6266" class="ng-scope">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="    ">03-6266</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">אשכול לוי 46</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6266" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6266</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6266</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">4</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass8410B6AAF4DE4ED2AA110D8A129ACABE"><p>​שורשי העצים חדרו לקירות המרתף, גרמו לסדקים ונזילות<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">28/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">7224</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">22</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClassDA4FE51D622C4A12951F868221097F17"><p>​דקל וושינגטוניה חוטית, סיסם הודי, תות לבן<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גבריאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6265" class="ng-scope odd">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6265</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">לבני איתן 61</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6265" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6265</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6265</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope odd" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass0EA0BFF489BD4F22B85E6E9D7A679A4F"><p>​בטיחותי. העץ יבש<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">27/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6137</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">107</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass5E34EB2090284AA4B1A1099DDE409DA4"><p>​אקליפטוס המקור<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גביאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6264" class="ng-scope">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6264</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">לפין 9</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6264" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6264</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6264</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass8774E0C284A44CD5BADC9B8D91B61B38"><p>​עץ גדל בסמוך לחומה וגורם לסדק, כמו כן מרים ריצוף של הבניין<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">26/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">7227</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">100</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass9E70BD5DC4F34FF3A0B697DE02A70999"><p>​דקל וושינגטוניה חוטית<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גבריאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6263" class="ng-scope odd">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6263</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">אליהו מפרארה 25</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6263" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6263</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6263</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope odd" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass91470B6145754DA2B8FE64E6B2F07688"><p>​עץ יבש<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">26/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6637</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">364</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClassA5A6D01A20434722B0A3F4688BA7552C"><p>​תמר מצוי<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גבריאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6262" class="ng-scope">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6262</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">המצביאים 45</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6262" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6262</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6262</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass7C079865C93248E585E70BA22126D901"><p>​עץ יבש<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">25/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6636</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">317</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass9F7896790ABC4A249711658207AD9716"><p>​מייש בונגה<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גבריאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6261" class="ng-scope odd">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6261</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כהן עופר 22</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6261" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6261</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6261</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope odd" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">3</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass2C39BA2AAA024599B0E1C0F5F2C5CA3C"><p>​עצים יבשים<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">25/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6984</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">15</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass517A928E4F82411E96DE3B67F92E57A1"><p>​אלון מצוי<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גבריאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="03-6260" class="ng-scope">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">03-6260</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">עיר שמש 79</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 03-6260" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 03-6260</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 03-6260</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClassE39A2161C4F14B85A71F446553E955E7"><p>​עץ יבש ומנוון<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">25/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6815</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">174</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass5606F73E9A0C47A8A09CFD83063BE22B"><p>​פיקוס השדרות<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים גבריאל- פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); --><!-- ngIf: row.display --><tr ng-repeat-start="row in tab.getRows(tab.groups[0]);" ng-if="row.display" ng-click="tab.toggleTR(row, $event);" aria-expanded="false" ng-class-even="'odd'" on-last-repeat="tab.doRowHtml();" title="61-6259" class="ng-scope odd">
        <!-- ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">61-6259</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">קשאני אליעזר 8</td><!-- end ngRepeat: col in row.Fields | limitTo:3 --><td ng-repeat="col in row.Fields | limitTo:3" ng-bind-html="col.Value | highlight: tab.searchKey:false" on-last-repeat="tab.doColHtml()" class="ng-binding ng-scope">כריתה</td><!-- end ngRepeat: col in row.Fields | limitTo:3 -->
        <!-- ngIf: row.Fields.length > 3 --><td class="expand-row-arrow ng-scope" ng-if="row.Fields.length > 3" rowspan="2" style="vertical-align:bottom;">
            <a href="javascript:void(0)" class="link-wrap" title="פתיחת מידע נוסף: 61-6259" tabindex="0">
                <span class="icon-arrow icon-down">
                    <span class="offset collapse-table openAllTableScrl ng-binding">פתיחת מידע נוסף: 61-6259</span>
                    <span class="offset collapse-table closeAllTableScrl ng-binding" style="display:none;">סגירת מידע נוסף: 61-6259</span>
                </span>
            </a>
        </td><!-- end ngIf: row.Fields.length > 3 -->
    </tr><!-- end ngIf: row.display -->
    <!-- ngIf: row.Fields.length > 3 && row.display --><tr class="collapse-tr ng-scope odd" ng-if="row.Fields.length > 3 &amp;&amp; row.display" ng-repeat-end="" ng-class-even="'odd'">
        <td colspan="3">
            <div class="expand-row row">
                <!-- ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">כמות העצים: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">1</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">סיבה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClassA23517B3DB9B40FB8CD22BF1C2670BDE"><p>​עץ יבש ומנוון<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">תאריך אחרון להגשת התנגדויות: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">25/06/2023</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">גוש: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">6628</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">חלקה: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">639</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">מין העץ: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding"><div class="ExternalClass305B6D0319C14C04BB0F715718270B83"><p>​סיסם הודי<br></p></div></span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length --><!-- ngIf: tab.hasValue(col) --><div ng-repeat="col in row.Fields | range: 3: row.Fields.length" ng-if="tab.hasValue(col)" class="ng-scope">
                    <div>
                        <h5 class="bold ng-binding" style="margin-bottom: 0px!important;">שם פקיד היערות המאשר: </h5>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span ng-bind-html="col.Value | highlight: tab.searchKey:false" class="ng-binding">חיים בריאל - פקיד היערות העירוני</span>
                    </div>
                </div><!-- end ngIf: tab.hasValue(col) --><!-- end ngRepeat: col in row.Fields | range: 3: row.Fields.length -->
            </div>
        </td>
    </tr><!-- end ngIf: row.Fields.length > 3 && row.display --><!-- end ngRepeat: row in tab.getRows(tab.groups[0]); -->
</tbody>
</table>
`;

async function parseTreesHtml(url) {
	//const treesHtml = await proxy.get(url);
	const treesHtml = tempConstTrees;
	const dom = cheerio.load(treesHtml, {
		decodeEntities: false
	});
	if (!dom) {
		console.error('cheerio dom is null');
	}
	const result = [];

	const rawRows = dom('.table-scrl').find('tr');
	//ignore row 0
	for (let i = 1; i < rawRows.length; i = i+2) {
		console.log(`i = ${i}`);
		const permit = {};
		permit.permitNumber = dom(rawRows[i]).attr('title');
		dom(rawRows[i]).find('td').each((idx,elem) => {				
			const val = dom(elem).text().trim();
			if (idx == 0) {
				permit[LICENSE_NUMBER] = val;
			}
			if (idx == 1) {
				permit[STREET_NAME] = val;
			}
			if (idx == 2) {
				permit[ACTION] = val;
			}   
		});


		dom(rawRows[i+1]).find('td > div > div').each((idx,elem) => {				
			const key = dom(elem).find('div h5').text().trim();
			const value = dom(elem).find('div span').text().trim();
			console.log(`key: ${key}`);
			permit[key] = value;     
		});

		console.log(`tree permit tlv: ${Object.entries(permit)}`);
		result.push(permit);
	}
	Log.info(`number of Tel Aviv permits: ${result.length}`);
	return result;
}

function processRawPermits(rawPermits) {
	try {
		const treePermits = rawPermits.map(raw => {
			try {
				console.log('raw', raw);
				const last_date_to_objection = formatDate(raw[OBJECTION_TILL], HOUR_PERMIT, DATE_FORMAT_PERMIT);
				if (!last_date_to_objection) {
					Log.error(`No / Bad dates format, ignore this license: tel aviv, ${raw[STREET_NAME]} , ${raw[OBJECTION_TILL]}`);
					return null;
				}

				const treesPerPermit = parseTreesPerPermit(raw[TREE_TYPE], raw[TREE_NUM]);
				const totalTrees = sum(treesPerPermit);

				//const permitNumber = `meirim-tlv-${raw[LICENSE_NUMBER]}`;

				const attributes = {
					[REGIONAL_OFFICE]: TEL_AVIV_CITY,
					[PLACE]: TEL_AVIV_CITY,
					[APPROVER_TITLE]: raw[APPROVER],
					[PERMIT_NUMBER]: raw[LICENSE_NUMBER],
					[STREET]: raw[STREET_NAME],
					[GUSH]: raw[PERMIT_GUSH],
					[HELKA]: raw[PERMIT_HELKA],
					[ACTION]: SHORT_ACTION,
					[LAST_DATE_TO_OBJECTION]: last_date_to_objection,
					[START_DATE]: figureStartDate(null, raw[OBJECTION_TILL], HOUR_PERMIT, DATE_FORMAT_PERMIT, true),
					[PERSON_REQUEST_NAME]: raw[LICENSE_OWNER],
					[REASON_DETAILED]: raw[LICENSE_REASON],
					[TREES_PER_PERMIT]: treesPerPermit,
					[TOTAL_TREES]: totalTrees,

					[TREE_PERMIT_URL]: TREES_TEL_AVIV_URL,
				};
				const permit = new TreePermit(attributes);
				return permit;
			}
			catch (e) {
				Log.error(`error in hod hasharon parse row, ignoring: ${raw[STREET_NAME]}`, e.message);
				return null;
			}
		}
		);
		return treePermits.filter(Boolean); // remove undefined values;
	}
	catch (e) {
		Log.error('error in hod hasharon parse rows:' + e);
	}
}

function parseTreesPerPermit(treesInPermitStr, treeAmount) {
	const linesName = getCleanLines(treesInPermitStr);
	const linesAmount = getCleanLines(treeAmount);
	var result = {};
	for (let i = 0; i < linesName.length; ++i) {
		result[i] = { [linesName[i]]: parseInt(linesAmount[i] || '0') };
	}
	return Object.assign({}, ...Object.values(result));
}

function getCleanLines(str) {
	str = replaceAll(str, '\t', '');
	str = replaceAll(str, '\n\n', '\n');
	return str.split('\n');
}

function replaceAll(str, from, to) {
	return str.replace(new RegExp(from, 'g'), to);
}

function sum(treeArray) {
	const amount = Object.values(treeArray).map(item => { return parseInt(item) || 0; });
	return amount.reduce((total, current) => {
		return total + current;
	});
}

/**
 * Scrape hod hasharon Tree page, and return the results as a TreePermit[].
 */
async function crawlTLVTrees(url, permitType) {
	try {
		const raw = await parseTreesHtml(url);
		const treePermits = processRawPermits(raw);
		return treePermits;
	}
	catch (e) {
		Log.error(e.message);
	}
}

module.exports = { crawlTLVTrees, tlvTreePermit: tlvTreePermit };