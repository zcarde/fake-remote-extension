class Config {
    constructor() {
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

            input.addEventListener('keydown', (event) => {
                this.inputValueChanged(touche, {
                    key: event.key,
                    keyCode: event.keyCode,
                    charCode: event.charCode,
                    repeat: event.repeat,
                    code: event.code
                });
                input.value = event.code;
            });
        })
    }

    inputValueChanged(touche, value) {
        let obj = {};
        obj['keys.' + touche] = value;
        Storage.set(obj);
        new Message({ onInputValueChange: { key: touche, value } });
    }
}