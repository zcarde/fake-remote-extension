class Message {
    constructor(message) {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, (tabs) => {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, message);
        });
    }
}