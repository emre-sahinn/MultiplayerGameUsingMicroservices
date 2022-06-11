
export const LoginStart = () => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (token) => ({
  type: "LOGIN_SUCCESS",
  payload: token,
});

export const LogOut = () => ({
  type: "LOGOUT",
  
});

