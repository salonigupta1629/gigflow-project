import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Layout/Navbar';

const MyBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchMyBids(JSON.parse(storedUser).id);
        }
    }, []);

    const fetchMyBids = async (userId) => {
        try {
            setLoading(true);
            const gigsResponse = await axios.get('http://localhost:5001/api/gigs', {
                withCredentials: true
            });
            
            let allBids = [];
            
            for (const gig of gigsResponse.data) {
                try {
                    const bidsResponse = await axios.get(
                        `http://localhost:5001/api/bids/${gig._id}`,
                        { withCredentials: true }
                    );
                    
                    const userBids = bidsResponse.data.filter(bid => 
                        bid.freelancerId?._id === userId
                    );
                    
                    const bidsWithGigInfo = userBids.map(bid => ({
                        ...bid,
                        gigTitle: gig.title,
                        gigBudget: gig.budget,
                        gigStatus: gig.status,
                        gigLink: `/gig/${gig._id}`
                    }));
                    
                    allBids = [...allBids, ...bidsWithGigInfo];
                } catch (err) {
                
                    continue;
                }
            }
            
            setBids(allBids);
            setError('');
        } catch (err) {
            setError('Failed to fetch your bids');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'hired': return 'Hired 🎉';
            case 'rejected': return 'Rejected';
            default: return 'Pending';
        }
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your bids</h2>
                        <Link to="/login" className="text-blue-600 hover:text-blue-800">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
                    <p className="text-gray-600 mt-2">Track your submitted bids</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : bids.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bids submitted yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Start bidding on gigs to see them here!</p>
                        <div className="mt-6">
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Browse Gigs
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bids.map((bid) => (
                            <div key={bid._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-shadow duration-200">
                                <div className="mb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                <Link to={bid.gigLink} className="hover:text-blue-600">
                                                    {bid.gigTitle}
                                                </Link>
                                            </h3>
                                            <p className="text-sm text-gray-600">Budget: ${bid.gigBudget}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bid.status)}`}>
                                            {getStatusText(bid.status)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm mb-2">Your Proposal:</p>
                                    <p className="text-gray-600 text-sm line-clamp-3">{bid.message}</p>
                                </div>
                                
                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm mb-1">Your Bid Price:</p>
                                    <p className="text-2xl font-bold text-blue-600">${bid.price}</p>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Submitted: {new Date(bid.createdAt).toLocaleDateString()}</span>
                                    <Link
                                        to={bid.gigLink}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View Gig →
                                    </Link>
                                </div>
                                
                                {bid.status === 'hired' && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-800 text-sm font-medium">🎉 Congratulations! You've been hired for this project!</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBids;