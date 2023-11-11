// This script runs in the context of web pages.

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "get_page_details") {
        // Collect the required details from the web page
        let pageDetails = {
          title: document.title,
          url: window.location.href
        };
  
        sendResponse(pageDetails);
      }
  });
  
  // You can add more code here to interact with the web page as needed.
  