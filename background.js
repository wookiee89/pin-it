chrome.action.onClicked.addListener((tab) => {
    // Check if the tab is not undefined and has a URL
    if (tab && tab.url && tab.title) {
      // Save the tab information
      saveTabInfo(tab);
    }
  });
  
  function saveTabInfo(tab) {
    // Fetch existing saved tabs from storage
    chrome.storage.sync.get({ savedTabs: [] }, (items) => {
      let savedTabs = items.savedTabs;
      const tabInfo = { title: tab.title, url: tab.url };
  
      // Add the new tab info to the array
      savedTabs.push(tabInfo);
  
      // Save the updated array back to storage
      chrome.storage.sync.set({ savedTabs: savedTabs }, () => {
        console.log('Tab info saved:', tabInfo);
      });
    });
  }
  