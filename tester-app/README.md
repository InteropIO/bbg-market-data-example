# BBG Market Data Tester App

![bbg-market-data tester app image](./app.png)

A simple application that demonstrates the usage of [@glue42/bbg-market-data](https://www.npmjs.com/package/@glue42/bbg-market-data).
The application allows selection of any request available from @glue42/bbg-market-data, opening the selected request and visualization of data, errors, bloomberg event and request's status.

## Prerequisites

- [io.Connect Desktop](https://interop.io/) / Glue42 Enterprise
- [Bloomberg Adapter](https://docs.interop.io/adapters/bloomberg/market-data/overview/index.html) - at least version 1.42
- [NodeJS and npm](https://nodejs.org/en/)

## Usage locally

- Clone the repository.
- Copy the app definition file `bbg-market-data-tester-app.json` to the appropriate applications store:
  * io.Connect Desktop - %LocalAppData%/interop.io/io.Connect Desktop/Desktop/config/apps
  * io.Connect Browser - see documentation https://docs.interop.io/browser/capabilities/app-management/index.html#app_definitions
  * Glue42 Enterprise - %LocalAppData%/Tick42/GlueDesktop/config/apps
- Run `npm install` to install all dependencies.
- Run `npm start` to start the app. The app will be hosted at http://localhost:3000.

Now you should be able to start the application from the App Manager. Search for _BBG Market Data Tester App_.
