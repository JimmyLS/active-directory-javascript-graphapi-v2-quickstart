// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new Msal.UserAgentApplication(msalConfig);

let accessToken;

// Register Callbacks for Redirect flow
myMSALObj.handleRedirectCallback(authRedirectCallBack);

function authRedirectCallBack(error, response) {
  if (error) {
      console.log(error);
  } else {
      if (response.tokenType === "id_token") {
          console.log("id_token acquired at: " + new Date().toString());

          if (myMSALObj.getAccount()) {
            showWelcomeMessage(myMSALObj.getAccount());
          }

      } else if (response.tokenType === "access_token") {
        console.log("access_token acquired at: " + new Date().toString());
        accessToken = response.accessToken;

        try {
          callMSGraph(graphConfig.graphMailEndpoint, accessToken, updateUI);
        } catch(err) {
          console.log(err)
        } finally {
          profileButton.classList.add('d-none');
          mailButton.classList.remove('d-none');
        }
      } else {
          console.log("token type is:" + response.tokenType);
      }
  }
}

if (myMSALObj.getAccount()) {
  showWelcomeMessage(myMSALObj.getAccount());
}

function signIn() {
  myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
  myMSALObj.logout();
}

// This function can be removed if you do not need to support IE
function getTokenRedirect(request, endpoint) {
  return myMSALObj.acquireTokenSilent(request)
      .then((response) => {
        console.log(response);
        if (response.accessToken) {
            console.log("access_token acquired at: " + new Date().toString());
            return  response.accessToken;
        }
      })
      .catch(error => {
          console.log("silent token acquisition fails. acquiring token using redirect");
          alert(error.errorCode+':'+error.errorMessage);
          // fallback to interaction when silent call fails
          return myMSALObj.acquireTokenRedirect(request);
      });
}

function seeProfile() {
  getTokenRedirect(loginRequest, graphConfig.graphMeEndpoint);
}

function readMail() {
  if (accessToken) {
    callMSGraph(graphConfig.graphMailEndpoint, accessToken, updateUI);
  } else {
    getTokenRedirect(tokenRequest, graphConfig.graphMailEndpoint);
  }
}

let signBtn = ()=>{
    let btn = document.createElement('button')
    btn.addEventListener('click',function(){
        myMSALObj.loginRedirect(loginRequest);
    })
    btn.innerText = '点击我登录'
    btn.style.background = '#cccccc'
    btn.style.color='#ffffff'
    btn.style.width = 80
    btn.style.height = 50
    btn.style.margin = '20px'
    btn.style.padding = '20px'
    var first=document.body.firstChild;//得到页面的第一个元素
    document.body.insertBefore(btn,first);

    let getToken = document.createElement('button')
    getToken.addEventListener('click',function(){
        getTokenRedirect(loginRequest).then(response=>{
            alert(response)
        })
    })
    getToken.innerText = '点我获取token'
    getToken.style.background = '#cccccc'
    getToken.style.color='#ffffff'
    getToken.style.width = 80
    getToken.style.height = 50
    getToken.style.margin = '20px'
    getToken.style.padding = '20px'
    document.body.insertBefore(getToken,first);
}

signBtn()
