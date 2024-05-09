import { key } from "../../util/config";
import { SetDevKey, setToken } from "../../util/setAuth";
  import * as ActionType from "./seller.type";
import jwt_decode from "jwt-decode";

const initialState = {
  seller: [],
  totalSeller: 0,
  sellerWallet:{}
};

export const sellerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_SELLER:
      return {
        ...state,
        seller: action.payload,
        totalSeller: action.totalSeller,
      };
      case ActionType.GET_SELLER_DROP_DOWN : 
      return {
        ...state,
        seller : action.payload
      }
    case ActionType.BLOCK_UNBLOCK_SELLER:
      console.log(action.payload, ":::SELLER");
      return {
        ...state,
        seller: state.seller.map((sellerBlock) => 
         
          sellerBlock._id === action.payload.id ? {...sellerBlock,isBlock : action.payload.data.isBlock} : sellerBlock
        ),
        sellerProfile: action.payload.data,
      };
    case ActionType.CREATE_SELLER:
      let data = [...state.seller];
      console.log(action.payload);
      data.unshift(action.payload);

      return {
        ...state,
        seller: data,
      };
    case ActionType.UPDATE_SELLER:
      return {
        ...state,
        seller: state.seller.map((data) =>
          data._id === action.payload.updateSeller._id
            ? action.payload.updateSeller
            : data
        ),
      };
    case ActionType.GET_SELLER_PROFILE:
      return {
        ...state,
        sellerProfile: action.payload,
      };
    case ActionType.GET_SELLER_PRODUCT:
      return {
        ...state,
        product: action.payload,
      };
    case ActionType.GET_SELLER_WALLET:
      return {
        ...state,
        sellerWallet: action.payload,
      };
    case ActionType.GET_SELLER_TRANSITION:
      return {
        ...state,
        sellerTransition: action.payload,
      };
    case ActionType.GET_SELLER_ORDER:
      return {
        ...state,
        sellerOrder: action.payload,
      };
    case ActionType.GET_SELLER_ORDER_DETAIL:
      return {
        ...state,
        sellerOrderDetail: action.payload,
      };
      case ActionType.GET_LIVE_SELLER:
      return {
        ...state,
        liveSeller: action.payload,
        
      };
      case ActionType.GET_LIVE_SELLER_PRODUCT:
        return {
          ...state,
          liveProduct: action.payload,
        };
    default:
      return state;
  }
};
