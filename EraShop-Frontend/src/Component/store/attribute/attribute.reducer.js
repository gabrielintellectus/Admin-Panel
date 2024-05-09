import * as ActionType from "./attribute.type";
const initialState = {
  attribute: [],
  
};
export const attributeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_ATTRIBUTE:
      return {
        ...state,
        attribute: action.payload,
      };
    case ActionType.GET_TYPE_ATTRIBUTE:
      return {
        ...state,
        attributeType: action.payload,
      };
   
    case ActionType.CREATE_ATTRIBUTE:
      
      let data = [...state.attribute];
      data.unshift(action.payload);
      return {
        ...state,
        attribute: data,
      };
    case ActionType.UPDATE_ATTRIBUTE:
      return {
        ...state,
        attribute: state.attribute.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_ATTRIBUTE:
      return {
        ...state,
        attribute: state.attribute.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    default:
      return state;
  }
};
