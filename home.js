let state = STATES.ACTIVE;

let actualizeVisible = (previousState) => {
    if (previousState) {
        States[previousState].map((id) => {
            let node = document.getElementById(id);
            Utils.toggleVisible(node);
        });
    }
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
        state = STATES.DESACTIVATED;
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
let loadApp = (initState) => {
    let toggleBtn = document.getElementById("toggleBtn");
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
        new Message({onStateChange: state});
    };

};

window.onload = () => {
    Storage.get(['state']).then((values) => {
        if (!values.state) {
            values = {state: STATES.ACTIVE};
        }
        loadApp(values.state);

    })
};