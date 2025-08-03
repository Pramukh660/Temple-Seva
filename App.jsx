import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Dashboard from './Dashboard.jsx';
import AddProfile from './AddProfile.jsx';
import OrderSeva from './OrderSeva.jsx';
import ShippingAddress from './ShippingAddress.jsx';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [view, setView] = useState('login');
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [temples, setTemples] = useState([]);
    const [sevas, setSevas] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log('Current view:', view);
        fetch('https://temple-seva-backend.onrender.com/api/temples')
            .then(res => res.json())
            .then(data => setTemples(data))
            .catch(err => setError('Failed to load temples'));
        fetch('https://temple-seva-backend.onrender.com/api/sevas')
            .then(res => res.json())
            .then(data => setSevas(data))
            .catch(err => setError('Failed to load sevas'));
        if (currentUser) {
            fetch(`https://temple-seva-backend.onrender.com/api/profiles/${currentUser.user_id}`)
                .then(res => res.json())
                .then(data => setUserProfiles(data))
                .catch(err => setError('Failed to load profiles'));
            fetch(`https://temple-seva-backend.onrender.com/api/orders/${currentUser.user_id}`)
                .then(res => res.json())
                .then(data => setOrders(data))
                .catch(err => setError('Failed to load orders'));
        }
    }, [currentUser, view]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (user) => {
        try {
            const res = await fetch('https://temple-seva-backend.onrender.com/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                setView('login');
                setError('');
                setFormData({});
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Failed to register');
        }
    };

    const handleLogin = async (user) => {
        try {
            const res = await fetch('https://temple-seva-backend.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
                setView('dashboard');
                setError('');
                setFormData({});
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Failed to login');
        }
    };

    const handleProfileSubmit = async (profile) => {
        try {
            const res = await fetch('https://temple-seva-backend.onrender.com/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...profile, user_id: currentUser.user_id })
            });
            if (res.ok) {
                const newProfile = await res.json();
                setUserProfiles([...userProfiles, newProfile]);
                setView('dashboard');
                setError('');
                setFormData({});
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add profile');
            }
        } catch (err) {
            setError('Failed to add profile');
        }
    };

    const handleOrderSubmit = async (order) => {
        try {
            const res = await fetch('https://temple-seva-backend.onrender.com/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...order, user_id: currentUser.user_id })
            });
            if (res.ok) {
                const newOrder = await res.json();
                setOrders([...orders, newOrder]);
                setView('shipping');
                setError('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to place order');
            }
        } catch (err) {
            setError('Failed to place order');
        }
    };

    const handleShippingSubmit = async (address, orderShipping) => {
        try {
            const res = await fetch('https://temple-seva-backend.onrender.com/api/shipping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, orderShipping })
            });
            if (res.ok) {
                setView('dashboard');
                setError('');
                setFormData({});
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save shipping address');
            }
        } catch (err) {
            setError('Failed to save shipping address');
        }
    };

    console.log('Rendering view:', view);
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (view === 'login') {
        console.log('Rendering Login component');
        return <Login setView={setView} handleLogin={handleLogin} error={error} setError={setError} formData={formData} handleInputChange={handleInputChange} />;
    }
    if (view === 'register') {
        console.log('Rendering Register component');
        return <Register setView={setView} handleRegister={handleRegister} error={error} setError={setError} formData={formData} handleInputChange={handleInputChange} />;
    }
    if (view === 'dashboard') {
        console.log('Rendering Dashboard component');
        return <Dashboard currentUser={currentUser} setView={setView} setCurrentUser={setCurrentUser} profiles={userProfiles} orders={orders} temples={temples} sevas={sevas} />;
    }
    if (view === 'addProfile') {
        console.log('Rendering AddProfile component');
        return <AddProfile currentUser={currentUser} setView={setView} handleProfileSubmit={handleProfileSubmit} error={error} setError={setError} formData={formData} handleInputChange={handleInputChange} />;
    }
    if (view === 'orderSeva') {
        console.log('Rendering OrderSeva component');
        return <OrderSeva currentUser={currentUser} setView={setView} handleOrderSubmit={handleOrderSubmit} error={error} setError={setError} formData={formData} handleInputChange={handleInputChange} temples={temples} sevas={sevas} profiles={userProfiles} />;
    }
    if (view === 'shipping') {
        console.log('Rendering ShippingAddress component');
        return <ShippingAddress currentUser={currentUser} setView={setView} handleShippingSubmit={handleShippingSubmit} error={error} setError={setError} formData={formData} handleInputChange={handleInputChange} />;
    }
    console.log('No view matched, returning fallback');
    return <div>No view found for: {view}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
export default App;