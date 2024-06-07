import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import {
  CLOSE_DIALOGUE,
  OPEN_DIALOGUE,
} from "../../store/dialogue/dialogue.type";
import { connect, useDispatch, useSelector } from "react-redux";
import { orderUpdate } from "../../store/order/order.action";
import Input from "../../extra/Input";


const EditOrder = (props) => {
  const { dialogueData } = useSelector((state) => state.dialogue);
  

  const dispatch = useDispatch();

  console.log("dialogueData>>>>>>>>>>>>>>>>>>>>>  ", dialogueData);

  const [mongoId, setMongoId] = useState();

  const [status, setStatus] = useState();
  const [deliveredServiceName, setDeliveredServiceName] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [error, setError] = useState({
    deliveredServiceName: "",
    imagetrackingId: "",
    trackingLink: "",
  });

  useEffect(() => {
    setMongoId(dialogueData?.data?._id);
    setDeliveredServiceName(dialogueData?.data?.deliveredServiceName);
    setTrackingId(dialogueData?.data?.trackingId);
    setTrackingLink(dialogueData?.data?.trackingLink);
    setStatus(props.statusData);
    console.log("statusestatuse", props.statusData);
  }, []);

  var userId = dialogueData?.state
    ? dialogueData?.state?.userId?._id
    : dialogueData?.mapData?.userId?._id;

  var orderId = dialogueData?.state
    ? dialogueData?.state?._id
    : dialogueData?.mapData?._id;
  var itemId = dialogueData?.row
    ? dialogueData?.row?._id
    : dialogueData?.data?._id;

  const handleSubmit = (e) => {
    if (status === "Out Of Delivery") {
      if (!deliveredServiceName || !trackingId || !trackingLink) {
        if (!deliveredServiceName)
          error.deliveredServiceName = "Delivered Service Name is Required !";
        if (!trackingId) error.trackingId = "Tracking Id is Required !";
        if (!trackingLink) error.trackingLink = "Tracking Link is Required !";
        return setError({ ...error });
      } else {
        
        
        const data = {
          deliveredServiceName,
          trackingId,
          trackingLink,
        };
        props.orderUpdate(userId, orderId, status, itemId, data);
        dispatch({ type: CLOSE_DIALOGUE });
      }
    } else {
      
      
      props.orderUpdate(userId, orderId, status, itemId);
      dispatch({ type: CLOSE_DIALOGUE });
    }
  };

  useEffect(() => {
    console.log("statusestatuse", status);
  }, [status]);

  return (
    <div>
      <div className="mainDialogue fade-in">
        <div className="Dialogue" style={{ width: "" }}>
          <div className="dialogueHeader">
            <div className="headerTitle fw-bold">Edit Order</div>
            <div
              className="closeBtn "
              onClick={() => {
                dispatch({ type: CLOSE_DIALOGUE });
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
          <div className="dialogueMain">
            <div className="text-start">
              <label className="styleForTitle my-2   text-dark">
                Edit Order
              </label>
              <select
                name="type"
                className="form-control form-control-line"
                id="type"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      status: "Status is Required !",
                    });
                  } else {
                    return setError({
                      ...error,
                      status: "",
                    });
                  }
                }}
              >
                <option value="" disabled defaultValue>
                  --select status--
                </option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Confirmed">Confirmed</option>
                <option
                  value="Out Of Delivery"
                
                >
                  Out Of Delivery
                </option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            {status === "Out Of Delivery" && (
              <div className="row mt-2">
                <div className="col-6">
                  <Input
                    label={`Delivered Service Name `}
                    id={`deliveredServiceName `}
                    type={`text`}
                    value={deliveredServiceName}
                    errorMessage={
                      error.deliveredServiceName && error.deliveredServiceName
                    }
                    onChange={(e) => {
                      setDeliveredServiceName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          deliveredServiceName: `Delivered Service Name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          deliveredServiceName: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-6">
                  <Input
                    label={`Tracking Id`}
                    id={`trackingId`}
                    type={`text`}
                    value={trackingId}
                    errorMessage={error.trackingId && error.trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          trackingId: `Tracking Id Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          trackingId: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-6">
                  <Input
                    label={`Tracking Link`}
                    id={`trackingLink`}
                    type={`text`}
                    value={trackingLink}
                    errorMessage={error.trackingLink && error.trackingLink}
                    onChange={(e) => {
                      setTrackingLink(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          trackingLink: `Tracking Link Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          trackingLink: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="dialogueFooter">
            <Button
              btnName={`Update`}
              btnColor={`btnBlackPrime text-white ms-2`}
              style={{ borderRadius: "5px", width: "80px" }}
              onClick={(e) => handleSubmit(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { orderUpdate })(EditOrder);
