import axios from "../../setup/axios";
export const GET_AUDITLOGS_REQUEST = "GET_AUDITLOGS_REQUEST";
export const GET_AUDITLOGS_SUCCESS = "GET_AUDITLOGS_SUCCESS";
export const GET_AUDITLOGS_FAILURE = "GET_AUDITLOGS_FAILURE";
export const DELETE_AUDITLOG_REQUEST = "DELETE_AUDITLOG_REQUEST";
export const DELETE_AUDITLOG_SUCCESS = "DELETE_AUDITLOG_SUCCESS";
export const DELETE_AUDITLOG_FAILURE = "DELETE_AUDITLOG_FAILURE";

// Action to fetch audit logs
export const fetchAuditLogs = () => {
  return async (dispatch) => {
    dispatch({ type: GET_AUDITLOGS_REQUEST });
    try {
      const response = await axios.get(`/audit-log/read`);

      if (response && response.EC === 1) {
        dispatch({
          type: GET_AUDITLOGS_SUCCESS,
          payload: {
            auditLogs: response.DT,
          },
        });
        return response.DT;
      } else {
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: GET_AUDITLOGS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

// Action to delete an audit log
export const deleteAuditLog = (id) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_AUDITLOG_REQUEST });
    try {
      const response = await axios.delete(`/audit-log/delete/${id}`);

      if (response && response.EC === 1) {
        dispatch({
          type: DELETE_AUDITLOG_SUCCESS,
          payload: id,
        });
        return response.DT;
      } else {
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: DELETE_AUDITLOG_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
