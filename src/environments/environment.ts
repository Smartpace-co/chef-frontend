// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   assetUrl: 'http://localhost:4021',
//   apiBaseUrl: 'http://localhost:3001/api/v1',
//   cmsApiBaseUrl: 'http://localhost:3000/api/v1',
//   bucketUrl:'https://storage.googleapis.com/chefk-prod',
//   public_key:'pk_test_51J2qQTLnyrqVEiSe5LUumXNARXUbszlstNit2HsGbPr2rRtJPSttDyGHEOt4yIU4M14e2KRz3f1Oa53sNhDOyMTv00Hun3pjbK',
//   production: false
// };

/**
 * #check
 * these staging environment, Past it here to prevent make editing staging 
 * properties like optimization in angular.json.
 * Which Optimization take a some of time with running project locally.
 */

export const environment = {
  production: false,
  assetUrl: 'https://api-core-stage.chefkoochooloo.com/',
  apiBaseUrl: 'https://api-core-stage.chefkoochooloo.com/api/v1',
  cmsApiBaseUrl: 'https://api-cms-stage.chefkoochooloo.com/api/v1',
  bucketUrl:'https://storage.googleapis.com/chefk-staging',
  public_key:'pk_test_51J2qQTLnyrqVEiSe5LUumXNARXUbszlstNit2HsGbPr2rRtJPSttDyGHEOt4yIU4M14e2KRz3f1Oa53sNhDOyMTv00Hun3pjbK',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
