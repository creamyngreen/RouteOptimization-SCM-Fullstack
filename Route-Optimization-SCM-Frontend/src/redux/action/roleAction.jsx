import axios from "../../setup/axios";

export const ADD_ROLE_REQUEST = "ADD_ROLE_REQUEST";
export const ADD_ROLE_SUCCESS = "ADD_ROLE_SUCCESS";
export const ADD_ROLE_FAILURE = "ADD_ROLE_FAILURE";
export const FETCH_ROLES_REQUEST = "FETCH_ROLES_REQUEST";
export const FETCH_ROLES_SUCCESS = "FETCH_ROLES_SUCCESS";
export const FETCH_ROLES_FAILURE = "FETCH_ROLES_FAILURE";
export const DELETE_ROLES_REQUEST = "DELETE_ROLES_REQUEST";
export const DELETE_ROLES_SUCCESS = "DELETE_ROLES_SUCCESS";
export const DELETE_ROLES_FAILURE = "DELETE_ROLES_FAILURE";
export const UPDATE_ROLES_REQUEST = "UPDATE_ROLES_REQUEST";
export const UPDATE_ROLES_SUCCESS = "UPDATE_ROLES_SUCCESS";
export const UPDATE_ROLES_FAILURE = "UPDATE_ROLES_FAILURE";

export const doAddRole = (roleData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_ROLE_REQUEST });
    try {
      const payload = {
        name: roleData.name,
        description: roleData.description,
      };

      const response = await axios.post("/roles/create", payload);

      if (response && response.EC === 1) {
        dispatch({
          type: ADD_ROLE_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: ADD_ROLE_FAILURE,
          payload: response.EM,
        });
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: ADD_ROLE_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const fetchRoles = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ROLES_REQUEST });
    try {
      const response = await axios.get(`/roles/read`);

      if (response && response.EC === 1) {
        dispatch({
          type: FETCH_ROLES_SUCCESS,
        });
        return response.DT;
      } else {
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: FETCH_ROLES_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const deleteRole = (roleId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_ROLES_REQUEST });
    try {
      const response = await axios.delete(`/roles/delete?id=${roleId}`);

      if (response && response.EC === 1) {
        dispatch({
          type: DELETE_ROLES_SUCCESS,
          payload: roleId,
        });
        return response.DT;
      } else {
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: DELETE_ROLES_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const updateRole = (roleId, roleData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_ROLES_REQUEST });
    try {
      const payload = {
        name: roleData.name,
        description: roleData.description,
      };

      const response = await axios.put(`/roles/update/${roleId}`, payload);

      if (response && response.EC === 1) {
        dispatch({
          type: UPDATE_ROLES_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: UPDATE_ROLES_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
