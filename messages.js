class Message {
    constructor(message) {
        this.onResponse = new Promise((resolve, reject) => {
            this.resolveOnResponse = resolve;
        });
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, (tabs) => {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, message, this.resolveOnResponse);
        });
    }
}