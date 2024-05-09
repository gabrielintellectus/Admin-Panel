import { ADMIN_WALLET, GET_REDEEM_REQUEST, REDEEM_ACTION } from "./redeem.type";

const initialState = {
  redeem: [],
  total : 0,
  adminCommision : {}
};

const redeemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REDEEM_REQUEST:
      
      return {
        ...state,
        redeem: action.payload.data,
        total: action.payload.total 
      };
    case REDEEM_ACTION:
      
      return {
      
        ...state,
        redeem: state.redeem.filter((redeem) => redeem._id !== action.payload),
      };
      case ADMIN_WALLET:
      
      return {
        ...state,
        adminCommision: action.payload,
         
      };
    default:
      return state;
  }
};

export default redeemReducer;
