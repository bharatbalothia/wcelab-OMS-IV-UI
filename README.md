# IBM IV PoC

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.3.

## Demo Environment

The demo environment is current at http://ivdemo-dev.wcelab.com and http://ivdemo.adidas.wcelab.com. We are currently hardcode to use the eu-api.watsoncommerce.ibm.com server due to proxy configuration. You can use your own tenantID, ClientID, and ClientSecret to access the IV.

## Current Development Status

The demo currently spport the following use case:

1. Ship Node
   1. View Ship Node List
   1. Update existing Ship Node
   1. Delete existing Ship Node
   1. Create new Ship Node
1. Distribution Group
   1. View DG List
   1. Update existing Distribution Group
   1. Delete existing Distribution Group
   1. Create new Distribution Group
1. Supply
   1. View Supply for ItemID, UOM, Product Class, and ShipNode
      1. Regular Supply
      1. Segmented Supply
   2. Update Supply (sync)
      1. Update supply quantity
      1. Update supply reference
   3. Add new supply
      1. Regular Supply
      1. Segmented Supply
1. Availability
   1. Get Availability both Network and Node
      1. Node level doesn't have UI hooked up. Only see the JSON in Developer tool
   1. View Network Availability over a 8 weeks time serie chart.

### TODO:

1. Get Node Availability UI
1. Reservation
1. Bunch of UI beautification

## Start this project in your development

1. git clone this repository

```shell
git clone git@github.ibm.com:Ned-Zhang/OMS-IV-UI.git
```
2. install the package 

```shell
# cd into the directory of the project
npm update
```

## Start the project using container

See the [docker README](docker/README.md) for how run development using docker.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
