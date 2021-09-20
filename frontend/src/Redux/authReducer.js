const initialState = {
  id: 0,
  userName: "",
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

  return state;
}
