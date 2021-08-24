import axios from "axios";

export const signup = (user) => {
  return axios.post("api/1.0/users", user);
  // return fetch("api/1.0/users", {
  //   body: user,
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  // });
};
