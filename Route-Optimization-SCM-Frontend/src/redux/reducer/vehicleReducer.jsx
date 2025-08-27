import {
  ADD_VEHICLE_REQUEST,
  ADD_VEHICLE_SUCCESS,
  ADD_VEHICLE_FAILURE,
  FETCH_VEHICLES_REQUEST,
  FETCH_VEHICLES_SUCCESS,
  FETCH_VEHICLES_FAILURE,
  DELETE_VEHICLE_REQUEST,
  DELETE_VEHICLE_SUCCESS,
  DELETE_VEHICLE_FAILURE,
  UPDATE_VEHICLE_REQUEST,
  UPDATE_VEHICLE_SUCCESS,
  UPDATE_VEHICLE_FAILURE,
} from "../action/vehicleAction";

const initialState = {
  vehicles: [],
  loading: false,
  error: null,
};

const vehicleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VEHICLES_REQUEST:
    case ADD_VEHICLE_REQUEST:
    case DELETE_VEHICLE_REQUEST:
    case UPDATE_VEHICLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_VEHICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        vehicles: action.payload.vehicles,
        error: null,
      };

    case ADD_VEHICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        vehicles: [...state.vehicles, action.payload],
        error: null,
      };

    case DELETE_VEHICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        vehicles: state.vehicles.filter(
          (vehicle) => vehicle.id !== action.payload
        ),
        error: null,
      };

    case UPDATE_VEHICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id
            ? { ...vehicle, ...action.payload }
            : vehicle
        ),
        error: null,
      };

    case FETCH_VEHICLES_FAILURE:
    case ADD_VEHICLE_FAILURE:
    case DELETE_VEHICLE_FAILURE:
    case UPDATE_VEHICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default vehicleReducer;
