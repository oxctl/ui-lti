const PREFIX = 'user';
export const NEEDS_LOGIN = PREFIX + ':needs:login';
export const SET_SERVER = PREFIX + ':server:set';

export function userNeedsLogin(value = true) {
    return {
        type: NEEDS_LOGIN,
        status: value 
    }
}

export function setServer(value) {
    return {
        type: SET_SERVER,
        status: value 
    }
}