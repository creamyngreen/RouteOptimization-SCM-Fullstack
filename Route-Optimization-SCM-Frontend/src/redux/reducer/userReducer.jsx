import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAILURE,
  DELETE_USERS_REQUEST,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAILURE,
  UPDATE_USERS_REQUEST,
  UPDATE_USERS_SUCCESS,
  UPDATE_USERS_FAILURE,
  ADD_USER_REQUEST,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
} from "../action/userAction";

const initialState = {
  users: [],
  loading: false,
  error: null,
  totalRows: 0,
  totalPages: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
    case SEARCH_USERS_REQUEST:
    case DELETE_USERS_REQUEST:
    case UPDATE_USERS_REQUEST:
    case ADD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        totalRows: action.payload.totalRows,
        totalPages: action.payload.totalPages,
        error: null,
      };

    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };

    case ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [action.payload, ...state.users],
        error: null,
      };

    case DELETE_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => !action.payload.includes(user.id)),
        error: null,
      };

    case UPDATE_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) => {
          const updatedUser = action.payload.find((u) => u.id === user.id);
          return updatedUser ? { ...user, ...updatedUser } : user;
        }),
        error: null,
      };

    case FETCH_USERS_FAILURE:
    case SEARCH_USERS_FAILURE:
    case DELETE_USERS_FAILURE:
    case UPDATE_USERS_FAILURE:
    case ADD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
