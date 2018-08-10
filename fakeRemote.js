window.onload = () => {
    Storage.get(['state']).then((values) => {
        let fakeRemote = new FakeRemote(values.state);
        fakeRemote.initFakeRemote();
    });
    document.addEventListener('keypress', (key) => {
        console.log('keypress', key)
    })
};

class FakeRemote {

    constructor(state) {
        this.eventListeners = {};
        this.state = state;
        this.dragValues = null;
        this.position = { x: 0, y: 0 };
    }

    initFakeRemote() {
        let active = this.state === STATES.ACTIVE;
        if (active) {

        }
        this.initMessageListener();
        Storage.get(Object.keys(TOUCHES).map((el) => 'keys.' + el)).then((value) => {
            this.keyCodes = {};
            Object.keys(TOUCHES).map((el) => {
                if (value['keys.' + el]) {
                    this.keyCodes[el] = value['keys.' + el];
                }
            });
            this.dealWithState();
        });
    }

    dealWithState() {
        if (this.state === STATES.ACTIVE) {
            this.initFakeRemoteDom();
            this.initFakeRemoteListeners();
            this.initFakeRemoteTouchDom();

        } else {
            this.removeFakeRemoteDom();
        }
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
        this.setKeyEventListener(node, eventConfig, key);
        this.eventZoneNode.appendChild(node);

    }

    updateEventListener(key, newKeyConf) {
        if (!this.eventListeners[key] || !this.eventListeners[key].node) {
            this.createKeyDom(newKeyConf, TOUCHES[key], key)
        } else {
            this.eventListeners[key].node.removeEventListener('click', this.eventListeners[key].event);
            this.setKeyEventListener(this.eventListeners[key].node, newKeyConf, key);
        }
    }

    setKeyEventListener(node, eventConfig, key) {
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
        this.containerNode = document.createElement('div');
        this.containerNode.setAttribute('id', 'fakeRemoteContainer');

        this.fakeRemoteNode = document.createElement('div');
        this.fakeRemoteNode.setAttribute('id', 'fakeRemote');

        this.eventZoneNode = document.createElement('div');
        this.eventZoneNode.setAttribute('id', 'eventZone');

        this.imgNode = document.createElement('img');
        this.imgNode.src = chrome.extension.getURL("remote.png");

        this.fakeRemoteNode.appendChild(this.imgNode);
        this.containerNode.appendChild(this.eventZoneNode);
        this.containerNode.appendChild(this.fakeRemoteNode);

        let body = document.getElementsByTagName('body')[0];
        body.appendChild(this.containerNode);
    }

    removeFakeRemoteDom() {
        if (this.containerNode) {
            this.containerNode.remove();
        }
        this.eventListeners = {};
    }

    initMessageListener() {
        chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
            if (message.askState) {
                sendResponse({ state: this.state })
            } else if (message.onInputValueChange) {
                let value = message.onInputValueChange;
                if (this.state === STATES.ACTIVE) {
                    this.updateEventListener(value.key, value.value);
                }
            } else if (message.onStateChange) {
                this.state = message.onStateChange;
                this.dealWithState();
            }
        });
    }

    initFakeRemoteListeners() {
        this.eventZoneNode.addEventListener('mousedown', (e) => this.onDragStart(e));
        this.eventZoneNode.addEventListener('mouseup', (e) => this.onDragEnd(e));
        this.eventZoneNode.addEventListener('mousemove', (e) => this.onDrag(e));
    }

    onDragStart(event) {
        this.dragValues = {
            previousX: event.clientX,
            previousY: event.clientY
        };
    }

    onDragEnd(event) {
        this.dragValues = null;
    }

    onDrag(event) {
        if (this.dragValues) {
            let deltaX = event.clientX - this.dragValues.previousX;
            let deltaY = event.clientY - this.dragValues.previousY;
            this.dragValues.previousX = event.clientX;
            this.dragValues.previousY = event.clientY;

            this.setRemotePosition(this.position.x + deltaX, this.position.y + deltaY);
        }
    }

    setRemotePosition(top, left) {
        this.position.x = top;
        this.position.y = left;
        this.containerNode.style.top = left + 'px';
        this.containerNode.style.left = top + 'px';
        this.fakeRemoteNode.style.top = left + 'px';
        this.fakeRemoteNode.style.left = top + 'px';
        this.eventZoneNode.style.top = left + 'px';
        this.eventZoneNode.style.left = top + 'px';
    }
}