import {
  ADD_PLAN_REQUEST,
  ADD_PLAN_SUCCESS,
  ADD_PLAN_FAILURE,
  FETCH_PLANS_REQUEST,
  FETCH_PLANS_SUCCESS,
  FETCH_PLANS_FAILURE,
  SEARCH_PLANS_REQUEST,
  SEARCH_PLANS_SUCCESS,
  SEARCH_PLANS_FAILURE,
  DELETE_PLANS_REQUEST,
  DELETE_PLANS_SUCCESS,
  DELETE_PLANS_FAILURE,
  UPDATE_PLANS_REQUEST,
  UPDATE_PLANS_SUCCESS,
  UPDATE_PLANS_FAILURE,
} from "../action/plannerAction";

const initialState = {
  plans: {
    data: [],
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
};

const plannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLAN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case ADD_PLAN_SUCCESS:
      return {
        ...state,
        plans: {
          ...state.plans,
          data: [...state.plans.data, action.payload],
          total: state.plans.total + 1,
        },
        isLoading: false,
        error: null,
      };
    case ADD_PLAN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case FETCH_PLANS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_PLANS_SUCCESS:
      return {
        ...state,
        plans: {
          data: action.payload.data || [],
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 1,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
        },
        isLoading: false,
        error: null,
      };
    case FETCH_PLANS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case SEARCH_PLANS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case SEARCH_PLANS_SUCCESS:
      return {
        ...state,
        plans: {
          data: action.payload.data || [],
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 1,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
        },
        isLoading: false,
        error: null,
      };
    case SEARCH_PLANS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case DELETE_PLANS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case DELETE_PLANS_SUCCESS:
      return {
        ...state,
        plans: {
          ...state.plans,
          data: state.plans.data.filter(
            (plan) => !action.payload.includes(plan.id)
          ),
          total: state.plans.total - action.payload.length,
        },
        isLoading: false,
        error: null,
      };
    case DELETE_PLANS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case UPDATE_PLANS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case UPDATE_PLANS_SUCCESS:
      return {
        ...state,
        plans: {
          ...state.plans,
          data: state.plans.data.map((plan) => {
            const updatedPlans = Array.isArray(action.payload)
              ? action.payload
              : [action.payload];
            const updatedPlan = updatedPlans.find((p) => p.id === plan.id);

            if (updatedPlan) {
              return {
                ...plan,
                demand: updatedPlan.demand,
                priority: updatedPlan.priority === 1 ? "High" : "Low",
                destination: updatedPlan.destination,
                deadline: updatedPlan.deadline,
              };
            }
            return plan;
          }),
        },
        isLoading: false,
        error: null,
      };
    case UPDATE_PLANS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default plannerReducer;
