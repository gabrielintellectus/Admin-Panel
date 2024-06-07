import React from "react";

const ToggleSwitch = (props) => {
  return (
    <>
      <label className="switch">
        <input
          type="checkbox"
          defaultChecked={props.value}
          onClick={props.onClick}
          className="checkbox"
          disabled={props.disabled}
        />
        <div className="slider"></div>
      </label>

    
    </>
  );
};

export default ToggleSwitch;
