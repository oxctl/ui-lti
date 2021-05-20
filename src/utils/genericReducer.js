export const ACTION_RESET_SUFFIX = ':clear';
export const ACTION_UPDATE_SUFFIX = ':update';

// generic reducer for using the spinner loader while waiting for data from the reducer
const identityFunction = data => data;
export function createLoadingReducer(loadingAction, loadedAction, initialLoadingState = false, loadedCallback = identityFunction) {
    const initialState = {
        result: null,
        error: null,
        loading: initialLoadingState
    };
    return function reducer(state = initialState, action) {
        switch(action.type) {
            case loadingAction: {
                // When we start loading we clear any old errors, but we keep any old result around. If the new load
                // takes a while then it'll be handy to have the old state in the store to display on the screen.
                return {
                    result: state.result,
                    error: null,
                    loading: true
                }
            }
            case loadedAction: {
                // Give the callback a chance to reformat the action, if we need to.
                loadedCallback(action);
                return {
                    result: action.result,
                    error: action.error,
                    loading: false
                }
            }
            default: {
                return state;
            }
        }
    };
}

// generic reducer for persform instant actions, e.g. click and reset of a button
export function createActionReducer(myAction) {
    const myActionUpdate = myAction + ACTION_UPDATE_SUFFIX;
    const myActionReset = myAction + ACTION_RESET_SUFFIX;
    const initialState = {
        actionId: undefined,
        result: undefined,
        error: undefined,
        working: false
    };

    return function reducer(state = initialState, action) {
        switch (action.type) {
            case myActionUpdate: {
                const newState = {
                    actionId: action.actionId,
                    result: action.result,
                    error: action.error,
                    working: (action.result === undefined) && (action.error === undefined)
                }
                return newState;
            }
            case myActionReset: {
                return initialState;
            }
            default: {
                return state;
            }
        }
    }
}

// generic reducer for just setting the state once at a time e.g setting a boolean value
export function createFlagReducer(myAction) {

    return function reducer(state = false, action) {
        switch (action.type) {
            case myAction: {
                return action.status;
            }
            default: {
                return state;
            }
        }
    }
}