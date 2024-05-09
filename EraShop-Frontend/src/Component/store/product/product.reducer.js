import { key } from "../../util/config";
import { SetDevKey, setToken } from "../../util/setAuth";
import * as ActionType from "./product.type";
import jwt_decode from "jwt-decode";

const initialState = {
  product: [],
  productDetail: [],
  totalProduct: 0,

};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_REAL_PRODUCT:
      return {
        ...state,
        product: action.payload.product,
        totalProduct: action.payload.totalProducts,
      };
    case ActionType.GET_FAKE_PRODUCT:
      return {
        ...state,
        fakeProduct: action.payload.product,
        totalProduct: action.payload.totalProducts,
      };
    case ActionType.CREATE_PRODUCT:
      
      let data = [...state.product];
      data.unshift(action.payload);
      return {
        ...state,
        product: data,
      };
    case ActionType.UPDATE_PRODUCT:
      return {
        ...state,
        product: state.product.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_PRODUCT:
      return {
        ...state,
        product: state.product.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    case ActionType.PRODUCT_NEW_COLLECTION:
      return {
        ...state,
        product: state.product.map((Collection) => {
          if (Collection?._id === action.payload?.id)
            return action.payload.data;
          else return Collection;
        }),
      };
    case ActionType.PRODUCT_OUT_OF_STOCK:
      return {
        ...state,
        product: state.product.map((Stock) => {
          if (Stock?._id === action.payload.id) return action.payload.data;
          else return Stock;
        }),
        productDetail: action.payload.data,
      };
    case ActionType.PRODUCT_DETAIL:
      console.log("action.payload", action.payload);
      return {
        ...state,
        productDetail: action.payload,
      };
    case ActionType.PRODUCT_REVIEW:
      return {
        ...state,
        review: action.payload,
      };
      case ActionType.PRODUCT_REQUEST:
      
      return {
        ...state,
        productRequest: action.payload,
      };
      case ActionType.GET_UPDATE_PRODUCT_REQUEST:
      
      return {
        ...state,
        updateProductRequest: action.payload,
      };
      case ActionType.PRODUCT_REQUEST_ACTION:
      
      return {
        ...state,
        productRequest: state.productRequest.filter((productRequest) => productRequest._id !== action.payload),
      };
      case ActionType.UPDATE_PRODUCT_REQUEST:
      
      return {
        ...state,
        updateRequest: action.payload,
      };
      case ActionType.UPDATE_PRODUCT_REQUEST_ACTION:
      
      return {
        ...state,
        updateRequest: state.updateRequest.filter((updateRequest) => updateRequest._id !== action.payload),
      };
    default:
      return state;
  }
};
