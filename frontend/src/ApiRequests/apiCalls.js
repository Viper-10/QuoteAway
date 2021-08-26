import axios from "axios";

export const signup = async (user) => {
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
