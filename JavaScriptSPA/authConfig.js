 
//Enable logging in MSAL.js
function loggerCallback(logLevel, message, containsPii) {
  console.log(message);
}

// Config object to be passed to Msal on creation.
// For a full list of msal.js configuration parameters, 
// visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
const msalConfig = {
  auth: {
    clientId: "32a57c0a-2f0a-4942-8093-bc8b906f025f",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://localhost",
    //redirectUri: "http://sts.azurehybrid.tk"
    postLogoutRedirectUri: "https://localhost"
  },
    system: {
      logger: new Msal.Logger(
                             loggerCallback ,{
                                  level: Msal.LogLevel.Verbose,
                                  piiLoggingEnabled: true
                             }
                     )
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    secureCookies: true,
  }
};  
  
// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
  scopes: ["openid", "profile", "user.read"]
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
  scopes: ["Mail.Read"]
};