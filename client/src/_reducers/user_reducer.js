const initialState = null;

export default function (prevState = initialState, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...prevState,
        loginSuccess: action.payload,
      };
    case "REGISTER":
      return {
        ...prevState,
        registerSuccess: action.payload,
      };
    case "AUTH":
      return {
        ...prevState,
        userData: action.payload,
      };
    default:
      return prevState;
  }
}
