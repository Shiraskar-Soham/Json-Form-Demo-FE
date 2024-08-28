import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./Api.js";
import "./App.css";

function reject(id, reviewRemarks) {
  ApiService.reject(id, reviewRemarks);
}

function approve(id, reviewRemarks) {
  ApiService.approve(id, reviewRemarks);
}

function towerApproval(id, status, reviewRemarks) {
  ApiService.towerApproval(id, status, reviewRemarks);
}

function DynamicListing({ listingStatus }) {
  const [listingData, setListingData] = useState([]);
  const [cardState, setCardState] = useState({});

  useEffect(() => {
    ApiService.getListing(listingStatus)
      .then((responseData) => {
        setListingData(responseData);
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
      });
  }, [listingStatus]);

  const handleActionClick = (action, id) => {
    setCardState((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        actionType: action,
        showRemarksInput: true,
        isCTFlow: action === "COMPLETE",
        isManagerFlow: action !== "COMPLETE",
      },
    }));
  };

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/newRequest");
  };

  const handleCompleteRemarks = (choice, id, remarks) => {
    if (choice === "APPROVED") {
      towerApproval(id, "APPROVED", remarks);
    } else {
      towerApproval(id, "REJECTED", remarks);
    }
    resetCardState(id);
  };

  const handleSubmitRemarks = (id, remarks) => {
    const actionType = cardState[id]?.actionType;
    switch (actionType) {
      case "REJECT":
        reject(id, remarks);
        break;
      case "APPROVE":
        approve(id, remarks);
        break;
      default:
        break;
    }
    resetCardState(id);
  };

  const resetCardState = (id) => {
    setCardState((prevState) => ({
      ...prevState,
      [id]: {
        showRemarksInput: false,
        remarks: "",
        actionType: "",
        isCTFlow: false,
        isManagerFlow: false,
      },
    }));
  };

  const App = ({ jsonData }) => {
    const card = cardState[jsonData.id] || {};
    if (!jsonData || !jsonData.header) {
      return <div>Loading...</div>;
    }
    return (
      <div className="card">
        <HeaderSection
          jsonData={jsonData}
          handleActionClick={handleActionClick}
        />
        <LabelChipsSection labelChips={jsonData.labelChips} />
        <BodySection body={jsonData.body} />
        <FooterSection
          footer={jsonData.footer}
          card={card}
          handleCompleteRemarks={handleCompleteRemarks}
          handleSubmitRemarks={handleSubmitRemarks}
          resetCardState={resetCardState}
        />
      </div>
    );
  };

  const HeaderSection = ({ jsonData, handleActionClick }) => {
    const headerValues = Object.values(jsonData?.header)
      .map((value) =>
        typeof value === "object" ? JSON.stringify(value) : value,
      )
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

  const BodySection = ({ body }) => {
    return (
      <div className="card-body">
        {Object.keys(body).map((key) => (
          <div key={key}>
            <span className="module-chips">
              <strong>
                {key}
                {": "}
              </strong>
              {typeof body[key] === "object" && body[key] !== null ? (
                <ul>
                  {Object.keys(body[key]).map((subKey) => (
                    <li key={subKey}>
                      {subKey}: {body[key][subKey].join(", ")}
                    </li>
                  ))}
                </ul>
              ) : (
                body[key]
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const FooterSection = ({
    footer,
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

    return (
      <>
        <div className="card-footer">
          {Object.keys(footer).map((key) => (
            <span key={key}>
              <strong>{key}:</strong> {footer[key]}
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
                <button
                  className="approveButton"
                  onClick={() =>
                    handleCompleteRemarks("APPROVED", footer.id, remarks)
                  }
                >
                  Approve
                </button>
              )}
              {card.isCTFlow && !card.isManagerFlow && (
                <button
                  className="completeButton"
                  onClick={() =>
                    handleCompleteRemarks("REJECTED", footer.id, remarks)
                  }
                >
                  Reject
                </button>
              )}
              {card.isManagerFlow && !card.isCTFlow && (
                <button
                  className="completeButton"
                  onClick={() => handleSubmitRemarks(footer.id, remarks)}
                >
                  Submit
                </button>
              )}
              <button
                className="rejectButton"
                onClick={() => resetCardState(footer.id)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="pageHeader">
        <div>Access Request Listing</div>
        <div>
          <button className="newButton" onClick={handleButtonClick}>
            Raise New Request
          </button>
        </div>
        <div className="filterButtons">
          <button className="newButton" onClick={() => navigate("/")}>
            All
          </button>
          <button className="newButton" onClick={() => navigate("/allPending")}>
            Pending
          </button>
          <button
            className="newButton"
            onClick={() => navigate("/allRejected")}
          >
            Rejected
          </button>
          <button
            className="newButton"
            onClick={() => navigate("/allApproved")}
          >
            Approved
          </button>
          <button
            className="newButton"
            onClick={() => navigate("/allCompleted")}
          >
            Completed
          </button>
        </div>
      </div>
      <div className="app-listing">
        {listingData.map((data) => (
          <App jsonData={data} />
        ))}
      </div>
    </>
  );
}

export default DynamicListing;
