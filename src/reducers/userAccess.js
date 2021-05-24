import { combineReducers } from 'redux';
import { PROMPT_LOGIN, SET_SERVER } from '../actions/userAccess';
import { createActionReducer, createFlagReducer } from '../utils/genericReducer'

export const userAccessReducer = combineReducers({
	promptLogin: createFlagReducer(PROMPT_LOGIN),
	server: createFlagReducer(SET_SERVER)
});

// set up for middleware operations 
// helpful for making async and api calls
export const userAccessMiddleware = [];
