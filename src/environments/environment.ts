// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  frontend_base: "http://localhost:4200",
  backend_base: "http://localhost:3101",
  backend_login: "/login",
  backend_read: "/read",
  backend_write: "/write",
  weare_backend_base: "http://localhost:3003",
  backend_get_pods: "/pods",
  //weare_backend_base: "https://app-api.we-are-acc.vito.be",
  weare_backend_login: "/login",
  demo_utils_hostname: "http://localhost:8080",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
