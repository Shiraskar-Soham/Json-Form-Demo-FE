import React from "react";

const LabelChipsSection = ({ labelChips }) => {
  return (
    <div className="card-labelChips">
      <div className="chips-container">
        {Object.keys(labelChips).map((key) => (
          <div key={key} className="chip">
            <strong>{key}:</strong> {labelChips[key]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelChipsSection;
