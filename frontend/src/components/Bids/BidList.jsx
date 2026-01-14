import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BidItem from './BidItem';

const BidList = ({ gigId, isOwner }) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBids = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://gigflow-api-ijxi.onrender.com/api/bids/${gigId}`,
                { withCredentials: true }
            );
            setBids(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load bids');
            console.error('Error fetching bids:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gigId && isOwner) {
            fetchBids();
        }
    }, [gigId, isOwner]);

    const handleHire = async (bidId) => {
        if (!window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.patch(
                `https://gigflow-api-ijxi.onrender.com/api/bids/${bidId}/hire`,
                {},
                { withCredentials: true }
            );
            
            alert('Freelancer hired successfully!');
            fetchBids(); // Refresh bids list
            
            // Refresh page to update gig status
            window.location.reload();
            
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to hire freelancer');
            console.error('Hire error:', err);
        }
    };

    if (!isOwner) {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Bids Received</h3>
                <button
                    onClick={fetchBids}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : bids.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bids yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Wait for freelancers to bid on your gig
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bids.map((bid) => (
                        <BidItem 
                            key={bid._id} 
                            bid={bid} 
                            onHire={handleHire}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BidList;
