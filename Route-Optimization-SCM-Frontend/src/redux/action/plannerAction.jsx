import axios from "../../setup/axios";
import moment from "moment";
// Define action types as constants
export const ADD_PLAN_REQUEST = "ADD_PLAN_REQUEST";
export const ADD_PLAN_SUCCESS = "ADD_PLAN_SUCCESS";
export const ADD_PLAN_FAILURE = "ADD_PLAN_FAILURE";
export const FETCH_PLANS_REQUEST = "FETCH_PLANS_REQUEST";
export const FETCH_PLANS_SUCCESS = "FETCH_PLANS_SUCCESS";
export const FETCH_PLANS_FAILURE = "FETCH_PLANS_FAILURE";
export const SEARCH_PLANS_REQUEST = "SEARCH_PLANS_REQUEST";
export const SEARCH_PLANS_SUCCESS = "SEARCH_PLANS_SUCCESS";
export const SEARCH_PLANS_FAILURE = "SEARCH_PLANS_FAILURE";
export const DELETE_PLANS_REQUEST = "DELETE_PLANS_REQUEST";
export const DELETE_PLANS_SUCCESS = "DELETE_PLANS_SUCCESS";
export const DELETE_PLANS_FAILURE = "DELETE_PLANS_FAILURE";
export const UPDATE_PLANS_REQUEST = "UPDATE_PLANS_REQUEST";
export const UPDATE_PLANS_SUCCESS = "UPDATE_PLANS_SUCCESS";
export const UPDATE_PLANS_FAILURE = "UPDATE_PLANS_FAILURE";

export const doAddPlan = (planData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_PLAN_REQUEST });
    try {
      const payload = {
        plannerId: planData.plannerId,
        managerId: planData.managerId,
        deadline: planData.deadline,
        initialDate: new Date().toLocaleDateString("en-US"),
        status: "draft",
        destination: planData.destination,
        priority: planData.priority,
        demand: parseFloat(planData.demand),
      };

      const response = await axios.post("/procurement-plan/create", payload);

      if (response && response.EC === 1) {
        dispatch({
          type: ADD_PLAN_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: ADD_PLAN_FAILURE,
          payload: response.EM,
        });
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: ADD_PLAN_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const fetchFilterPlans = (
  page = 1,
  limit = 100,
  filters = {},
  sort = []
) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PLANS_REQUEST });
    try {
      const payload = {
        filters: {
          status: filters.status || null,
          priority: filters.priority !== null ? Number(filters.priority) : null,
          initialFrom: filters.initialFrom || null,
          initialTo: filters.initialTo || null,
          deadlineFrom: filters.deadlineFrom || null,
          deadlineTo: filters.deadlineTo || null,
        },
        sort: sort,
      };

      const response = await axios.post(
        `/procurement-plan/filter?page=${page}&limit=${limit}`,
        payload
      );

      if (response && response.EC === 1) {
        const transformedData = {
          ...response.DT,
          procurementPlans: response.DT.procurementPlans.map((plan) => ({
            ...plan,
            priority:
              plan.priority === 1 || plan.priority === "1" ? "High" : "Low",
          })),
        };

        dispatch({
          type: FETCH_PLANS_SUCCESS,
          payload: {
            data: transformedData.procurementPlans,
            total: transformedData.totalRows,
            totalPages: transformedData.totalPages,
            page: page,
            limit: limit,
          },
        });
        return transformedData;
      } else {
        dispatch({
          type: FETCH_PLANS_SUCCESS,
          payload: {
            data: [],
            total: 0,
            totalPages: 1,
            page: 1,
            limit: limit,
          },
        });
      }
    } catch (error) {
      console.error("Fetch plans error:", error);
      dispatch({
        type: FETCH_PLANS_FAILURE,
        payload: {
          data: [],
          total: 0,
          totalPages: 1,
          page: 1,
          limit: limit,
        },
      });
    }
  };
};

export const searchPlans = (searchQuery) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_PLANS_REQUEST });

    try {
      const response = await axios.get(
        `/procurement-plan/search?searchQuery=${searchQuery}`
      );

      if (response && response.EC === 1) {
        const transformedData = response.DT.map((plan) => ({
          key: plan.id,
          id: plan.id,
          initialDate: moment(plan.initialDateAt).format("YYYY-MM-DD"),
          deadline: moment(plan.deadline).format("YYYY-MM-DD"),
          demand: plan.demand,
          destination: plan.destination,
          priority: plan.priority === 1 ? "High" : "Low",
          status: plan.status,
        }));

        dispatch({
          type: SEARCH_PLANS_SUCCESS,
          payload: {
            data: transformedData,
            total: transformedData.length,
            totalPages: Math.ceil(transformedData.length / 10),
            page: 1,
            limit: 10,
          },
        });

        return transformedData;
      } else {
        dispatch({
          type: SEARCH_PLANS_SUCCESS,
          payload: {
            data: [],
            total: 0,
            totalPages: 1,
            page: 1,
            limit: 10,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: SEARCH_PLANS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const deletePlans = (planIds) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_PLANS_REQUEST });
    try {
      const response = await axios.delete("/procurement-plan/bulk-delete", {
        data: { ids: planIds },
      });

      if (response && response.EC === 1) {
        dispatch({
          type: DELETE_PLANS_SUCCESS,
          payload: planIds,
        });
        return response.DT;
      } else {
        dispatch({
          type: DELETE_PLANS_FAILURE,
          payload: response.EM,
        });
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: DELETE_PLANS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const updatePlans = (plans) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PLANS_REQUEST });
    try {
      const response = await axios.put("/procurement-plan/bulk-update", {
        plans: plans.map((plan) => ({
          id: plan.id,
          demand: plan.demand,
          priority: plan.priority === "High" ? 1 : 0,
          destination: plan.destination,
          deadline: plan.deadline,
          status: plan.status,
        })),
      });

      if (response && response.EC === 1) {
        const updatedPlans = Array.isArray(response.DT)
          ? response.DT
          : response.DT.plans || [response.DT];

        dispatch({
          type: UPDATE_PLANS_SUCCESS,
          payload: updatedPlans,
        });

        return updatedPlans;
      } else {
        dispatch({
          type: UPDATE_PLANS_FAILURE,
          payload: response.EM,
        });
        throw new Error(response.EM);
      }
    } catch (error) {
      dispatch({
        type: UPDATE_PLANS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
