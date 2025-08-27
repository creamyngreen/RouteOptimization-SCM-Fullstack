import {
  ADD_PARKING_REQUEST,
  ADD_PARKING_SUCCESS,
  ADD_PARKING_FAILURE,
  FETCH_PARKINGS_REQUEST,
  FETCH_PARKINGS_SUCCESS,
  FETCH_PARKINGS_FAILURE,
  DELETE_PARKING_REQUEST,
  DELETE_PARKING_SUCCESS,
  DELETE_PARKING_FAILURE,
  UPDATE_PARKING_REQUEST,
  UPDATE_PARKING_SUCCESS,
  UPDATE_PARKING_FAILURE,
} from "../action/parkingAction";

const initialState = {
  parkings: [],
  loading: false,
  error: null,
};

const parkingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PARKINGS_REQUEST:
    case ADD_PARKING_REQUEST:
    case DELETE_PARKING_REQUEST:
    case UPDATE_PARKING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PARKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        parkings: action.payload.parkings,
        error: null,
      };

    case ADD_PARKING_SUCCESS:
      return {
        ...state,
        loading: false,
        parkings: [...state.parkings, action.payload],
        error: null,
      };

    case DELETE_PARKING_SUCCESS:
      return {
        ...state,
        loading: false,
        parkings: state.parkings.filter(
          (parking) => parking.id !== action.payload
        ),
        error: null,
      };

    case UPDATE_PARKING_SUCCESS:
      return {
        ...state,
        loading: false,
        parkings: state.parkings.map((parking) =>
          parking.id === action.payload.id
            ? { ...parking, ...action.payload }
            : parking
        ),
        error: null,
      };

    case FETCH_PARKINGS_FAILURE:
    case ADD_PARKING_FAILURE:
    case DELETE_PARKING_FAILURE:
    case UPDATE_PARKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default parkingReducer;
