import {loadJSON} from "./loadJSON";

export const ACTION_UPDATE_SUFFIX = ':update';

export function createLoadingMiddleware(loadingAction, loadedAction, prepareCall, echoOriginalAction = false) {

    
    const genericMiddleware = store => next => action => {
        switch(action.type) {
            case loadingAction: {
                // Allow the action to continue down to the reducer
                next(action);

                const config = prepareCall(action, store);
                const originalAction = echoOriginalAction ? action : undefined;

                return loadJSON(config).then(result => {
                    const resultAction = {
                        type: loadedAction,
                        result
                    };
                    if(echoOriginalAction) {
                        resultAction.originalAction = action;
                    }
                    store.dispatch(resultAction);
                }, setupErrorHandler(store, loadedAction, undefined, originalAction));
            }
            default:
                return next(action);
        }
    };

    return genericMiddleware;
}

function noOp() {}
export function createActionMiddleware(myAction, prepareCall, successCallback = noOp) {



    let latestRequest;
    const myActionUpdate = myAction + ACTION_UPDATE_SUFFIX;
    const genericMiddleware = store => next => action => {

        switch(action.type) {
            case myAction: {
                latestRequest = action;
                store.dispatch({
                    actionId: action.actionId,
                    type: myActionUpdate
                });

                const config = prepareCall(action, store);
                return loadJSON(config).then(res => {
                    
                    if(latestRequest === action) {
                        store.dispatch({
                            actionId: action.actionId,
                            type: myActionUpdate,
                            result: res
                        });
                        successCallback(store, action, res);
                    }
                }, err => {
                    console.log('err ', err)
                    if(latestRequest === action) {
                        const handler = setupErrorHandler(store, myActionUpdate, action.actionId);
                        handler(err);
                    }
                });
            }
            default:
                return next(action);
        }
    };

    return genericMiddleware;
}

function setupErrorHandler(store, actionName, actionId, originalAction) {
    return error => {
        store.dispatch({
            actionId,
            originalAction,
            type: actionName,
            error
        });
    }
}