import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { WalletProvider, useWallet } from './contexts/WalletContext'
import { DonationProvider } from './contexts/DonationContext'
import { LanguageProvider } from './contexts/LanguageContext'
import ErrorBoundary from './components/ErrorBoundary'
import UserProfileModal from './components/UserProfileModal'
import BackgroundDecorations from './components/BackgroundDecorations'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Donate from './pages/Donate'
import ConfirmDonation from './pages/ConfirmDonation'
import MyDonations from './pages/MyDonations'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'

// Wrapper that shows profile modal globally when needed
function AppRoutes() {
  const { showProfileModal } = useWallet()
  const { pathname } = useLocation()

  return (
    <>
      {showProfileModal && pathname !== '/admin' && <UserProfileModal />}
      <Routes>
        <Route path="/" element={<HomeOrDashboard />} />
        <Route path="/donate/:orgId" element={<Donate />} />
        <Route path="/donate/:orgId/confirm" element={<ConfirmDonation />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

// Show Dashboard when connected, Home when not
function HomeOrDashboard() {
  const { isConnected } = useWallet()
  return isConnected ? <Dashboard /> : <Home />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BackgroundDecorations />
      <LanguageProvider>
        <WalletProvider>
          <DonationProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DonationProvider>
        </WalletProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
