let state = STATES.ACTIVE;

let actualizeVisible = (previousState) => {
    if (previousState) {
        States[previousState].map((id) => {
            let node = document.getElementById(id);
            Utils.hide(node);
        });
    }
    States[state].map((id) => {
        let node = document.getElementById(id);
        Utils.show(node);
    });
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
    message.onResponse.then((responses) => {
        responses.map((response) => {
            if (!response) {
                response = { state: STATES.INACTIVE };
            }
            state = response.state;
            if (state === STATES.ACTIVE) {
                toggleBtn.classList.add('active');
            } else {
                toggleBtn.classList.remove('active');
            }
        });
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
        let previousState = state;
        state = state === STATES.ACTIVE ? STATES.INACTIVE : STATES.ACTIVE;
        if (state === STATES.ACTIVE) {
            toggleBtn.classList.add(STATES.ACTIVE)
        } else {
            toggleBtn.classList.remove(STATES.ACTIVE)
        }
        actualizeVisible(previousState);
        saveExtensionState(state);
        new Message({ onStateChange: state }, true);
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