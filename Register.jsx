import React from 'react';

function Register({ setView, handleRegister, error, setError, formData, handleInputChange }) {
    const handleSubmit = () => {
        const { username, password, email } = formData;
        if (!username || !password || !email) {
            setError('All fields are required');
            return;
        }
        handleRegister({ username, password, email, created_at: new Date().toISOString() });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red mb-4">{error}</p>}
            <input type="text" name="username" placeholder="Username" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="password" name="password" placeholder="Password" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="email" name="email" placeholder="Email" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <button onClick={handleSubmit} className="w-full bg-blue text-white p-2 rounded hover-bg-blue-dark">Register</button>
            <p className="mt-4">Already have an account? <span onClick={() => setView('login')} className="text-blue cursor-pointer">Login</span></p>
        </div>
    );
}

export default Register;