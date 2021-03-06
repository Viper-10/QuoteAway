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

export const getUser = (username) => {
  return axios.get(`/api/1.0/users/${username}`);
};

export const updateUser = (userId, body) => {
  return axios.put("/api/1.0/users/" + userId, body);
};

export const postQuote = (quote) => {
  return axios.post("/api/1.0/quotes", quote);
};

export const loadQuotes = (username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/quotes`
    : "/api/1.0/quotes";
  return axios.get(basePath + "?page=0&size=5&sort=id,desc");
};

export const loadOldQuotes = (quoteId, username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/quotes`
    : "/api/1.0/quotes";

  const path = `${basePath}/${quoteId}?direction=before&page=0&size=5&sort=id,desc`;
  return axios.get(path);
};
export const loadNewQuotes = (quoteId, username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/quotes`
    : "/api/1.0/quotes";

  const path = `${basePath}/${quoteId}?direction=after&sort=id,desc`;
  return axios.get(path);
};
export const loadNewQuoteCount = (quoteId, username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/quotes`
    : "/api/1.0/quotes";

  const path = `${basePath}/${quoteId}?direction=after&count=true`;
  return axios.get(path);
};
export const deleteQuote = (quoteId) => {
  return axios.delete(`/api/1.0/quotes/${quoteId}`);
};
