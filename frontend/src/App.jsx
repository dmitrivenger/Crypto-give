import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import { DonationProvider } from './contexts/DonationContext'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Donate from './pages/Donate'
import ConfirmDonation from './pages/ConfirmDonation'
import MyDonations from './pages/MyDonations'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <DonationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donate" element={<Home />} />
              <Route path="/donate/:orgId" element={<Donate />} />
              <Route path="/donate/:orgId/confirm" element={<ConfirmDonation />} />
              <Route path="/my-donations" element={<MyDonations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DonationProvider>
      </WalletProvider>
    </ErrorBoundary>
  )
}
