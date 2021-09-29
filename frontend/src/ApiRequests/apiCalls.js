import axios from "axios";

export const signup = (user) => {
  return axios.post("api/1.0/users", user);
};
export const login = (user) => {
  /* Since we're not passing login crendentials to api as request body,
   but instead we want to pass it as authorization headers to be validated
   by spring security using basic http, we send user as the third parameter
   which configures the auth part of request. 
   
   Since we need to send auth in every request, we have a separate function to set authorization header
   */

  return axios.post("api/1.0/login", {}, { auth: user });
};

export const setAuthorizationHeader = ({ username, password, isLoggedIn }) => {
  if (isLoggedIn) {
    axios.defaults.headers.common["Authorization"] = `Basic ${btoa(
      username + ":" + password
    )}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const listUsers = (param = { page: 0, size: 3 }) => {
  const path = `/api/1.0/users?page=${param.page || 0}&size=${param.size || 3}`;
  return axios.get(path);
};
