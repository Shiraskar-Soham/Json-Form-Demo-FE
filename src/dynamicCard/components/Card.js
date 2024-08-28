import React, { useState } from "react";
import HeaderSection from "./HeaderSection";
import LabelChipsSection from "./LabelChipsSection";
import BodySection from "./BodySection";
import FooterSection from "./FooterSection";
import ApiService from "../Api.js";
import "../App.css";

const Card = ({ jsonData }) => {
  const [cardState, setCardState] = useState({});

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

  const handleCompleteRemarks = (choice, id, remarks) => {
    if (choice === "APPROVED") {
      ApiService.towerApproval(id, "APPROVED", remarks);
    } else {
      ApiService.towerApproval(id, "REJECTED", remarks);
    }
    resetCardState(id);
  };

  const handleSubmitRemarks = (id, remarks) => {
    const actionType = cardState[id]?.actionType;
    switch (actionType) {
      case "REJECT":
        ApiService.reject(id, remarks);
        break;
      case "APPROVE":
        ApiService.approve(id, remarks);
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
        jsonData={jsonData}
        card={card}
        handleCompleteRemarks={handleCompleteRemarks}
        handleSubmitRemarks={handleSubmitRemarks}
        resetCardState={resetCardState}
      />
    </div>
  );
};

export default Card;
