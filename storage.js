class Storage {
    static get(item) {
        if (chrome.storage) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(item, resolve);
            });
        } else {
            let results = {};
            item.map((el) => {
                results[el] = localStorage.getItem(el);
            });
            return Promise.resolve(results);
        }
    }

    static set(item) {
        if (chrome.storage) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.set(item, () => {
                    console.log('SET');
                    resolve();
                });
            });
        } else {
            Object.keys(item).map((key, value) => {
                localStorage.setItem(key, item[key])
            });
            return Promise.resolve();
        }
    }
}