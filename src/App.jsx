// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Resources from './components/Resources';
import Contact from './components/Contact';
import ReportIncidentForm from './components/ReportIncidentForm';
import AdminPage from './components/AdminPage'; // Import the new AdminPage

function App() {
    const [currentPage, setCurrentPage] = useState('home');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                setCurrentPage(hash);
            } else {
                setCurrentPage('home');
            }
        };

        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const renderPageContent = () => {
        switch (currentPage) {
            case 'home':
                return <Home />;
            case 'about':
                return <About />;
            case 'resources':
                return <Resources />;
            case 'contact':
                return <Contact />;
            case 'report-incident':
                return <ReportIncidentForm />;
            case 'admin': // New case for Admin page
                return <AdminPage />;
            default:
                return <h2>Page Not Found</h2>;
        }
    };

    return (
        <>
            <NavBar />
            <div className="page-content">
                {renderPageContent()}
            </div>
        </>
    );
}

export default App;