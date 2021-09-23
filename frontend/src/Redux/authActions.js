import * as apiCalls from "../ApiRequests/apiCalls";

export const loginSuccess = (loginUserData) => {
  return {
    type: "login-success",
    payload: loginUserData,
  };
};

export const loginHandler = (credentails) => {
  return function (dispatch) {
    return apiCalls.login(credentails).then((response) => {
      dispatch(
        loginSuccess({
          ...response.data,
          password: credentails.password,
        })
      );
      return response;
    });
  };
};

export const signupHandler = (user) => {
  return function (dispatch) {
    return apiCalls.signup(user).then((response) => {
      return dispatch(
        loginHandler({ username: user.userName, password: user.password })
      );
    });
  };
};
