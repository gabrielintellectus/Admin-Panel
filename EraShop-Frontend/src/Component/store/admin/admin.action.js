import axios from "axios";
import * as ActionType from "./admin.type";
import { Navigate, useNavigate } from "react-router-dom";
import { setToast } from "../../util/toast";
import { apiInstanceFetch } from "../../util/api";


export const signupAdmin = (signup) => (dispatch) => {
  console.log("createAdmin", signup);
  axios
    .post("admin/create", signup)
    .then((res) => {
      console.log(res);
      if (res.data.status) {
        dispatch({ type: ActionType.SIGNUP_ADMIN });
        setToast("success", "Signup Successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast("error", error);
      console.log(error);
    });
};

export const updateCode = (signup) => (dispatch) => {
  console.log("updateCode", signup);
  axios
    .patch("admin/updateCode", signup)
    .then((res) => {
      console.log(res);
      if (res.data.status) {
        setToast("success", "Purchase Code Update Successfully !");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast("error", error);
      console.log(error);
    });
};

export const loginAdmin = (login) => (dispatch) => {
  
  axios
    .post("admin/login", login)
    .then((res) => {
      console.log(res);
      if (res.data.status) {
        dispatch({ type: ActionType.LOGIN_ADMIN, payload: res.data.token });

        setToast("success", "Login Successfully!");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast("error", error);
      console.log(error);
    });
    
};
// get profile
export const getProfile = () => (dispatch) => {
  apiInstanceFetch
    .get("admin/profile")
    .then((res) => {
      dispatch({ type: ActionType.PROFILE_ADMIN, payload: res.admin });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// Update Admin profile image

export const updateImage = (formData) => (dispatch) => {
  axios
    .patch("admin/updateImage", formData)
    .then((res) => {
      
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_IMAGE_PROFILE,
          payload: res.data.admin,
        });
        setToast("success", "Image Update Successfully");
      }
    })
    .catch((error) => {
      setToast("error", error);
    });
};


export const updateProfile = (profileData) => (dispatch) => {
  axios
    .patch("admin/updateProfile", profileData)
    .then((res) => {
      
      if (res.data.status === true) {
        dispatch({ type: ActionType.UPDATE_PROFILE, payload: res.data.admin });
        setToast("success", "Profile Update Successfully");
      }else{
        setToast(res.data.message);
      }
    })
    .catch(({ response }) => {
      console.log(response?.data);
    });
};


export const ChangePassword = (password) => (dispatch) => {
  
  axios
    .patch("admin/updatePassword", password)
    .then((res) => {
      if (res.data.status === true) {
        setToast("success", "Your Password Changed Successfully !");
        dispatch({ type: ActionType.LOGOUT_ADMIN });
        setTimeout(() => {
          window.location.href = "/";
        }, [3000]);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      setToast(error.message);
    });
};
