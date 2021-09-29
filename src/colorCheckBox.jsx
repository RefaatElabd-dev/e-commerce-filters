import React from "react";

const Color = (props) => {
  return (
    <div className="form-check mb-2">
      <input
        className="form-check-input"
        type="checkbox"
        name="colorList"
        value={props.Name}
        id={props.Name}
        onChange={async (e) => await props.handleChange(e)}
      />
      <label className="form-check-label" htmlFor={props.Name}>
        {props.Name}
      </label>
    </div>
  );
};

export default Color;
