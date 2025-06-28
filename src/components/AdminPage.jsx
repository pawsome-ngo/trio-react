// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import '../App.css';
import IncidentDetailsExpanded from './IncidentDetailsExpanded'; // Import the new component

const AdminPage = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);
    const [updateStatusMessage, setUpdateStatusMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const incidentStatuses = [
        'All',
        'Pending',
        'Acknowledged',
        'Team Assigned',
        'Completed',
        'Canceled',
        'Not Found',
    ];

    const fetchIncidents = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = filterStatus && filterStatus !== 'All'
                ? `http://localhost:8080/api/incidents?status=${filterStatus}`
                : 'http://localhost:8080/api/incidents';

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => b.id - a.id);
            setIncidents(sortedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, [filterStatus]);

    const toggleDetails = (id) => {
        setSelectedIncidentId(selectedIncidentId === id ? null : id);
    };

    // Keep these functions in AdminPage as they manage the `incidents` state
    const handleStatusChange = async (incidentId, newStatus) => {
        setUpdateStatusMessage(`Updating status for ID ${incidentId} to ${newStatus}...`);
        try {
            const response = await fetch(`http://localhost:8080/api/incidents/${incidentId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const responseText = await response.text();
                setUpdateStatusMessage(`Status updated successfully: ${responseText}`);
                setIncidents(prevIncidents =>
                    prevIncidents.map(inc =>
                        inc.id === incidentId ? { ...inc, status: newStatus } : inc
                    )
                );
            } else {
                const errorText = await response.text();
                setUpdateStatusMessage(`Failed to update status for ID ${incidentId}: ${errorText}`);
                console.error('Status update error:', response.status, errorText);
            }
        } catch (err) {
            setUpdateStatusMessage(`Network error updating status: ${err.message}`);
            console.error('Network error updating status:', err);
        } finally {
            setTimeout(() => setUpdateStatusMessage(''), 5000);
        }
    };

    const handleDeleteIncident = async (incidentId) => {
        if (window.confirm(`Are you sure you want to delete incident ID ${incidentId}? This action cannot be undone.`)) {
            setUpdateStatusMessage(`Deleting incident ID ${incidentId}...`);
            try {
                const response = await fetch(`http://localhost:8080/api/incidents/${incidentId}`, {
                    method: 'DELETE',
                });

                if (response.status === 204) {
                    setUpdateStatusMessage(`Incident ID ${incidentId} deleted successfully.`);
                    setIncidents(prevIncidents => prevIncidents.filter(inc => inc.id !== incidentId));
                    setSelectedIncidentId(null);
                } else {
                    const errorText = await response.text();
                    setUpdateStatusMessage(`Failed to delete incident ID ${incidentId}: ${errorText}`);
                    console.error('Deletion error:', response.status, errorText);
                }
            } catch (err) {
                setUpdateStatusMessage(`Network error deleting incident: ${err.message}`);
                console.error('Network error deleting incident:', err);
            } finally {
                setTimeout(() => setUpdateStatusMessage(''), 5000);
            }
        }
    };

    // Helper function moved here or kept in AdminPage as it's used globally
    const formatSimpleTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const options = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            weekday: 'long',
        };
        return date.toLocaleString('en-US', options);
    };


    if (loading) {
        return <div className="admin-container">Loading incidents...</div>;
    }

    if (error) {
        return <div className="admin-container error-message">Error: {error}</div>;
    }

    return (
        <div className="admin-container">
            <h2>All Reported Incidents</h2>

            <div className="filter-section">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="status-filter-dropdown"
                >
                    {incidentStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {updateStatusMessage && (
                <p className={`admin-status-message ${updateStatusMessage.includes('successfully') ? 'success' : 'error'}`}>
                    {updateStatusMessage}
                </p>
            )}

            {incidents.length === 0 ? (
                <p>No incidents registered yet for the selected filter.</p>
            ) : (
                <table className="incidents-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Location</th>
                        <th>Reported At</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {incidents.map((incident) => (
                        <React.Fragment key={incident.id}>
                            <tr
                                className={`incident-row status-row-${incident.status.toLowerCase().replace(/\s/g, '-')}`}
                                onClick={() => toggleDetails(incident.id)}
                            >
                                <td data-label="ID:">{incident.id}</td>
                                <td className="location-cell-clickable" data-label="Location:">{incident.locationDescription}</td>
                                <td data-label="Reported At:">{formatSimpleTime(incident.reportTimestamp)}</td>
                                <td className="details-toggle-cell" data-label="Details:">
                                    <i className={`fas ${selectedIncidentId === incident.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </td>
                            </tr>
                            {selectedIncidentId === incident.id && (
                                // Use the new component here
                                <IncidentDetailsExpanded
                                    incident={incident}
                                    incidentStatuses={incidentStatuses}
                                    handleStatusChange={handleStatusChange}
                                    handleDeleteIncident={handleDeleteIncident}
                                />
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPage;