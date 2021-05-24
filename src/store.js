import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import _flattenDeep from 'lodash/flattenDeep'
import {userReducer as user, userMiddleware} from './reducers/userAccess'

const reducer = combineReducers({
    user,
})

const middleware = applyMiddleware.apply(null, _flattenDeep([
    userMiddleware
]))

// enable redux debugging
const composeEnhancers = (typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ) || compose;

const store = createStore(reducer, composeEnhancers(middleware));
export default store;