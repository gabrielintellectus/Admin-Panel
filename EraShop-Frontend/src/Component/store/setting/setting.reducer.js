import { key } from "../../util/config";
import { SetDevKey, setToken } from "../../util/setAuth";
import * as ActionType from "./setting.type";
import jwt_decode from "jwt-decode";

const initialState = {
  setting: [],
};

export const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_SETTING:
      return {
        ...state,
        setting: action.payload,
      };
    case ActionType.UPDATE_SETTING:
      return {
        ...state,
       
      };
    //Handle Update Switch Value
    case ActionType.HANDLE_TOGGLE_SWITCH:
      
      return {
        ...state,
        setting: action.payload.setting,
      };
    default:
      return state;
  }
};
