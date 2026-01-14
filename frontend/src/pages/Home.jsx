import React from 'react';
import GigList from '../components/Gigs/GigList';
import Navbar from '../components/Layout/Navbar';

const Home = () => {
    return (
        <>
            <Navbar />
            <GigList />
        </>
    );
};

export default Home;
