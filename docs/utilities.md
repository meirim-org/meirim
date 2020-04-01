# Utilities

Utilities are used to provide some platform functionality or fix some odd or missing data due to service interruptions, modifications etc.

The utilities live under the [bin](../bin) folder.

Most utilities require dependencies to be resolved and code to be configured as explained in the [main readme](../README.md).

## Send emails

The [send_emails](../bin/send_emails) utility is run at intervals and is used to send email alerts to users for new and updated plans. It queries the database for unsent plans, intersects their geometries with user alert areas and sends out emails if needed using an SMTP service according to the set configuration.

```bash
$ node bin/send_emails
```

## Serve

The [serve](../bin/serve) utility is used in production to serve our backend and frontend together on the same port using Express (reasons and specs further explained [here](./frontend.md#open-graph-tags) and [here](./backend.md#static-app-and-routes)).

```bash
$ npm run serve # or node bin/serve
```

## Complete mavat data

The [complete_mavat_data](../bin/complete_mavat_data) utility is used to repair missing data due to downtime, errors etc. or due to new data processing code being introduced. It is further explained [here](./crawler.md#complete-mavat-data).

```bash
$ node bin/complete_mavat_data
```
