import React from 'react';
import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                            {gig.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                            Posted by: <span className="font-medium">{gig.ownerId?.name || 'Unknown'}</span>
                        </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ${gig.budget}
                    </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                    {gig.description}
                </p>
                
                <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        gig.status === 'open' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {gig.status === 'open' ? 'Open' : 'Assigned'}
                    </span>
                    
                    <Link
                        to={`/gig/${gig._id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GigCard;
