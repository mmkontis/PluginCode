let user_signed_in = false
const CLIENT_ID=encodeURIComponent("1028732700335-2lqm1gakj1ne390999h0ji6lgqvt1dg9.apps.googleusercontent.com")
const REDIRECT_URI=encodeURIComponent('https://ocbbkcmahnkdfmcopcacllmjmhdainid.chromiumapp.org')
const SCOPE = encodeURIComponent("openid")
const PROMPT = encodeURIComponent('consent')
const STATE = encodeURIComponent('fdsfsd')
const RESPONSE_TYPE=encodeURIComponent('id_token')





function create_oauth2_url() {
  let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  let url = 
  `https://accounts.google.com/o/oauth2/v2/auth
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&state=${STATE}
&scope=${SCOPE}
&prompt=${PROMPT}
&nonce=${nonce}
`;

  console.log(url);

  return url;
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getUserId") {
    fetch('http://192.168.106.37:8080/getUserId')
      .then(response => response.json())
      .then(data => {
        sendResponse({userId: data.userId});
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({error: 'Failed to fetch user ID'});
      });
    return true;  // Will respond asynchronously
  }
    
    if(request.message === "login"){
      if(user_signed_in){
        console.log('user already sign in');
        return;
      } ;
        chrome.identity.launchWebAuthFlow({
          url:create_oauth2_url(),
          interactive:true
        },(redirectUrl)=>{
          console.log('redirect url',redirectUrl);
          let id_token = redirectUrl.substring(redirectUrl.indexOf('id_token=')+9,redirectUrl.indexOf('&'));
          // send this token on the backend server , parse it and save it in the database

          
            })
        }
        })

    
