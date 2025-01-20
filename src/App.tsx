import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cars from './pages/Cars'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'

const initialPayPalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture"
}

function App() {
  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/book/:id" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </PayPalScriptProvider>
  )
}

export default App