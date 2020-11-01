# Crawler

The Meirim crawler is written in Javascript using [Puppeteer](https://pptr.dev).

The crawler code is currently mixed with the backend code which lives under the [server](../server) folder. Separating these is a pending task.

## Executing

To run the code after resolving dependencies and configuring as explained in the [main readme](../README.md), use:

```bash
$ npm run crawl
```

The crawling process will begin and write new and updated plan data throughout its run to the database. It can be stopped at any time using Ctrl+C (plans crawled up until this point will already be saved to the database).

## Crawling process

First the crawler queries the Kavim Kchulim (blue lines, קווים כחולים) public service for all the plans it knows about. All geometries are then reprojected to [WGS84](https://en.wikipedia.org/wiki/World_Geodetic_System), after which the database is queried for each plan and each existing plan is tested to see if the LAST_UPDATE field has changed to produce a set of new and updated plans which will be saved to the database. Each plan in the set is then fetched (or searched for and then fetched) from the Mavat (מבא"ת) website using puppeteer, and the plan data is enriched with the data gathered from Mavat.

If this is a new plan or the STATION field has changed (which is an enum field of the plan status in the approval process) the plan will be marked for sending and the send_emails process should pick it up and email an alert to subscribers.

## Caveats

### Complete mavat data

Since over time the data we display change, along with (possibly) the data which are available on Mavat's website, a utility was created to go over our existing plans and try to enrich them using data from Mavat (again or for the first time). Note that this utility will never mark plans for sending and plan updates will not result in an email alert being sent to subscribers.

To run the utility use:

```bash
$ node bin/complete_mavat_data
```

### New Mavat website

Recently a new Mavat website (which is still in beta) has been revealed. The new website makes more data available than the old one, along with the option to search through all plans which might make the usage of Kavim Kchulim unnecessary. A new crawler for this site should be researched and prepared.
