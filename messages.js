class Message {
    constructor(message, sendToAllTabs = false) {
        this.onResponse = new Promise((resolve, reject) => {
            this.resolveOnResponse = resolve;
        });
        let query = {};
        if (!sendToAllTabs) {
            query = {
                currentWindow: true,
                active: true
            };
        }
        chrome.tabs.query(query, (tabs) => {
            let promises = [];
            let resolves = [];
            tabs.map((tab, i) => {
                promises.push(
                    new Promise((resolve, reject) => {
                        resolves.push(resolve);
                    })
                );
                chrome.tabs.sendMessage(tab.id, message, resolves[i]);
            });
            Promise.all(promises).then(this.resolveOnResponse);
        });
    }
}