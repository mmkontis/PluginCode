import { GoogleAuthProvider } from "firebase/auth";
export function startAuth() {
    return new Promise((resolve, reject) => {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      
      chrome.identity.launchWebAuthFlow({
        url: provider.buildSignInUrl(),
        interactive: true
      }, (responseUrl) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          const credential = provider.credentialFromResult({ url: responseUrl });
          firebase.auth().signInWithCredential(credential)
            .then(resolve)
            .catch(reject);
            return 'signed in'
        }
      });
    });
  }
  
  function signOut() {
    return firebase.auth().signOut();
  }