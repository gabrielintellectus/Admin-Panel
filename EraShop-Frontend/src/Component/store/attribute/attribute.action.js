import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./attribute.type";
import { apiInstanceFetch } from "../../util/api";
// get attributes
export const getAttribute = () => (dispatch) => {
  apiInstanceFetch
    .get(`attributes`)
    .then((res) => {
      dispatch({ type: ActionType.GET_ATTRIBUTE, payload: res.attributes });
    })
    .catch((error) => console.log(error.message));
};

// get attribute type wise
export const getAttributeType = (type) => (dispatch) => {
  apiInstanceFetch
    .get(`attributes/typeWise?type=${type}`)
    .then((res) => {
      dispatch({
        type: ActionType.GET_TYPE_ATTRIBUTE,
        payload: res.attributes,
      });
    })
    .catch((error) => console.log(error.message));
};

// create attributes

export const createAttribute = (data) => (dispatch) => {
  axios
    .post(`attributes/create`, data)
    .then((res) => {
      if (res.data.status) {
        
        dispatch({
          type: ActionType.CREATE_ATTRIBUTE,
          payload: res.data.attributes,
        });
        setToast("success", "attributes created successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// edit attributes

export const updateAttribute = (id, data) => (dispatch) => {
  apiInstanceFetch
    .patch(`attributes/update?attributesId=${id}`, data)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.UPDATE_ATTRIBUTE,
          payload: { data: res.attributes, id },
        });
        setToast("success", "attributes update successfully");
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// delete attributes

export const deleteAttribute = (data) => (dispatch) => {
  apiInstanceFetch
    .delete(`attributes/delete?attributesId=${data}`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.DELETE_ATTRIBUTE,
          payload: data,
        });
        setToast("success", "attributes Delete successfully");
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => console.log(error.message));
};
