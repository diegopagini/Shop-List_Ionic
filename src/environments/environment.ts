// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'lista-mercado-ionic',
    appId: '1:377635180608:web:a8f89316abd32e31214fa5',
    databaseURL:
      'https://lista-mercado-ionic-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'lista-mercado-ionic.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCEsyaC5h9aJI9bgEN9Q1_-gm5bD3zqwYI',
    authDomain: 'lista-mercado-ionic.firebaseapp.com',
    messagingSenderId: '377635180608',
    measurementId: 'G-3XQM4KHFL0',
  },
  firebaseUrl:
    'https://lista-mercado-ionic-default-rtdb.europe-west1.firebasedatabase.app/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
