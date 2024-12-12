import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Customer from './pages/customerPage/customer';
import BuyTickets from './pages/customerPage/buyTickets';
import Vendor from './pages/vendorPage/vendor';
import VendorDashboard from './pages/vendorPage/vendorDashboard';
import Configurations from './pages/vendorPage/configurations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Customer />} />
          <Route path="/buy-tickets" element={<BuyTickets />} />
          <Route path="/vendor" element={<Vendor/>} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/configurations" element={<Configurations />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
