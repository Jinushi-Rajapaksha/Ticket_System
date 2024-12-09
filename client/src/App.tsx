// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Customer from './pages/customerPage/customer';
import ProtectedRoute from './routes/protectedRoute';
import BuyTickets from './pages/customerPage/buyTickets';
import Vendor from './pages/vendorPage/vendor';
import VendorDashboard from './pages/vendorPage/vendorDashboard';
import Configurations from './pages/vendorPage/configurations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Customer />} />
          <Route path="/buy-tickets" element={<BuyTickets />} />
          <Route path="/vendor" element={<Vendor/>} />
          <Route path="/vendorDashboard" element={<VendorDashboard />} />
          <Route path="/configurations" element={<Configurations />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Add any other routes that should be protected here */}
          </Route>
          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
