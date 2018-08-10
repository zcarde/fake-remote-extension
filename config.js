class Config {
    constructor() {
        this.events = {};
        this.parentNode = document.getElementById('config');
        Object.keys(TOUCHES).map((touche) => {
            let node = document.createElement('div');
            node.className = 'toucheContainer';

            let label = document.createElement('div');
            label.className = 'label';
            label.textContent = touche + ' :';

            let inputContainer = document.createElement('div');
            inputContainer.className = 'input';
            let input = document.createElement('input');
            Storage.get(['keys.' + touche]).then((value) => {
                if (value['keys.' + touche]) {
                    input.value = value['keys.' + touche].code;
                }
            });

            inputContainer.appendChild(input);
            node.appendChild(label);
            node.appendChild(inputContainer);
            this.parentNode.appendChild(node);
            input.addEventListener('keyup', (event) => {
                if (!this.events[event.code]) {
                    return;
                }
                this.events[event.code].up = true;
                if (this.events[event.code].down) {
                    this.inputValueChanged(touche, {
                        key: event.key,
                        keyCode: event.which,
                        code: event.which,
                        pressCode: this.events[event.code].press,
                        repeat: event.repeat,
                    });
                    this.events[event.code] = null;
                    input.value = event.code;
                }
            });
            input.addEventListener('keypress', (event) => {
                if (!this.events[event.code]) {
                    return;
                }
                this.events[event.code].press = event.which
            });
            input.addEventListener('keydown', (event) => {
                this.events[event.code] = {
                    down: true
                };
            });
        })
    }

    inputValueChanged(touche, value) {
        let obj = {};
        obj['keys.' + touche] = value;
        Storage.set(obj);
        new Message({ onInputValueChange: { key: touche, value } }, true);
    }
}