import { key } from "../../util/config";
import { SetDevKey, setToken } from "../../util/setAuth";
import * as ActionType from "./sellerRequest.type";
import jwt_decode from "jwt-decode";

const initialState = {
  sellerRequest: [],
};

export const sellerRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_SELLER_REQUEST:
      return {
        ...state,
        sellerRequest: action.payload,
      };
    case ActionType.ACCEPT_SELLER_REQUEST:
      return {
        ...state,
        sellerRequest: state.sellerRequest.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    case ActionType.UPDATE_SELLER_REQUEST:
      return {
        ...state,
        sellerRequest: state.sellerRequest.map((data) =>
          data._id === action.payload.updateRequest._id
            ? action.payload.updateRequest
            : data
        ),
      };
    default:
      return state;
  }
};
