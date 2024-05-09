import axios from "axios";
import * as ActionType from "./sellerRequest.type";
import { Navigate, useNavigate } from "react-router-dom";
import { setToast } from "../../util/toast";
import { apiInstanceFetch } from "../../util/api";

export const getSellerRequest = () => (dispatch) => {
  apiInstanceFetch
    .get(`request`)
    .then((res) => {
     
      dispatch({
        type: ActionType.GET_SELLER_REQUEST,
        payload: res.request,
      });
    })
    .catch((error) => console.error(error));
};

export const acceptSellerRequest = (id) => (dispatch) => {
  axios
    .patch(`request/acceptOrNot?requestId=${id}`)
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        dispatch({ type: ActionType.ACCEPT_SELLER_REQUEST, payload: id });
        setToast("success", res.data.message);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => setToast("error", error));
};
// Seller request update
export const sellerRequestUpdate = (formData,id) => (dispatch) => {
  
  console.log(id,"::::::id");
  axios
    .patch(`request/update?requestId=${id}`, formData)
    .then((res) => {
      
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_SELLER_REQUEST,
          payload: { updateRequest: res.data.request, id },
        });
        setToast("success", "Seller Request Update Successfully!");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => setToast("error", error));
};
