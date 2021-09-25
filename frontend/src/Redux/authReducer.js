const initialState = {
  id: 0,
  username: "",
  displayName: "",
  image: "",
  isLoggedIn: false,
  password: "",
};
export default function authReducer(state = initialState, action) {
  if (action.type == "logout-success") {
    return { ...initialState };
    // return initialState;
  }

  if (action.type == "login-success") {
    return {
      ...action.payload,
      isLoggedIn: true,
    };
  }
  return state;
}
