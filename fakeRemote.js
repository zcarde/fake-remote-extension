window.onload = () => {
    Storage.get(['state']).then((values) => {
        let fakeRemote = new FakeRemote(values.state);
        fakeRemote.initFakeRemote();
    });

};

class FakeRemote {

    constructor(state) {
        this.eventListeners = {};
        this.state = state;
    }

    initFakeRemote() {
        let active = this.state === STATES.ACTIVE;
        this.addListeners();
        if (active) {
            this.initFakeRemoteDom();
        }
        this.initMessageListener();
        Storage.get(Object.keys(TOUCHES).map((el) => 'keys.' + el)).then((value) => {
            this.keyCodes = {};
            Object.keys(TOUCHES).map((el) => {
                if (value['keys.' + el]) {
                    this.keyCodes[el] = value['keys.' + el];
                }
            });
            if (active) {
                this.initFakeRemoteTouchDom();
            }
        });
    }

    initFakeRemoteTouchDom() {
        if (!this.keyCodes) {
            return;
        }
        Object.keys(this.keyCodes).map((key) => {
            if (!TOUCHES[key]) {
                return;
            }
            this.createKeyDom(this.keyCodes[key], TOUCHES[key], key);
        });
    }

    createKeyDom(eventConfig, domConfig, key) {
        let node = document.createElement('div');
        node.className = 'keyNode ' + key;
        node.style.left = domConfig.x + 'px';
        node.style.top = domConfig.y + 'px';
        node.style.width = domConfig.width + 'px';
        node.style.height = domConfig.height + 'px';
        if (!this.eventListeners[key]) {
            this.eventListeners[key] = {
                node: node
            };
        }
        this.setEventListener(node, eventConfig, key);
        this.container.appendChild(node);

    }

    updateEventListener(key, newKeyConf) {
        this.eventListeners[key].node.removeEventListener('click', this.eventListeners[key].event);
        this.setEventListener(this.eventListeners[key].node, newKeyConf, key);
    }

    setEventListener(node, eventConfig, key) {
        this.eventListeners[key].event = () => {
            let event = new KeyboardEvent("keypress", {
                bubbles: true,
                cancelable: true,
                key: eventConfig.key,
                charCode: eventConfig.charCode,
                repeat: eventConfig.repeat
            });
            delete event.keyCode;
            Object.defineProperty(event, "keyCode", { "value": eventConfig.keyCode });
            document.getElementsByTagName('body')[0].dispatchEvent(event);
        };
        node.addEventListener('click', this.eventListeners[key].event);
    }

    initFakeRemoteDom() {
        this.container = document.createElement('div');
        this.container.setAttribute('id', 'fakeRemote');
        this.img = document.createElement('img');
        this.img.src = chrome.extension.getURL("remote.png");
        this.container.appendChild(this.img);
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(this.container);
    }

    removeFakeRemoteDom() {
        this.container.remove();
        this.eventListeners = {};
    }

    initMessageListener() {
        chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
            if (message.askState) {
                console.log('send response');
                sendResponse({state: this.state})
            }else if (message.onInputValueChange) {
                let value = message.onInputValueChange;
                this.updateEventListener(value.key, value.value);
            } else if (message.onStateChange) {
                let value = message.onStateChange;
                this.state = value;
                if (value === STATES.ACTIVE) {
                    this.initFakeRemoteDom();
                    this.initFakeRemoteTouchDom();
                } else {
                    this.removeFakeRemoteDom();
                }
            }
        });
    }

    addListeners() {
        document.addEventListener('keypress', (key) => {
            console.log('keypress', key)
        })
    }
}