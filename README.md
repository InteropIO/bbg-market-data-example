# bbg-market-data examples

![](./bbg-market-data-examples.png)

The repository contains a simple application that demonstrates the usage of [@glue42/bbg-market-data](https://www.npmjs.com/package/@glue42/bbg-market-data).
The application allows selection of any request available from @glue42/bbg-market-data, opening the selected request and logging in the console - data, errors, bloomberg event and request status.
Logs are prefixed as follow:

- [RESPONSE] - an aggregated response from a non-subscription request
- [ON DATA] - a partial response
- [ON ERROR] - a request error
- [ON STATUS] - the current request status
- [ON EVENT] - any Bloomberg event received related to the request
- [ON SUBSCRIPTIONS FAIL] - for subscription request, when any subscription is no longer active

## Prerequisites

- [Glue42 Desktop](https://glue42.com/)
- Bloomberg Connector - at least version 1.42
- [node and npm](https://nodejs.org/en/)

## Setup

- Clone the repository
- Copy the config file `bbg-market-data-examples.json` to the Glue42 Desktop application configuration folder (%LocalAppData%\Tick42\GlueDesktop\config\apps)
- Open terminal and run `npm install` to install all dependencies
- Run `npm start` to host the application. The app will run on http://localhost:3000

Now you should be able to start the application from the Glue42 Desktop App Manager Toolbar. Search for _BBG Market Data Examples_.
