import {
  ADD_ROLE_REQUEST,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAILURE,
  FETCH_ROLES_REQUEST,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_FAILURE,
  DELETE_ROLES_REQUEST,
  DELETE_ROLES_SUCCESS,
  DELETE_ROLES_FAILURE,
  UPDATE_ROLES_REQUEST,
  UPDATE_ROLES_SUCCESS,
  UPDATE_ROLES_FAILURE,
} from "../action/roleAction";

const initialState = {
  roles: [],
  loading: false,
  error: null,
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Roles
    case FETCH_ROLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: action.payload,
        error: null,
      };
    case FETCH_ROLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Add Role
    case ADD_ROLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: [...state.roles, action.payload],
        error: null,
      };
    case ADD_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Role
    case UPDATE_ROLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: state.roles.map((role) =>
          role.id === action.payload.id ? action.payload : role
        ),
        error: null,
      };
    case UPDATE_ROLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete Role
    case DELETE_ROLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: state.roles.filter((role) => role.id !== action.payload),
        error: null,
      };
    case DELETE_ROLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default roleReducer;
