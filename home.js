let state = STATES.ACTIVE;

let actualizeVisible = (previousState) => {
    if (previousState) {
        States[previousState].map((id) => {
            let node = document.getElementById(id);
            Utils.toggleVisible(node);
        });
    }
    console.log('States', States, state);
    States[state].map((id) => {
        let node = document.getElementById(id);
        Utils.toggleVisible(node);
    });
};
let toggleExtensionState = (newState) => {
    let previousState = state;
    if (newState) {
        state = STATES.ACTIVE;
    } else {
        state = STATES.INACTIVE;
    }
    actualizeVisible(previousState);
    return state;
};
let saveExtensionState = (state) => {
    Storage.set({ 'state': state });
};
let hideAll = () => {
    Object.keys(States).map((key) => {
        States[key].map((id) => {
            let node = document.getElementById(id);
            Utils.hide(node)
        });
    });
};
let askState = (toggleBtn) => {
    let message = new Message({ askState: true });
    console.log('message', message);
    message.onResponse.then((response) => {
        if (!response) {
            response = { state: STATES.INACTIVE };
        }
        state = response.state;
        if (state === STATES.ACTIVE) {
            toggleBtn.classList.add('active');
        } else {
            toggleBtn.classList.remove('active');
        }
        console.log('response', response);
    })
};
let loadApp = (initState) => {
    let toggleBtn = document.getElementById("toggleBtn");
    askState(toggleBtn);
    hideAll();
    new Config();
    state = initState;
    if (initState === STATES.ACTIVE) {
        toggleBtn.classList.add('active');
    }
    actualizeVisible();
    toggleBtn.onclick = () => {
        let state = Utils.toggleClass(toggleBtn, 'active');
        state = toggleExtensionState(state);
        saveExtensionState(state);
        new Message({ onStateChange: state });
    };

};

window.onload = () => {
    Storage.get(['state']).then((values) => {
        if (!values.state) {
            values = { state: STATES.ACTIVE };
        }
        loadApp(values.state);

    })
};