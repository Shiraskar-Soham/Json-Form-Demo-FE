import React, { useState, useRef, useEffect } from "react";

const FooterSection = ({
  jsonData,
  card,
  handleCompleteRemarks,
  handleSubmitRemarks,
  resetCardState,
}) => {
  const [remarks, setRemarks] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && remarks !== "") {
      textareaRef.current.focus();
    }
  }, [remarks]);

  const handleInputChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleCancel = () => {
    resetCardState(jsonData.id);
  };

  return (
    <>
      <div className="card-footer">
        {Object.keys(jsonData.footer).map((key) => (
          <span key={key}>
            <strong>{key}:</strong> {jsonData.footer[key]}
            {"   "}{" "}
          </span>
        ))}
      </div>
      {card.showRemarksInput && (
        <div className="remarks-input">
          <textarea
            className="remarks-text"
            ref={textareaRef}
            value={remarks}
            onChange={handleInputChange}
            placeholder="Enter your remarks here"
          />
          <div className="approvalButtons">
            {card.isCTFlow && !card.isManagerFlow && (
              <>
                <button
                  className="approveButton"
                  onClick={() =>
                    handleCompleteRemarks("APPROVED", jsonData.id, remarks)
                  }
                >
                  Approve
                </button>
                <button
                  className="completeButton"
                  onClick={() =>
                    handleCompleteRemarks("REJECTED", jsonData.id, remarks)
                  }
                >
                  Reject
                </button>
              </>
            )}
            {card.isManagerFlow && !card.isCTFlow && (
              <button
                className="completeButton"
                onClick={() => handleSubmitRemarks(jsonData.id, remarks)}
              >
                Submit
              </button>
            )}
            <button className="rejectButton" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterSection;
