import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletProvider, useWallet } from './contexts/WalletContext'
import { DonationProvider } from './contexts/DonationContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import ErrorBoundary from './components/ErrorBoundary'
import UserProfileModal from './components/UserProfileModal'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Donate from './pages/Donate'
import ConfirmDonation from './pages/ConfirmDonation'
import MyDonations from './pages/MyDonations'
import NotFound from './pages/NotFound'

// Wrapper that shows profile modal globally when needed
function AppRoutes() {
  const { showProfileModal } = useWallet()

  return (
    <>
      {showProfileModal && <UserProfileModal />}
      <Routes>
        <Route path="/" element={<HomeOrDashboard />} />
        <Route path="/donate/:orgId" element={<Donate />} />
        <Route path="/donate/:orgId/confirm" element={<ConfirmDonation />} />
        <Route path="/my-donations" element={<MyDonations />} />
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
      <ThemeProvider>
        <LanguageProvider>
          <WalletProvider>
            <DonationProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </DonationProvider>
          </WalletProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
