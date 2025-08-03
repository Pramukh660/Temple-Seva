import React from 'react';

function Dashboard({ currentUser, setView, setCurrentUser, profiles, orders, temples, sevas }) {
    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="mb-4">Welcome, {currentUser.username}!</p>
            <button onClick={() => setView('addProfile')} className="bg-green text-white p-2 rounded hover-bg-green-dark mr-2">Add Profile</button>
            <button onClick={() => setView('orderSeva')} className="bg-blue text-white p-2 rounded hover-bg-blue-dark mr-2">Order Seva</button>
            <button onClick={() => { setCurrentUser(null); setView('login'); }} className="bg-red text-white p-2 rounded hover-bg-red-dark">Logout</button>
            <h3 className="text-xl font-bold mt-6">Your Profiles</h3>
            <ul className="list-disc pl-5">
                {profiles.map(profile => (
                    <li key={profile.profile_id}>
                        {profile.full_name} ({profile.is_user ? 'Self' : 'Family'}) - Rashi: {profile.rashi || 'N/A'}, Nakshatra: {profile.nakshatra || 'N/A'}
                    </li>
                ))}
            </ul>
            <h3 className="text-xl font-bold mt-6">Your Orders</h3>
            <ul className="list-disc pl-5">
                {orders.map(order => {
                    const seva = sevas.find(s => s.seva_id === order.seva_id);
                    const temple = temples.find(t => t.temple_id === seva.temple_id);
                    const profile = profiles.find(p => p.profile_id === order.profile_id);
                    return (
                        <li key={order.order_id}>
                            Seva: {seva.seva_name} at {temple.temple_name} for {profile.full_name} - Status: {order.status}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Dashboard;