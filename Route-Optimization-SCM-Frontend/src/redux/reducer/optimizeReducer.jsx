import {
  OPTIMIZE_PLAN_REQUEST,
  OPTIMIZE_PLAN_SUCCESS,
  OPTIMIZE_PLAN_FAILURE,
} from "../action/optimizeAction";

const initialState = {
  isLoading: false,
  error: null,
  optimizationResult: {
    plan_id: null,
    solutions: {
      genetic_algorithm: [],
      graph_neural_network: null,
      linear_algorithm: [],
    },
  },
};

export const CLEAR_OPTIMIZE_STATE = "CLEAR_OPTIMIZE_STATE";

const optimizeReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPTIMIZE_PLAN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case OPTIMIZE_PLAN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        optimizationResult: action.payload,
      };

    case OPTIMIZE_PLAN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        optimizationResult: initialState.optimizationResult,
      };

    case CLEAR_OPTIMIZE_STATE:
      return initialState;

    default:
      return state;
  }
};

export default optimizeReducer;
