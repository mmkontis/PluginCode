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
  });