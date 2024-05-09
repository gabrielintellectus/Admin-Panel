import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Input from "../../extra/Input";

import {
  createPromoCode,
  updatePromoCode,
} from "../../store/PromoCode/promoCode.action";
import { Typography } from "@material-ui/core";

const PromoDialog = (props) => {
  const { dialogueData } = useSelector((state) => state.dialogue);
  

  const [mongoId, setMongoId] = useState(0);
  const [promoCode, setPromoCode] = useState();
  const [minOrderValue, setMinOrderValue] = useState("");
  const [discountAmount, setDiscountAmount] = useState();
  const [conditions, setConditions] = useState("");
  const [discountType, setDiscountType] = useState();
  const [error, setError] = useState({
    discountAmount: "",
    conditions: "",
    promoCode: "",
    discountType: "",
    minOrderValue: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setMongoId(dialogueData?._id);
    setConditions(dialogueData?.conditions);
    setPromoCode(dialogueData?.promoCode);
    setMinOrderValue(dialogueData?.minOrderValue);
    setDiscountAmount(dialogueData?.discountAmount);
    setDiscountType(dialogueData?.discountType);
  }, [dialogueData]);

  const handleSubmit = (e) => {
    

    if (
      !promoCode ||
      !discountAmount ||
      discountAmount <= 0 ||
      !minOrderValue ||
      minOrderValue <= 0 ||
      !conditions
    ) {
      let error = {};
      if (!promoCode) error.promoCode = "PromoCode is Required !";
      if (!conditions) error.conditions = "Conditions is required!";
      if (!minOrderValue) error.minOrderValue = "Min Order Value is required!";
      if (minOrderValue <= 0)
        error.minOrderValue = "Enter Correct Min Order Value !";
      if (!discountAmount)
        error.discountAmount = "Discount Amount is required!";
      if (discountAmount <= 0)
        error.discountAmount = "Enter Correct Discount Amount!";
      if (!discountType) error.discountType = "Discount Type is Required";

      return setError({ ...error });
    } else {
      
      const data = {
        promoCode,
        conditions,
        discountAmount,
        discountType,
        minOrderValue,
      };

      if (mongoId) {
        props.updatePromoCode(data, mongoId);
        console.log("mongoId", mongoId);
      } else {
        props.createPromoCode(data);
      }
      dispatch({ type: CLOSE_DIALOGUE });
    }
  };
  return (
    <div className="mainDialogue fade-in">
      <div className="Dialogue">
        <div className="dialogueHeader">
          <div className="headerTitle fw-bold">PromoCode</div>
          <div
            className="closeBtn "
            onClick={() => {
              dispatch({ type: CLOSE_DIALOGUE });
            }}
          >
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="dialogueMain">
          <div className="row">
            <div className="col-12">
              <Input
                label={`PromoCode`}
                id={`promoCode`}
                type={`text`}
                value={promoCode}
                errorMessage={error.promoCode && error.promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      promoCode: `PromoCode Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      promoCode: "",
                    });
                  }
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <label className="styleForTitle mb-2 text-dark">
                Discount Type
              </label>
              <select
                name="type"
                className="form-control form-control-line"
                id="type"
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      discountType: "Discount Type is Required !",
                    });
                  } else {
                    return setError({
                      ...error,
                      discountType: "",
                    });
                  }
                }}
              >
                <option value="" disabled selected>
                  --select--
                </option>
                <option value="0">Flat</option>
                <option value="1">Percentage</option>
              </select>
              {error.discountType && (
                <div className="pl-1 text-left">
                  <p className="errorMessage">{error.discountType}</p>
                </div>
              )}
            </div>
            <div className="col-6">
              <Input
                label={`Min Order Value`}
                id={`minOrderValue`}
                type={`number`}
                value={minOrderValue}
                errorMessage={error.minOrderValue && error.minOrderValue}
                onChange={(e) => {
                  setMinOrderValue(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      minOrderValue: `Discount Amount Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      minOrderValue: "",
                    });
                  }
                }}
              />
            </div>
            <div className="col-6">
              <Input
                label={`Discount Amount`}
                id={`discountAmount`}
                type={`number`}
                value={discountAmount}
                errorMessage={error.discountAmount && error.discountAmount}
                onChange={(e) => {
                  setDiscountAmount(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      discountAmount: `Discount Amount Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      discountAmount: "",
                    });
                  }
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 my-2">
              <label className="float-left styleForTitle text-dark">
                Conditions
              </label>
              <textarea
                class="form-control"
                placeholder="Conditions..."
                id="exampleFormControlTextarea1"
                rows="5"
                value={conditions}
                onChange={(e) => {
                  setConditions(e.target.value);

                  if (!e.target.value) {
                    return setError({
                      ...error,
                      conditions: "Conditions is Required!",
                    });
                  } else {
                    return setError({
                      ...error,
                      conditions: "",
                    });
                  }
                }}
              ></textarea>

              <div className="pl-1 text-left mt-2">
                <p className="">
                  {" "}
                  <b>Note :</b> You can add multiple conditions separate by
                  comma (,)
                </p>
              </div>

              {error.conditions && (
                <div className="pl-1 text-left">
                  <p className="errorMessage">{error.conditions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="dialogueFooter">
          <div className="dialogueBtn">
            <Button
              btnName={`Submit`}
              btnColor={`btnBlackPrime text-white`}
              style={{ borderRadius: "5px", width: "80px" }}
              newClass={`me-2`}
              onClick={handleSubmit}
            />
            <Button
              btnName={`Close`}
              btnColor={`bg-danger text-white`}
              style={{ borderRadius: "5px", width: "80px" }}
              onClick={() => {
                dispatch({ type: CLOSE_DIALOGUE });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { createPromoCode, updatePromoCode })(PromoDialog);
