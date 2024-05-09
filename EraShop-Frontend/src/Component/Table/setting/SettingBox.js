import React from "react";
import Button from "../../extra/Button";
import ToggleSwitch from "../../extra/ToggleSwitch";

const SettingBox = (props) => {
  const { submit, title, toggleSwitch } = props;

  return (
    <>
      <div className="col-xl-6 col-12 mt-4">
        <div className="settingBox">
          <div className="settingBoxHeader boxBetween">
            <div className="mainTitle">{title}</div>
            {toggleSwitch && (
              <div className="titleBtn boxBetween">
                <span className="me-3 fw-bold">{toggleSwitch.switchName}</span>
                <span>
                  <ToggleSwitch
                    value={toggleSwitch.switchValue}
                    onClick={toggleSwitch.handleClick}
                  />
                </span>
              </div>
            )}
          </div>
          <div className="settingInnerBox">
            <div className="row">{props.children}</div>
          </div>
          <div className="settingFooter text-end">
          
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingBox;
