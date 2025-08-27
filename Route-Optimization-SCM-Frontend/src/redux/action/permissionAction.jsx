import axios from "../../setup/axios";

export const ADD_PERMISSION_REQUEST = "ADD_PERMISSION_REQUEST";
export const ADD_PERMISSION_SUCCESS = "ADD_PERMISSION_SUCCESS";
export const ADD_PERMISSION_FAILURE = "ADD_PERMISSION_FAILURE";
export const FETCH_PERMISSIONS_REQUEST = "FETCH_PERMISSIONS_REQUEST";
export const FETCH_PERMISSIONS_SUCCESS = "FETCH_PERMISSIONS_SUCCESS";
export const FETCH_PERMISSIONS_FAILURE = "FETCH_PERMISSIONS_FAILURE";
export const SEARCH_PERMISSIONS_REQUEST = "SEARCH_PERMISSIONS_REQUEST";
export const SEARCH_PERMISSIONS_SUCCESS = "SEARCH_PERMISSIONS_SUCCESS";
export const SEARCH_PERMISSIONS_FAILURE = "SEARCH_PERMISSIONS_FAILURE";
export const DELETE_PERMISSIONS_REQUEST = "DELETE_PERMISSIONS_REQUEST";
export const DELETE_PERMISSIONS_SUCCESS = "DELETE_PERMISSIONS_SUCCESS";
export const DELETE_PERMISSIONS_FAILURE = "DELETE_PERMISSIONS_FAILURE";
export const UPDATE_PERMISSIONS_REQUEST = "UPDATE_PERMISSIONS_REQUEST";
export const UPDATE_PERMISSIONS_SUCCESS = "UPDATE_PERMISSIONS_SUCCESS";
export const UPDATE_PERMISSIONS_FAILURE = "UPDATE_PERMISSIONS_FAILURE";
export const ASSIGN_PERMISSION_REQUEST = "ASSIGN_PERMISSION_REQUEST";
export const ASSIGN_PERMISSION_SUCCESS = "ASSIGN_PERMISSION_SUCCESS";
export const ASSIGN_PERMISSION_FAILURE = "ASSIGN_PERMISSION_FAILURE";
export const FETCH_ROLE_PERMISSIONS_REQUEST = "FETCH_ROLE_PERMISSIONS_REQUEST";
export const FETCH_ROLE_PERMISSIONS_SUCCESS = "FETCH_ROLE_PERMISSIONS_SUCCESS";
export const FETCH_ROLE_PERMISSIONS_FAILURE = "FETCH_ROLE_PERMISSIONS_FAILURE";

export const fetchPermissions = (page = 1, limit = 10) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PERMISSIONS_REQUEST });
    try {
      const response = await axios.get(
        `/permissions/read?page=${page}&limit=${limit}`
      );

      if (response && response.EC === 1) {
        dispatch({
          type: FETCH_PERMISSIONS_SUCCESS,
          payload: {
            permissions: response.DT.permissions,
            totalRows: response.DT.totalRows,
            totalPages: response.DT.totalPages,
          },
        });
        return response.DT;
      } else {
        dispatch({
          type: FETCH_PERMISSIONS_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_PERMISSIONS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const createPermission = (permissionData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_PERMISSION_REQUEST });
    try {
      const response = await axios.post("/permissions/create", permissionData);

      if (response && response.EC === 1) {
        dispatch({
          type: ADD_PERMISSION_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: ADD_PERMISSION_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: ADD_PERMISSION_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const updatePermission = (id, permissionData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PERMISSIONS_REQUEST });
    try {
      const response = await axios.put(
        `/permissions/update/${id}`,
        permissionData
      );

      if (response && response.EC === 1) {
        dispatch({
          type: UPDATE_PERMISSIONS_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: UPDATE_PERMISSIONS_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_PERMISSIONS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const deletePermission = (id) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_PERMISSIONS_REQUEST });
    try {
      const response = await axios.delete(`/permissions/delete/${id}`);

      if (response && response.EC === 1) {
        dispatch({
          type: DELETE_PERMISSIONS_SUCCESS,
          payload: id,
        });
        return response.DT;
      } else {
        dispatch({
          type: DELETE_PERMISSIONS_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: DELETE_PERMISSIONS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const assignPermissionToRole = (data) => {
  return async (dispatch) => {
    dispatch({ type: ASSIGN_PERMISSION_REQUEST });
    try {
      const response = await axios.post("/permissions/assign-to-role", data);

      if (response && response.EC === 1) {
        dispatch({
          type: ASSIGN_PERMISSION_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: ASSIGN_PERMISSION_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: ASSIGN_PERMISSION_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const getPermissionsByRole = (roleId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ROLE_PERMISSIONS_REQUEST });
    try {
      const response = await axios.get(`/roles/${roleId}/permissions`);

      if (response && response.EC === 1) {
        dispatch({
          type: FETCH_ROLE_PERMISSIONS_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: FETCH_ROLE_PERMISSIONS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
