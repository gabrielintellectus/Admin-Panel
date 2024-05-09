import { key } from "../../util/config";
import { SetDevKey, setToken } from "../../util/setAuth";
import * as ActionType from "./admin.type";
import jwt_decode from "jwt-decode";

const initialState = {
  admin: {},
  isAuth: false,
};

export const adminReducer = (state = initialState, action) => {
  let decode;
  switch (action.type) {
    case ActionType.LOGIN_ADMIN:
      if (action.payload) {
        decode = jwt_decode(action.payload);
      }
      // Set Token And Key In Axios
      setToken(action.payload);
      SetDevKey(key);
      
      // Set Token And Key In Session
      sessionStorage.setItem("token", action.payload);
      sessionStorage.setItem("key", key);
      sessionStorage.setItem("isAuth", true);
      return {
        ...state,
        admin: decode,
        isAuth: true,
      };
    case ActionType.LOGOUT_ADMIN:
      window.localStorage.clear();
      window.sessionStorage.clear();
      setToken(null);
      SetDevKey(null);
      return {
        ...state,       
        admin: {},
        isAuth: false,
      };
    case ActionType.PROFILE_ADMIN:
      
      return {
        ...state,

        admin: {
          name: action.payload.name,
          email: action.payload.email,
          image: action.payload.image,
          role: action.payload.role,
          fcm_token: action.payload.fcm_token,
          flag: action.payload.flag
        },
      };
    case ActionType.UPDATE_IMAGE_PROFILE:
      return {
        ...state,
        admin: {
          name: action.payload.name,
          image: action.payload.image,
        },
      };
    case ActionType.UPDATE_PROFILE:
      return {
        ...state,
        admin: action.payload,
        flag: action.payload.flag
      };
    default:
      return state;
  }
};
