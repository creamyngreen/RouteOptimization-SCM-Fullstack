import {
  GET_AUDITLOGS_REQUEST,
  GET_AUDITLOGS_SUCCESS,
  GET_AUDITLOGS_FAILURE,
  DELETE_AUDITLOG_REQUEST,
  DELETE_AUDITLOG_SUCCESS,
  DELETE_AUDITLOG_FAILURE,
} from "../action/auditlogAction";

const initialState = {
  auditLogs: [],
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
};

const auditLogReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch audit logs cases
    case GET_AUDITLOGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_AUDITLOGS_SUCCESS:
      return {
        ...state,
        loading: false,
        auditLogs: action.payload.auditLogs,
        error: null,
      };

    case GET_AUDITLOGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete audit log cases
    case DELETE_AUDITLOG_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteError: null,
      };

    case DELETE_AUDITLOG_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        auditLogs: state.auditLogs.filter((log) => log.id !== action.payload),
        deleteError: null,
      };

    case DELETE_AUDITLOG_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload,
      };

    default:
      return state;
  }
};

export default auditLogReducer;
