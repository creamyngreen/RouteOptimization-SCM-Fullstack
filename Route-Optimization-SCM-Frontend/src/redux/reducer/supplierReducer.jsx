import {
  ADD_SUPPLIER_REQUEST,
  ADD_SUPPLIER_SUCCESS,
  ADD_SUPPLIER_FAILURE,
  FETCH_SUPPLIERS_REQUEST,
  FETCH_SUPPLIERS_SUCCESS,
  FETCH_SUPPLIERS_FAILURE,
  DELETE_SUPPLIER_REQUEST,
  DELETE_SUPPLIER_SUCCESS,
  DELETE_SUPPLIER_FAILURE,
  UPDATE_SUPPLIER_REQUEST,
  UPDATE_SUPPLIER_SUCCESS,
  UPDATE_SUPPLIER_FAILURE,
} from "../action/supplierAction";

const initialState = {
  suppliers: [],
  loading: false,
  error: null,
};

const supplierReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUPPLIERS_REQUEST:
    case ADD_SUPPLIER_REQUEST:
    case DELETE_SUPPLIER_REQUEST:
    case UPDATE_SUPPLIER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_SUPPLIERS_SUCCESS:
      return {
        ...state,
        loading: false,
        suppliers: action.payload.suppliers,
        error: null,
      };

    case ADD_SUPPLIER_SUCCESS:
      return {
        ...state,
        loading: false,
        suppliers: [...state.suppliers, action.payload],
        error: null,
      };

    case DELETE_SUPPLIER_SUCCESS:
      return {
        ...state,
        loading: false,
        suppliers: state.suppliers.filter(
          (supplier) => supplier.id !== action.payload
        ),
        error: null,
      };

    case UPDATE_SUPPLIER_SUCCESS:
      return {
        ...state,
        loading: false,
        suppliers: state.suppliers.map((supplier) =>
          supplier.id === action.payload.id
            ? { ...supplier, ...action.payload }
            : supplier
        ),
        error: null,
      };

    case FETCH_SUPPLIERS_FAILURE:
    case ADD_SUPPLIER_FAILURE:
    case DELETE_SUPPLIER_FAILURE:
    case UPDATE_SUPPLIER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default supplierReducer;
