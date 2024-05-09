import * as ActionType from "./fakeSeller.type";

const initialState = {
  fakeSeller: [],
  totalSellers: 0,
};

export const fakeSellerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_FAKE_SELLER:
      return {
        ...state,
        fakeSeller: action.payload,
        totalSellers: action.totalSellers,
      };
    case ActionType.GET_FAKE_SELLER_NAME:
      return {
        ...state,
        fakeSeller: action.payload,
        
      };

    case ActionType.CREATE_FAKE_SELLER:
      let data = [...state.fakeSeller];
      console.log(action.payload);
      data.unshift(action.payload);

      return {
        ...state,
        fakeSeller: data,
      };
    case ActionType.UPDATE_FAKE_SELLER:
      return {
        ...state,
        fakeSeller: state.fakeSeller.map((data) =>
          data._id === action.payload.updateSeller._id
            ? action.payload.updateSeller
            : data
        ),
      };
    case ActionType.DELETE_FAKE_SELLER:
      return {
        ...state,
        fakeSeller: state.fakeSeller.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    case ActionType.ISLIVE_FAKE_SELLER:
      console.log(action.payload, ":::SELLER");

      
      return {
        ...state,
        fakeSeller: state.fakeSeller.map((sellerLive) => {
          if (sellerLive._id === action.payload.id) return action.payload.data;
          else return sellerLive;
        }),
      };
    default:
      return state;
  }
};
