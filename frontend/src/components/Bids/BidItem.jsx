import React from 'react';

const BidItem = ({ bid, onHire }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'hired': return 'Hired';
            case 'rejected': return 'Rejected';
            default: return 'Pending';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                            {bid.freelancerId?.name?.charAt(0) || 'F'}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">
                            {bid.freelancerId?.name || 'Unknown Freelancer'}
                        </h4>
                        <p className="text-sm text-gray-600">{bid.freelancerId?.email}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-blue-600">
                        ${bid.price}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bid.status)}`}>
                        {getStatusText(bid.status)}
                    </span>
                </div>
            </div>
            
            <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-line">{bid.message}</p>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Bid submitted: {new Date(bid.createdAt).toLocaleDateString()}</span>
                
                {bid.status === 'pending' && onHire && (
                    <button
                        onClick={() => onHire(bid._id)}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                        Hire This Freelancer
                    </button>
                )}
                
                {bid.status === 'hired' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 font-medium rounded-full">
                        ✓ Selected
                    </span>
                )}
            </div>
        </div>
    );
};

export default BidItem;
