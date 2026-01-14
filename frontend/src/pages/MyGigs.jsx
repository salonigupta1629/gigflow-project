import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Layout/Navbar';

const MyGigs = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchMyGigs(JSON.parse(storedUser).id);
        }
    }, []);

    const fetchMyGigs = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get('https://gigflow-api-ijxi.onrender.com/api/gigs', {
                withCredentials: true
            });
            
            const myGigs = response.data.filter(gig => gig.ownerId?._id === userId);
            setGigs(myGigs);
            setError('');
        } catch (err) {
            setError('Failed to fetch your gigs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGig = async (gigId) => {
        if (!window.confirm('Are you sure you want to delete this gig?')) {
            return;
        }

        try {
            await axios.delete(`https://gigflow-api-ijxi.onrender.com/api/gigs/${gigId}`, {
                withCredentials: true
            });
            
            alert('Gig deleted successfully!');
            fetchMyGigs(user.id);
        } catch (err) {
            alert('Failed to delete gig');
            console.error(err);
        }
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your gigs</h2>
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
                    <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
                    <p className="text-gray-600 mt-2">Manage your posted gigs</p>
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
                ) : gigs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No gigs posted yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by posting your first gig!</p>
                        <div className="mt-6">
                            <Link
                                to="/create-gig"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Post a Gig
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {gigs.map((gig) => (
                                <li key={gig._id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{gig.description}</p>
                                                </div>
                                                <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        ${gig.budget}
                                                    </span>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        gig.status === 'open' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {gig.status === 'open' ? 'Open' : 'Assigned'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                                                <span>Created: {new Date(gig.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>Bids: {gig.bidCount || 0}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex items-center space-x-4">
                                            <Link
                                                to={`/gig/${gig._id}`}
                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                            >
                                                View
                                            </Link>
                                            {gig.status === 'open' && (
                                                <button
                                                    onClick={() => handleDeleteGig(gig._id)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyGigs;