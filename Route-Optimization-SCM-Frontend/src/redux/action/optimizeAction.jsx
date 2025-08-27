import axios from "axios";

export const OPTIMIZE_PLAN_REQUEST = "OPTIMIZE_PLAN_REQUEST";
export const OPTIMIZE_PLAN_SUCCESS = "OPTIMIZE_PLAN_SUCCESS";
export const OPTIMIZE_PLAN_FAILURE = "OPTIMIZE_PLAN_FAILURE";

export const optimizePlan = (plan) => {
  return async (dispatch) => {
    dispatch({ type: OPTIMIZE_PLAN_REQUEST });
    try {
      const payload = {
        plan_id: plan.id,
        destination: plan.destination,
        deadline: plan.deadline,
        demand: plan.demand,
        priority: plan.priority === "High" ? 1 : 0,
      };

      const response = await axios.post(
        "http://localhost:8081/optimize-plan/",
        payload
      );

      if (response && response.status === 200) {
        dispatch({
          type: OPTIMIZE_PLAN_SUCCESS,
          payload: response.data,
        });
        return response.data;
      } else {
        throw new Error("Optimization failed");
      }
    } catch (error) {
      dispatch({
        type: OPTIMIZE_PLAN_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
