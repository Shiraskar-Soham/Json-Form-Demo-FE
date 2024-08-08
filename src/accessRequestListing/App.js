import React, { useEffect, useState } from 'react'
import ApiService from './Api';
import './App.css'

const AccessRequestCard = ({ id, employeeName, subDepartment, companyName, emailId, approvingManagerName,
  approvalStatus, controlTowerStatus, dateCreated, dateApproved, dateCompleted, modules,
  employeeCompany, requestRemarks, approveRemarks, reviewRemarks
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{employeeName || "Employee Name"}</h2>
        <p>{subDepartment} - {companyName}</p>
      </div>
      <div className="card-content">
        <p><strong>Email:</strong> {emailId}</p>
        <p><strong>Approving Manager:</strong> {approvingManagerName || "N/A"}</p>
        <p><strong>Approval Status:</strong> {approvalStatus}</p>
        <p><strong>Control Tower Status:</strong> {controlTowerStatus}</p>
        <p><strong>Date Created:</strong> {new Date(dateCreated).toLocaleDateString()}</p>
        {/* <p><strong>Modules:</strong> {Object.keys(modules).join(', ')}</p> */}
        <p><strong>Employee Company:</strong> {employeeCompany}</p>
        <p><strong>Request Remarks:</strong> {requestRemarks || "None"}</p>
        <p><strong>Approve Remarks:</strong> {approveRemarks || "None"}</p>
        <p><strong>Review Remarks:</strong> {reviewRemarks || "None"}</p>
      </div>
    </div>
  );
};

function App() {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    ApiService.getListing()
      .then((responseData) => {
        setListData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching access request list:', error);
      });
  }, []);

  return (
    <div>
      {listData.map(item => (
        <AccessRequestCard accessRequestData={item} />
      ))}
    </div>
  );
}
export default App;