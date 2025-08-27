import axios from "../../setup/axios";

export const ADD_VEHICLE_REQUEST = "ADD_VEHICLE_REQUEST";
export const ADD_VEHICLE_SUCCESS = "ADD_VEHICLE_SUCCESS";
export const ADD_VEHICLE_FAILURE = "ADD_VEHICLE_FAILURE";
export const FETCH_VEHICLES_REQUEST = "FETCH_VEHICLES_REQUEST";
export const FETCH_VEHICLES_SUCCESS = "FETCH_VEHICLES_SUCCESS";
export const FETCH_VEHICLES_FAILURE = "FETCH_VEHICLES_FAILURE";
export const DELETE_VEHICLE_REQUEST = "DELETE_VEHICLE_REQUEST";
export const DELETE_VEHICLE_SUCCESS = "DELETE_VEHICLE_SUCCESS";
export const DELETE_VEHICLE_FAILURE = "DELETE_VEHICLE_FAILURE";
export const UPDATE_VEHICLE_REQUEST = "UPDATE_VEHICLE_REQUEST";
export const UPDATE_VEHICLE_SUCCESS = "UPDATE_VEHICLE_SUCCESS";
export const UPDATE_VEHICLE_FAILURE = "UPDATE_VEHICLE_FAILURE";

export const fetchVehicles = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_VEHICLES_REQUEST });
    try {
      const response = await axios.get(`/vehicle/read`);

      if (response && response.EC === 1) {
        dispatch({
          type: FETCH_VEHICLES_SUCCESS,
          payload: {
            vehicles: response.DT,
          },
        });
        return response.DT;
      } else {
        dispatch({
          type: FETCH_VEHICLES_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_VEHICLES_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const createVehicle = (vehicleData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_VEHICLE_REQUEST });
    try {
      const response = await axios.post("/vehicle/create", vehicleData);

      if (response && response.EC === 1) {
        dispatch({
          type: ADD_VEHICLE_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: ADD_VEHICLE_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: ADD_VEHICLE_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const deleteVehicle = (vehicleId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_VEHICLE_REQUEST });
    try {
      const response = await axios.delete(`/vehicle/delete/${vehicleId}`);

      if (response && response.EC === 1) {
        dispatch({
          type: DELETE_VEHICLE_SUCCESS,
          payload: vehicleId,
        });
        return response.DT;
      } else {
        dispatch({
          type: DELETE_VEHICLE_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: DELETE_VEHICLE_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const updateVehicle = (vehicleId, vehicleData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_VEHICLE_REQUEST });
    try {
      const response = await axios.put(
        `/vehicle/update/${vehicleId}`,
        vehicleData
      );

      if (response && response.EC === 1) {
        dispatch({
          type: UPDATE_VEHICLE_SUCCESS,
          payload: { id: vehicleId, ...vehicleData },
        });
        return response.DT;
      } else {
        dispatch({
          type: UPDATE_VEHICLE_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_VEHICLE_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
