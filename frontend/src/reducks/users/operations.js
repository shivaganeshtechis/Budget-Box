import API from "../../API";
import { signUpAction, signUpError, signInAction, signInError } from "./actions";

const api = new API();
const LOGIN_USER_KEY = "BUDGET_NOTEBOOK_LOGIN_USER_KEY";

export const fetchUserFromLocalStorage = () => {
    return async (dispatch) => {
        const userJSON = localStorage.getItem(LOGIN_USER_KEY);
        if (userJSON && userJSON.token !== "") {
            dispatch(signInAction(JSON.parse(userJSON)));
        }
    };
};

export const signUp = (data = {}) => {
    return async (dispatch) => {
        return api.signUp(data)
            .then(resopnse => {
                localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(resopnse));
                dispatch(signUpAction(resopnse));
            })
            .catch(error => {
                dispatch(signUpError(error.response.data));
            });
    };
};

export const signIn = (data = {}, onSuccess = null) => {
    return async (dispatch) => {
        return api.signIn(data)
            .then(resopnse => {
                localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(resopnse));
                dispatch(signInAction(resopnse));
                onSuccess();
            })
            .catch(error => {
                dispatch(signInError(error.response.data));
            });
    };
};