document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup loaded');
    const userStatus = document.getElementById('userStatus');
    const quotaInfo = document.getElementById('quotaInfo');
    const refreshButton = document.getElementById('refreshButton');

    function checkUserStatus() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getUserInfo"}, function(response) {
          console.log('response',response);
          if (chrome.runtime.lastError) {
            userStatus.textContent = 'Error: Make sure you are on http://192.168.106.37:8080';
            quotaInfo.textContent = '';
          } else if (response && response.userId) {
            userStatus.textContent = `User ID: ${response.userId}`;
            if (response.userData) {
              quotaInfo.textContent = `Queries remaining: ${response.userData.queriesRemaining}`;
            } else {
              quotaInfo.textContent = 'User data not available';
            }
          } else {
            userStatus.textContent = 'Not logged in';
            quotaInfo.textContent = '';
          }
        });
      });
    }

    refreshButton.addEventListener('click', checkUserStatus);

    // Check status when popup opens
    // checkUserStatus();
  })



document.getElementById('signIn').addEventListener('click',()=>{
  chrome.runtime.sendMessage({message:'login'},(response)=>{
console.log('response',response);
  })
})