import React from 'react';

function AddProfile({ currentUser, setView, handleProfileSubmit, error, setError, formData, handleInputChange }) {
    const handleSubmit = () => {
        const { full_name, rashi, nakshatra, is_user } = formData;
        if (!full_name) {
            setError('Full name is required');
            return;
        }
        handleProfileSubmit({
            full_name,
            rashi: rashi || null,
            nakshatra: nakshatra || null,
            is_user: is_user === 'true'
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add Profile</h2>
            {error && <p className="text-red mb-4">{error}</p>}
            <input type="text" name="full_name" placeholder="Full Name" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="text" name="rashi" placeholder="Rashi (Optional)" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="text" name="nakshatra" placeholder="Nakshatra (Optional)" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <select name="is_user" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded">
                <option value="false">Family Member</option>
                <option value="true">Self</option>
            </select>
            <button onClick={handleSubmit} className="w-full bg-blue text-white p-2 rounded hover-bg-blue-dark">Submit</button>
            <button onClick={() => setView('dashboard')} className="w-full bg-gray text-white p-2 rounded hover-bg-gray-dark mt-2">Cancel</button>
        </div>
    );
}

export default AddProfile;