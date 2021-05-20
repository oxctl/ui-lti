const PREFIX = 'user';
export const PROMPT_LOGIN = PREFIX + ':prompt:login';
export const SET_SERVER = PREFIX + ':server:set';

export const userAccessAction = {
    promptUserLogin : (value = true) => {
        return{
            type: PROMPT_LOGIN,
            status: value 
        }
    },
    setServer : (value = null) => {
        return{
            type: SET_SERVER,
            status: value 
        }
    }
}
