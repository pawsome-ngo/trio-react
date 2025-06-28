// src/components/IncidentDetailsExpanded.jsx
import React from 'react';
import '../App.css'; // Ensure App.css styles are available

const IncidentDetailsExpanded = ({ incident, incidentStatuses, handleStatusChange, handleDeleteIncident }) => {

    return (
        <tr className="incident-details-row">
            <td colSpan="4"> {/* Span all columns of the main table */}
                <div className="incident-details-content">
                    <p><strong>Reporter Name:</strong> {incident.reporterName}</p>
                    <p><strong>Phone Number:</strong> {incident.phoneNumber}</p>
                    <p><strong>Coordinates:</strong>{' '}
                        {incident.latitude !== null && incident.longitude !== null
                            ? `${incident.latitude}, ${incident.longitude}`
                            : 'N/A'}
                    </p>
                    <p><strong>Description:</strong> {incident.description}</p>
                    <p><strong>Current Status:</strong>{' '}
                        <span className={`incident-status ${incident.status.toLowerCase().replace(/\s/g, '-')}`}>
              {incident.status}
            </span>
                    </p>
                    <p><strong>Full Timestamp:</strong> {new Date(incident.reportTimestamp).toLocaleString()}</p>

                    <div className="status-update-section">
                        <strong>Update Status:</strong>
                        <select
                            value={incident.status}
                            onChange={(e) => handleStatusChange(incident.id, e.target.value)}
                            className="status-dropdown"
                        >
                            {/* incidentStatuses from props */}
                            {incidentStatuses.slice(1).map(status => ( // Exclude "All" from update dropdown
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="incident-image-section">
                        <strong>Image:</strong>{' '}
                        {incident.imagePath ? (
                            <a
                                href={`http://localhost:8080/images/${incident.imagePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={`http://localhost:8080/images/${incident.imagePath}`}
                                    alt="Incident"
                                    className="incident-image-full"
                                />
                            </a>
                        ) : (
                            'No Image'
                        )}
                    </div>

                    {/* Delete Button */}
                    <div className="delete-section">
                        <button
                            onClick={() => handleDeleteIncident(incident.id)}
                            className="delete-incident-button"
                        >
                            Delete Incident
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default IncidentDetailsExpanded;