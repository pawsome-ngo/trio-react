// src/components/ReportIncidentForm.jsx
import React, { useState } from 'react';
import '../App.css';

const ReportIncidentForm = () => {
    const [reporterName, setReporterName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState(''); // This will now be for manual place name entry
    const [description, setDescription] = useState('');
    const [animalImage, setAnimalImage] = useState(null);

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [locationStatus, setLocationStatus] = useState(''); // To show messages like "Getting location..." or "Error"

    // New state for submission feedback
    const [submitStatus, setSubmitStatus] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            setLocationStatus('Getting your precise coordinates...');
            setLatitude(null); // Clear previous coordinates display (if any)
            setLongitude(null); // Clear previous coordinates display (if any)

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    setLocationStatus('Coordinates obtained successfully!'); // Specific message for coordinates
                    // REMOVED: setLocation(`Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
                    // The user will manually enter the place name in the 'location' input.
                },
                (error) => {
                    let errorMessage = 'Error getting coordinates.';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied. Please enable location services for this site.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'The request to get user location timed out.';
                            break;
                        default:
                            errorMessage = 'An unknown error occurred.';
                            break;
                    }
                    setLocationStatus(errorMessage);
                    console.error('Geolocation Error:', error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocationStatus('Geolocation is not supported by your browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');
        setSubmitMessage('Submitting your report...');

        const formData = new FormData();
        formData.append('reporterName', reporterName);
        formData.append('phoneNumber', phoneNumber);
        formData.append('location', location); // This is the manually entered place name
        formData.append('description', description);
        if (latitude !== null) {
            formData.append('latitude', latitude); // Lat is still sent to backend
        }
        if (longitude !== null) {
            formData.append('longitude', longitude); // Lon is still sent to backend
        }
        if (animalImage) {
            formData.append('animalImage', animalImage);
        }

        try {
            const response = await fetch('http://localhost:8080/api/incidents', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseText = await response.text();
                sessionStorage.setItem('incidentReportSuccess', `Report submitted successfully! ${responseText}`);

                window.location.hash = '#home';

                // Clear form fields after successful submission
                setReporterName('');
                setPhoneNumber('');
                setLocation(''); // Clear manual location input
                setDescription('');
                setAnimalImage(null);
                setLatitude(null); // Clear coordinates from state
                setLongitude(null); // Clear coordinates from state
                setLocationStatus(''); // Clear location status message
                document.getElementById('animalImage').value = null; // Clear file input
            } else {
                const errorText = await response.text();
                setSubmitStatus('error');
                setSubmitMessage(`Failed to submit report: ${errorText}`);
                console.error('Submission error:', response.status, errorText);
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage(`Network error or API not reachable: ${error.message}`);
            console.error('Network or API error:', error);
        }
    };

    return (
        <div className="report-incident-container">
            <h2>Report a Stray Animal Incident</h2>

            {submitStatus && submitStatus !== 'success' && (
                <p className={`submission-feedback ${submitStatus}`}>
                    {submitMessage}
                </p>
            )}

            <form className="incident-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="reporterName">Your Name:</label>
                    <input
                        type="text"
                        id="reporterName"
                        name="reporterName"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number (India):</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="e.g., 9876543210"
                        pattern="[6-9]{1}[0-9]{9}"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location of Incident (Place Name):</label> {/* Updated label */}
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="e.g., Near City Park, Main Street" // Updated placeholder
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <button type="button" onClick={handleGetLocation} className="get-location-button">
                        Get My Exact Coordinates
                    </button> {/* Updated button text */}
                    {locationStatus && <p className="location-status">{locationStatus}</p>}
                    {/* REMOVED: {latitude !== null && longitude !== null && (...) } */}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description of Incident:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        placeholder="e.g., Type of animal, condition, specific behavior, approximate time"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="animalImage">Upload Image (Optional):</label>
                    <input
                        type="file"
                        id="animalImage"
                        name="animalImage"
                        accept="image/*"
                        onChange={(e) => setAnimalImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="submit-button">Submit Report</button>
            </form>
        </div>
    );
};

export default ReportIncidentForm;