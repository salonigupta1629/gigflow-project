import React, { useState } from 'react';
import axios from 'axios';

const BidForm = ({ gigId, onBidSubmit }) => {
    const [formData, setFormData] = useState({
        message: '',
        price: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                setError('Please login to submit a bid');
                return;
            }

            const response = await axios.post(
                'http://localhost:5001/api/bids',
                {
                    gigId,
                    message: formData.message,
                    price: Number(formData.price)
                },
                { withCredentials: true }
            );
            
            setFormData({ message: '', price: '' });
            
            if (onBidSubmit) {
                onBidSubmit(response.data);
            }
            
            alert('Bid submitted successfully!');
            
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit bid');
            console.error('Bid submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Bid</h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Proposal *
                    </label>
                    <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe why you're the best fit for this project, your approach, timeline, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Bid Price ($) *
                    </label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="1"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter your price"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Bid'}
                </button>
            </form>
        </div>
    );
};

export default BidForm;
