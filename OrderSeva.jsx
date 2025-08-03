import React from 'react';

function OrderSeva({ currentUser, setView, handleOrderSubmit, error, setError, formData, handleInputChange, temples, sevas, profiles }) {
    const handleSubmit = () => {
        const { temple_id, seva_id, profile_id } = formData;
        if (!temple_id || !seva_id || !profile_id) {
            setError('Please select temple, seva, and profile');
            return;
        }
        handleOrderSubmit({
            profile_id: parseInt(profile_id),
            seva_id: parseInt(seva_id),
            order_date: new Date().toISOString(),
            status: 'Pending'
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Seva</h2>
            {error && <p className="text-red mb-4">{error}</p>}
            <select name="temple_id" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded">
                <option value="">Select Temple</option>
                {temples.map(temple => (
                    <option key={temple.temple_id} value={temple.temple_id}>{temple.temple_name}</option>
                ))}
            </select>
            <select name="seva_id" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded">
                <option value="">Select Seva</option>
                {formData.temple_id && sevas
                    .filter(seva => seva.temple_id === parseInt(formData.temple_id))
                    .map(seva => (
                        <option key={seva.seva_id} value={seva.seva_id}>{seva.seva_name} (₹{seva.price})</option>
                    ))}
            </select>
            <select name="profile_id" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded">
                <option value="">Select Profile</option>
                {profiles.map(profile => (
                    <option key={profile.profile_id} value={profile.profile_id}>{profile.full_name}</option>
                ))}
            </select>
            <button onClick={handleSubmit} className="w-full bg-blue text-white p-2 rounded hover-bg-blue-dark">Submit</button>
            <button onClick={() => setView('dashboard')} className="w-full bg-gray text-white p-2 rounded hover-bg-gray-dark mt-2">Cancel</button>
        </div>
    );
}

export default OrderSeva;