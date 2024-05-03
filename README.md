# Application for preparing duty lists for doctors

## Features:
- Prepares a list for 24-hour shifts for a month
- Can assign more than one doctor per day
- Can assign more than one type of doctor per day
- Considers weekends and other holidays and calculates them separately
- Considers the days when the doctors are not available
- Selects a doctor randomly if no one is available for a particular day


Features to be Added:
- Visual editing of the duty list and exporting it to Excel
- Bug fix for multiple types of doctors list 

## Tech Stack

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

PrimeNG and PrimeFlex were used for UI development

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# Doktorlar için nöbet listesi hazırlama uygulaması. (Türkçe)

## Özellikler:
- 24 saatlik nöbetler
- 1 aylık süre için liste hazırlama
- 1 güne birden fazla nöbetçi atama
- 1 güne birden fazla çeşit nöbetçi atama
- Nöbetçilerin müsait olmadığı günleri göz önünde bulundurma
- Kimsenin müsait olmadığı günlerde rastgele nöbetçi seçilmesi

## Eklenecek Özellikler:
- Nöbet listesinin görsel olarak düzenlenmesi ve excele aktarılabilmesi
- Birden fazla çeşit nöbetçi için bug fix
