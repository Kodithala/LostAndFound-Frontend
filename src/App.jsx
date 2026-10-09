import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseItems from './pages/BrowseItems';
import ItemDetails from './pages/ItemDetails';

// User Pages
import ReportItem from './pages/ReportItem';
import UserDashboard from './pages/UserDashboard';
import MyReports from './pages/MyReports';
import MyMatches from './pages/MyMatches';
import MyClaims from './pages/MyClaims';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

// Admin / Staff Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminItems from './pages/AdminItems';
import AdminCategories from './pages/AdminCategories';
import AdminClaims from './pages/AdminClaims';
import AdminMatches from './pages/AdminMatches';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/items/:id" element={<ItemDetails />} />

              {/* User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/report-lost" element={<ReportItem defaultType="LOST" />} />
                <Route path="/report-found" element={<ReportItem defaultType="FOUND" />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/my-reports" element={<MyReports />} />
                <Route path="/my-matches" element={<MyMatches />} />
                <Route path="/my-claims" element={<MyClaims />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin & Staff Protected Routes */}
              <Route element={<ProtectedRoute adminOrStaffOnly={true} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/items" element={<AdminItems />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/claims" element={<AdminClaims />} />
                <Route path="/admin/matches" element={<AdminMatches />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
