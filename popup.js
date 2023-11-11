document.addEventListener('DOMContentLoaded', () => {
    const pinButton = document.getElementById('pinButton');
    const searchBar = document.getElementById('searchBar');
    const pinnedItemsContainer = document.getElementById('pinnedItemsContainer');

    // Event listener for the 'Pin It' button
    pinButton.addEventListener('click', pinCurrentPage);

    // Event listener for the search bar
    searchBar.addEventListener('input', filterPinnedItems);

    // Load saved pages on startup
    loadSavedPages();

    function pinCurrentPage() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            let activeTab = tabs[0];
            savePageInfo(activeTab);
        });
    }

    function savePageInfo(tab) {
        // Avoid saving if the tab is a Chrome URL or the new tab page
        if (!tab.url || tab.url.startsWith('chrome://') || tab.url === 'chrome-extension://newtab/') {
            return;
        }

        chrome.storage.sync.get({ savedTabs: [] }, (items) => {
            let savedTabs = items.savedTabs;
            // Check if the tab is already saved
            if (savedTabs.find(savedTab => savedTab.url === tab.url)) {
                showFeedback('Page already pinned.');
                return;
            }
            savedTabs.push({ title: tab.title, url: tab.url });
            chrome.storage.sync.set({ savedTabs }, () => {
                showFeedback('Page pinned successfully.');
                createCardForPage({ title: tab.title, url: tab.url });
            });
        });
    }

    function loadSavedPages() {
        chrome.storage.sync.get({ savedTabs: [] }, (items) => {
            const pinnedItemsContainer = document.getElementById('pinnedItemsContainer');
            pinnedItemsContainer.innerHTML = ''; // Clear the current list
            items.savedTabs.forEach(createCardForPage);
        });
    }

    function createCardForPage(pageInfo) {
        let card = document.createElement('div');
        card.className = 'card';
    
        let title = document.createElement('div');
        title.textContent = pageInfo.title;
        title.className = 'title';
    
        let link = document.createElement('a');
        link.href = pageInfo.url;
        link.textContent = pageInfo.url;
        link.className = 'link';
        link.target = '_blank';
    
        let deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<img src="images/delete.svg" alt="Delete">';
        deleteButton.onclick = () => removePage(pageInfo, card);
    
        card.appendChild(title);
        card.appendChild(link);
        card.appendChild(deleteButton);
    
        pinnedItemsContainer.appendChild(card);
    }

    function filterPinnedItems(event) {
        const searchTerm = event.target.value.toLowerCase();
        const cards = pinnedItemsContainer.getElementsByClassName('card');
        Array.from(cards).forEach(card => {
            const title = card.querySelector('.title').textContent.toLowerCase();
            const url = card.querySelector('.link').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || url.includes(searchTerm);
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    function removePage(pageInfo, card) {
        chrome.storage.sync.get({ savedTabs: [] }, (items) => {
            const savedTabs = items.savedTabs.filter(savedTab => savedTab.url !== pageInfo.url);
            chrome.storage.sync.set({ savedTabs }, () => {
                card.remove(); // Remove the card from the UI
                showFeedback('Page removed successfully.');
            });
        });
    }

    function showFeedback(message) {
        const feedbackMessage = document.getElementById('feedbackMessage');
        feedbackMessage.textContent = message;
        feedbackMessage.style.display = 'block';
        setTimeout(() => feedbackMessage.style.display = 'none', 2000);
    }
});
