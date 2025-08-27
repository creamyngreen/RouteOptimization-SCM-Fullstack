import axios from "../../setup/axios";

export const ADD_PARKING_REQUEST = "ADD_PARKING_REQUEST";
export const ADD_PARKING_SUCCESS = "ADD_PARKING_SUCCESS";
export const ADD_PARKING_FAILURE = "ADD_PARKING_FAILURE";
export const FETCH_PARKINGS_REQUEST = "FETCH_PARKINGS_REQUEST";
export const FETCH_PARKINGS_SUCCESS = "FETCH_PARKINGS_SUCCESS";
export const FETCH_PARKINGS_FAILURE = "FETCH_PARKINGS_FAILURE";
export const DELETE_PARKING_REQUEST = "DELETE_PARKING_REQUEST";
export const DELETE_PARKING_SUCCESS = "DELETE_PARKING_SUCCESS";
export const DELETE_PARKING_FAILURE = "DELETE_PARKING_FAILURE";
export const UPDATE_PARKING_REQUEST = "UPDATE_PARKING_REQUEST";
export const UPDATE_PARKING_SUCCESS = "UPDATE_PARKING_SUCCESS";
export const UPDATE_PARKING_FAILURE = "UPDATE_PARKING_FAILURE";

export const fetchParkings = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PARKINGS_REQUEST });
    try {
      const response = await axios.get(`/parkings/read`);

      if (response && response.EC === 1) {
        dispatch({
          type: FETCH_PARKINGS_SUCCESS,
          payload: {
            parkings: response.DT,
          },
        });
        return response.DT;
      } else {
        dispatch({
          type: FETCH_PARKINGS_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_PARKINGS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const createParking = (parkingData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_PARKING_REQUEST });
    try {
      const response = await axios.post("/parkings/create", parkingData);

      if (response && response.EC === 1) {
        dispatch({
          type: ADD_PARKING_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: ADD_PARKING_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: ADD_PARKING_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const deleteParking = (parkingId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_PARKING_REQUEST });
    try {
      const response = await axios.delete(`/parkings/delete/${parkingId}`);

      if (response && response.EC === 1) {
        dispatch({
          type: DELETE_PARKING_SUCCESS,
          payload: parkingId,
        });
        return response.DT;
      } else {
        dispatch({
          type: DELETE_PARKING_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: DELETE_PARKING_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const updateParking = (parkingId, parkingData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PARKING_REQUEST });
    try {
      const response = await axios.put(
        `/parkings/update/${parkingId}`,
        parkingData
      );

      if (response && response.EC === 1) {
        dispatch({
          type: UPDATE_PARKING_SUCCESS,
          payload: { id: parkingId, ...parkingData },
        });
        return response.DT;
      } else {
        dispatch({
          type: UPDATE_PARKING_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_PARKING_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
