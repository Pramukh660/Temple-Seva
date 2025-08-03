import React from 'react';

function ShippingAddress({ currentUser, setView, handleShippingSubmit, error, setError, formData, handleInputChange }) {
    const handleSubmit = () => {
        const { address_line1, city, state, country, postal_code, address_line2 } = formData;
        if (!address_line1 || !city || !state || !country || !postal_code) {
            setError('All address fields are required');
            return;
        }
        const newAddress = {
            user_id: currentUser.user_id,
            address_line1,
            address_line2: address_line2 || null,
            city,
            state,
            country,
            postal_code
        };
        const newOrderShipping = {
            order_id: null // Will be set by backend
        };
        handleShippingSubmit(newAddress, newOrderShipping);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
            {error && <p className="text-red mb-4">{error}</p>}
            <input type="text" name="address_line1" placeholder="Address Line 1" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="text" name="address_line2" placeholder="Address Line 2 (Optional)" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="text" name="city" placeholder="City" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="text" name="state" placeholder="State" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="text" name="country" placeholder="Country" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="text" name="postal_code" placeholder="Postal Code" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <button onClick={handleSubmit} className="w-full bg-blue text-white p-2 rounded hover-bg-blue-dark">Submit</button>
            <button onClick={() => setView('dashboard')} className="w-full bg-gray text-white p-2 rounded hover-bg-gray-dark mt-2">Cancel</button>
        </div>
    );
}

export default ShippingAddress;