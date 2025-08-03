import React from 'react';

function Login({ setView, handleLogin, error, setError, formData, handleInputChange }) {
    const handleSubmit = () => {
        const { username, password } = formData;
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
        handleLogin({ username, password });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red mb-4">{error}</p>}
            <input type="text" name="username" placeholder="Username" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="password" name="password" placeholder="Password" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <button onClick={handleSubmit} className="w-full bg-blue text-white p-2 rounded hover-bg-blue-dark">Login</button>
            <p className="mt-4">Don't have an account? <span onClick={() => setView('register')} className="text-blue cursor-pointer">Register</span></p>
        </div>
    );
}

export default Login;