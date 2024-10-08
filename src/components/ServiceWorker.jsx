import React, { useState, useEffect, useContext } from "react";
import '/src/styles/ServiceWorker.css';
import { AuthContext } from '../context/AuthContext';
import user from '/user.avif';

function ServiceWorker() {

  const [upcomingWork, setUpcomingWork] = useState([]);
  const { name,id } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; 
      const response = await fetch(`http://localhost:5000/api/upcoming-work?userId=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        setUpcomingWork(data);
        console.log("fetched successfully");
      } else {
        console.error("Failed to fetch data");
      }
    }
    fetchData();
  }, []);

  const handleStatusChange = async (workId, newStatus) => {
     
     try {
       const response = await fetch(`http://localhost:5000/api/work-status`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ workId, status: newStatus }),
       });

       if (response.ok) {
         setUpcomingWork((prevWork) =>
           prevWork.map((work) =>
             work._id === workId ? { ...work, status: newStatus } : work
           )
         );
       } else {
         console.error("Failed to update status");
       }
     } catch (error) {
       console.error("Error updating status:", error);
     }
  };
  
  const acceptedCount = upcomingWork.filter(
    (work) => work.status === "accepted"
  ).length;
  const rejectedCount = upcomingWork.filter(
    (work) => work.status === "rejected"
  ).length;


  return (
    <div className="page-container">
      <div className="worker-details-section">
        <div className="worker-info">
          <div className="worker-image">
            <img src={user} alt="Worker" />
          </div>
          <div className="worker-name">
            <h1>
              <strong>{name}</strong>
            </h1>
          </div>
          <div className="worker-stats">
            <div className="stat-item">
              <h2>
                Total: <span>{upcomingWork.length}</span>
              </h2>
            </div>
            <div className="stat-item">
              <h2>
                Accepted: <span>{acceptedCount}</span>
              </h2>
            </div>
            <div className="stat-item">
              <h2>
                Rejected: <span>{rejectedCount}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="upcoming-work-section">
        {upcomingWork.length > 0 ? (
          upcomingWork.map((work, index) => (
            <div className="work-item" key={index}>
              <div className="work-image">
                <img src={`../../server/public${work.photo}`} alt="Work" />
              </div>
              <div className="work-details">
                <div className="work-header">
                  <h3 className="work-owner">{work.name}</h3>
                  <h3 className="work-location">{work.address}</h3>
                </div>
                <div className="work-description">
                  <h5>Description:</h5>
                  <p>{work.description}</p>
                </div>
                <div className="work-category">
                  <h5>{work.fieldType}</h5>
                  <div className="work-actions">
                    {work.status === "pending" && (
                      <>
                        <button
                          className="btn-accept"
                          onClick={() =>
                            handleStatusChange(work._id, "accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() =>
                            handleStatusChange(work._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {work.status === "rejected" && (
                      <button className="btn-reject">Rejected</button>
                    )}
                    {work.status === "accepted" && (
                      <button className="btn-accept">Accepted</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-work-message">No upcoming work available.</p>
        )}
      </div>
    </div>
  );
}

export default ServiceWorker