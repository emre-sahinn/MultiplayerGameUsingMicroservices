const AuthReducer = (state, action) => {
  switch (action.type) {
   case "LOGIN_START":
      return {
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        token: action.payload,
      };
    case "LOGOUT":
      return {
        token: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;