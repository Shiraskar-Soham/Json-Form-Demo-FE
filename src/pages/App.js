import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccessRequestForm from "../accessRequestForm/App";
import AccessRequestCompleted from "./AccessRequestCompleted";
import AccessRequestPending from "./AccessRequestPending";
import AccessRequestRejected from "./AccessRequestRejected";
import AccessRequestApproved from "./AccessRequestApproved";
import DynamicListing from "../dynamicCard/App";
import NotFound from "../NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DynamicListing listingStatus="ALL" />} />
        <Route path="/allApproved" element={<AccessRequestApproved />} />
        <Route path="/allRejected" element={<AccessRequestRejected />} />
        <Route path="/allCompleted" element={<AccessRequestCompleted />} />
        <Route path="/allPending" element={<AccessRequestPending />} />
        <Route path="/newRequest" element={<AccessRequestForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
