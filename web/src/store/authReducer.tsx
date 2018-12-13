const initState = {};

interface ErrorMessageType {
  message: string;
}

interface AuthActions {
  type: string;
  error?: ErrorMessageType;
}

const authReducer = (state = initState, action: AuthActions) => {
  switch (action.type) {
    case "LOGIN_FAILED":
      console.log("login error");
      return {
        ...state,
        authError: "Login failed"
      };
    case "LOGIN_SUCCESS":
      console.log("login success");
      return {
        ...state,
        authError: null
      };
    case "LOG_OUT":
      console.log("logged out");
      return state;
    case "SIGNUP_SUCCESS":
      console.log("signup success");
      return {
        ...state,
        authError: null
      };
    case "SIGNUP_ERROR":
      console.log("signup error");
      return {
        ...state,
        authError: action.error && action.error.message
      };
    default:
      // console.log(`Unknown auth function ${action.type}`);
      return state;
  }
};

export default authReducer;
