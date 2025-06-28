// src/components/Home.jsx
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import '../App.css'; // Ensure App.css styles are available

const Home = () => {
    const [successMessage, setSuccessMessage] = useState(''); // New state for success message

    useEffect(() => {
        // Check sessionStorage for a success message when the component mounts
        const message = sessionStorage.getItem('incidentReportSuccess');
        if (message) {
            setSuccessMessage(message);
            sessionStorage.removeItem('incidentReportSuccess'); // Clear the message so it doesn't reappear

            // Optionally, make the message disappear after a few seconds
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000); // Message disappears after 5 seconds

            return () => clearTimeout(timer); // Clean up the timer
        }
    }, []); // Run only once on mount

    return (
        <div>
            {successMessage && (
                <p className="home-success-message">
                    {successMessage}
                </p>
            )}
            <h2>Welcome to Home Page</h2>
            <a href="#report-incident" className="report-incident-button">
                Report an Incident
            </a>
            {/* You will add more content for the Home page here later */}
        </div>
    );
};

export default Home;