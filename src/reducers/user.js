import { combineReducers } from 'redux';
import { NEEDS_LOGIN, SET_SERVER } from '../actions/user';
import { createActionReducer } from '../utils/genericReducer'

const initialUserState = {
	result: undefined,
	error: undefined,
	loading: false,
};

export const userReducer = combineReducers({
	needsLogin: createActionReducer(NEEDS_LOGIN),
	server: createActionReducer(SET_SERVER)
});

export const userMiddleware = [
];
