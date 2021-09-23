import axios from "axios";

export const signup = (user) => {
  return axios.post("api/1.0/users", user);

  // const response = await fetch("api/1.0/users", {
  //   body: user,
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  // });
  // const data = await response.json();
  // console.log(data);
};
export const login = (user) => {
  /* Since we're not passing login crendentials to api as request body,
   but instead we want to pass it as authorization headers to be validated
   by spring security using basic http, we send user as the third parameter
   which configures the auth part of request*/
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
