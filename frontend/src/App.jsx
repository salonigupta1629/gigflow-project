import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import GigDetails from './pages/GigDetails';
import MyGigs from './pages/MyGigs';      
import MyBids from './pages/MyBids';      
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CreateGig from './components/Gigs/CreateGig';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-gig" 
          element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-gigs" 
          element={
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-bids" 
          element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          } 
        />
        <Route path="/gig/:id" element={<GigDetails />} />
      </Routes>
    </Router>
  );
}

export default App;