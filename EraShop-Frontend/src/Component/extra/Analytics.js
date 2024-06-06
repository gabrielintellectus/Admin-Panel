import dayjs from "dayjs";
import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";

const Analytics = (props) => {
  const {
    analyticsStartDate,
    analyticsStartEnd,
    setAnalyticsStartDate,
    setAnalyticsEndDate,
    title,
  } = props;

  //Apply button function for analytic
  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");
    const end = dayjs(picker.endDate).format("YYYY-MM-DD");
    setAnalyticsStartDate(start);
    setAnalyticsEndDate(end);
  };
  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker?.element.val("");
    setAnalyticsStartDate("ALL");
    setAnalyticsEndDate("ALL");
  };


  return (
    <>
      <div className="d-flex m-2 align-items-center analytic-box">
        <DateRangePicker
          initialSettings={{
            autoUpdateInput: false,
            locale: {
              cancelLabel: "Clear",
            },
            maxDate: new Date(),
            buttonClasses: ["btn btn-dark"],
          }}
          onApply={handleApply}
          onCancel={handleCancel}
        >
          <input
            type="text"
            readOnly
            className="daterange form-control float-left  mr-4 "
            value="Select Date"
            style={{
              width: "120px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          />
        </DateRangePicker>
        {analyticsStartDate === "ALL" || analyticsStartEnd === "ALL" ? (
          <div className="ms-3 fs-5  fw-bold title-name">{title}</div>
        ) : (
          <div
            className="dateShow mt-2 ms-3 fw-bold"
            style={{ fontSize: "15px" }}
          >
            <span className=" start-date">{analyticsStartDate}</span>
            <span className="mx-2 to-date"> To </span>
            <span className="end-date">{analyticsStartEnd}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;
