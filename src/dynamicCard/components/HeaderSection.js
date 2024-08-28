import React from "react";

const HeaderSection = ({ jsonData, handleActionClick }) => {
  const headerValues = Object.values(jsonData?.header)
    .map((value) => (typeof value === "object" ? JSON.stringify(value) : value))
    .join(" | ");

  return (
    <div className="card-header">
      <h3>{headerValues}</h3>
      <div className="approvalButtons">
        <button
          className="rejectButton"
          onClick={() => handleActionClick("REJECT", jsonData.id)}
          hidden={jsonData?.labelChips["Manager Status"] !== "PENDING"}
        >
          Reject
        </button>
        <button
          className="approveButton"
          onClick={() => handleActionClick("APPROVE", jsonData.id)}
          hidden={jsonData?.labelChips["Manager Status"] !== "PENDING"}
        >
          Approve
        </button>
        <button
          className="completeButton"
          onClick={() => handleActionClick("COMPLETE", jsonData.id)}
          hidden={jsonData?.labelChips["Control Tower Status"] !== "PENDING"}
        >
          Mark As Completed
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;
