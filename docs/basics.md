# Structure

The Meirim platform consists of 3 parts: a [crawler](./crawler.md), [backend](./backend.md) and [frontend](./frontend.md).

The backend provides a REST API to manage user data and access plan data. The frontend is our website giving users an interface to these APIs. The crawler runs as a scheduled job and collects new and updated plan data from different sources, saving them to the database for all to see.

There are also several [utilities](./utilities.md) we use to do things such as send users email alerts for plans that are created or updated in one of their alert areas.

If you believe anything is unclear, under-documented or just not explained very well, please [open an issue](https://github.com/meirim-org/meirim/issues) or [contact us](https://meirim.org).
