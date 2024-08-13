import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccessRequestForm from './accessRequestForm/App';
import AccessRequestListing from './accessRequestListing/App';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccessRequestListing />} />
        <Route path="/newRequest" element={<AccessRequestForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
