import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./Api.js";
import Card from "./components/Card.js";
import "./App.css";

function DynamicListing({ listingStatus }) {
  const [listingData, setListingData] = useState([]);

  useEffect(() => {
    ApiService.getListing(listingStatus)
      .then((responseData) => setListingData(responseData))
      .catch((error) => console.error("Error in useEffect:", error));
  }, [listingStatus]);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/newRequest");
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
          <Card key={data.id} jsonData={data} />
        ))}
      </div>
    </>
  );
}

export default DynamicListing;
