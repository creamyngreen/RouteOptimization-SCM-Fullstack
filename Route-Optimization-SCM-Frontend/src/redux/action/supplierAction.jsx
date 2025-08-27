import axios from "../../setup/axios";

export const ADD_SUPPLIER_REQUEST = "ADD_SUPPLIER_REQUEST";
export const ADD_SUPPLIER_SUCCESS = "ADD_SUPPLIER_SUCCESS";
export const ADD_SUPPLIER_FAILURE = "ADD_SUPPLIER_FAILURE";
export const FETCH_SUPPLIERS_REQUEST = "FETCH_SUPPLIERS_REQUEST";
export const FETCH_SUPPLIERS_SUCCESS = "FETCH_SUPPLIERS_SUCCESS";
export const FETCH_SUPPLIERS_FAILURE = "FETCH_SUPPLIERS_FAILURE";
export const DELETE_SUPPLIER_REQUEST = "DELETE_SUPPLIER_REQUEST";
export const DELETE_SUPPLIER_SUCCESS = "DELETE_SUPPLIER_SUCCESS";
export const DELETE_SUPPLIER_FAILURE = "DELETE_SUPPLIER_FAILURE";
export const UPDATE_SUPPLIER_REQUEST = "UPDATE_SUPPLIER_REQUEST";
export const UPDATE_SUPPLIER_SUCCESS = "UPDATE_SUPPLIER_SUCCESS";
export const UPDATE_SUPPLIER_FAILURE = "UPDATE_SUPPLIER_FAILURE";

export const fetchSuppliers = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_SUPPLIERS_REQUEST });
    try {
      const response = await axios.get(`/suppliers/read`);

      if (response && response.EC === 1) {
        dispatch({
          type: FETCH_SUPPLIERS_SUCCESS,
          payload: {
            suppliers: response.DT,
          },
        });
        return response.DT;
      } else {
        dispatch({
          type: FETCH_SUPPLIERS_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_SUPPLIERS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const createSupplier = (supplierData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_SUPPLIER_REQUEST });
    try {
      const response = await axios.post("/suppliers/create", supplierData);

      if (response && response.EC === 1) {
        dispatch({
          type: ADD_SUPPLIER_SUCCESS,
          payload: response.DT,
        });
        return response.DT;
      } else {
        dispatch({
          type: ADD_SUPPLIER_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: ADD_SUPPLIER_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const deleteSupplier = (supplierId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_SUPPLIER_REQUEST });
    try {
      const response = await axios.delete(`/suppliers/delete/${supplierId}`);

      if (response && response.EC === 1) {
        dispatch({
          type: DELETE_SUPPLIER_SUCCESS,
          payload: supplierId,
        });
        return response.DT;
      } else {
        dispatch({
          type: DELETE_SUPPLIER_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: DELETE_SUPPLIER_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const updateSupplier = (supplierId, supplierData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_SUPPLIER_REQUEST });
    try {
      const response = await axios.put(
        `/suppliers/update/${supplierId}`,
        supplierData
      );

      if (response && response.EC === 1) {
        dispatch({
          type: UPDATE_SUPPLIER_SUCCESS,
          payload: { id: supplierId, ...supplierData },
        });
        return response.DT;
      } else {
        dispatch({
          type: UPDATE_SUPPLIER_FAILURE,
          payload: response.EM,
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_SUPPLIER_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
