import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Layout/Navbar';
import BidForm from '../components/Bids/BidForm';
import BidList from '../components/Bids/BidList';

const GigDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [hasBid, setHasBid] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchGigDetails();
    }, [id]);

    const fetchGigDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://gigflow-api-ijxi.onrender.com/api/gigs`);
            const gigs = response.data;
            const foundGig = gigs.find(g => g._id === id);
            
            if (!foundGig) {
                setError('Gig not found');
                return;
            }
            
            setGig(foundGig);
            
            if (user) {
                try {
                    const bidsResponse = await axios.get(
                        `https://gigflow-api-ijxi.onrender.com/api/bids/${id}`,
                        { withCredentials: true }
                    );
                    const userBid = bidsResponse.data.find(bid => 
                        bid.freelancerId?._id === user.id
                    );
                    setHasBid(!!userBid);
                } catch (err) {
                   
                }
            }
            
        } catch (err) {
            setError('Failed to load gig details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBidSubmit = () => {
        setHasBid(true);
        fetchGigDetails(); 
    };

    const isOwner = user && gig && gig.ownerId?._id === user.id;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    if (error || !gig) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                        <p className="text-red-700">{error || 'Gig not found'}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
                                <div className="flex items-center space-x-4 text-gray-600">
                                    <span>Posted by: <strong>{gig.ownerId?.name || 'Unknown'}</strong></span>
                                    <span>•</span>
                                    <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        gig.status === 'open' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {gig.status === 'open' ? 'Open for Bids' : 'Assigned'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-blue-600">${gig.budget}</div>
                                <p className="text-gray-600 text-sm">Budget</p>
                            </div>
                        </div>

                        <div className="prose max-w-none mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-line">{gig.description}</p>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                                >
                                    Back to Gigs
                                </button>
                                
                                {!isOwner && gig.status === 'open' && !hasBid && user && (
                                    <span className="text-green-600 font-medium">
                                        You can submit a bid for this project
                                    </span>
                                )}
                                
                                {hasBid && (
                                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                                        ✓ You have submitted a bid
                                    </span>
                                )}
                                
                                {gig.status === 'assigned' && (
                                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                                        This gig has been assigned
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

              
                {!isOwner && gig.status === 'open' && user && !hasBid && (
                    <div className="mb-8">
                        <BidForm gigId={id} onBidSubmit={handleBidSubmit} />
                    </div>
                )}

               
                {isOwner && <BidList gigId={id} isOwner={isOwner} />}

            
                {!user && gig.status === 'open' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                            Interested in this project?
                        </h3>
                        <p className="text-blue-800 mb-4">
                            Sign in to submit a bid or create an account to get started
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GigDetails;
