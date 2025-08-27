import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from "../action/accountAction";

const INITIAL_STATE = {
  userInfo: {
    user_id: "",
    access_token: "",
    refresh_token: "",
    email: "",
    fullname: "",
    username: "",
    roleWithPermission: {},
  },
  isLoading: false,
  errMessage: "",
};

const accountReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        errMessage: "",
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        userInfo: action.user,
        isLoading: false,
        errMessage: "",
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        errMessage: action.error,
      };

    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: false,
        errMessage: "",
      };

    case LOGOUT_SUCCESS:
      return {
        ...state,
        userInfo: action.user,
        isLoading: false,
        errMessage: {
          access_token: "",
          refresh_token: "",
          email: "",
          username: "",
          roleWithPermission: {},
        },
      };

    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errMessage: action.error,
      };

    default:
      return state;
  }
};

export default accountReducer;
