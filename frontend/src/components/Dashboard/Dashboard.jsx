import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../../services/auth'; 
import api from '../../services/auth';
import { useNavigate } from 'react-router-dom';

// Pagina que precisa de login pra ser acessado
const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [vapes, setVapes] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            fetchVapes(); 
        } else {
            navigate('/login'); 
        }
    }, [navigate]);
}
  
export default Dashboard;