import {
  ADD_PERMISSION_REQUEST,
  ADD_PERMISSION_SUCCESS,
  ADD_PERMISSION_FAILURE,
  FETCH_PERMISSIONS_REQUEST,
  FETCH_PERMISSIONS_SUCCESS,
  FETCH_PERMISSIONS_FAILURE,
  SEARCH_PERMISSIONS_REQUEST,
  SEARCH_PERMISSIONS_SUCCESS,
  SEARCH_PERMISSIONS_FAILURE,
  DELETE_PERMISSIONS_REQUEST,
  DELETE_PERMISSIONS_SUCCESS,
  DELETE_PERMISSIONS_FAILURE,
  UPDATE_PERMISSIONS_REQUEST,
  UPDATE_PERMISSIONS_SUCCESS,
  UPDATE_PERMISSIONS_FAILURE,
  ASSIGN_PERMISSION_REQUEST,
  ASSIGN_PERMISSION_SUCCESS,
  ASSIGN_PERMISSION_FAILURE,
  FETCH_ROLE_PERMISSIONS_REQUEST,
  FETCH_ROLE_PERMISSIONS_SUCCESS,
  FETCH_ROLE_PERMISSIONS_FAILURE,
} from "../action/permissionAction";

const initialState = {
  permissions: [],
  rolePermissions: [],
  loading: false,
  error: null,
  totalRows: 0,
  totalPages: 0,
};

const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Permissions
    case FETCH_PERMISSIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        permissions: action.payload.permissions,
        totalRows: action.payload.totalRows,
        totalPages: action.payload.totalPages,
        error: null,
      };
    case FETCH_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Create Permission
    case ADD_PERMISSION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_PERMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        permissions: [...state.permissions, action.payload],
        error: null,
      };
    case ADD_PERMISSION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Permission
    case UPDATE_PERMISSIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        permissions: state.permissions.map((permission) =>
          permission.id === action.payload.id ? action.payload : permission
        ),
        error: null,
      };
    case UPDATE_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete Permission
    case DELETE_PERMISSIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        permissions: state.permissions.filter(
          (permission) => permission.id !== action.payload
        ),
        error: null,
      };
    case DELETE_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Search Permissions
    case SEARCH_PERMISSIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        permissions: action.payload,
        error: null,
      };
    case SEARCH_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Assign Permission to Role
    case ASSIGN_PERMISSION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ASSIGN_PERMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ASSIGN_PERMISSION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch Role Permissions
    case FETCH_ROLE_PERMISSIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ROLE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        rolePermissions: action.payload,
        error: null,
      };
    case FETCH_ROLE_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default permissionReducer;
