import axios from "axios";
import { setToast } from "../../util/toast";
import { GET_REDEEM_REQUEST, REDEEM_ACTION, ADMIN_WALLET } from "./redeem.type";
import { apiInstanceFetch } from "../../util/api";

//get reels
export const getRedeem = (type) => (dispatch) => {
  apiInstanceFetch
    .get(`sellerWallet/sellerPendingWithdrawalRequestedAmountForAdmin`)
    .then((res) => {
      dispatch({
        type: GET_REDEEM_REQUEST,
        
        payload: {
          data: res.sellerPendingWithdrawalRequestedAmount,
          total: res.totalsellerPendingWithdrawalRequestedAmount,
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//action for redeem request
export const action = (redeemId) => (dispatch) => {
  axios
    .post(`sellerWallet/byAdminToSeller?sellerWalletId=${redeemId}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: REDEEM_ACTION, payload: redeemId });

        setToast(
          "success",
          "Seller Withdrawal Requested Amount Pay Successfully"
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getAdminWallet = () => (dispatch) => {
  
  apiInstanceFetch
    .get("sellerWallet/adminCommissionWallet")
    .then((res) => {
      
      dispatch({ type: ADMIN_WALLET, payload: res.data });
    })
    .catch((error) => {
      console.log("error", error);
    });
};
