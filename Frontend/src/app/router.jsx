import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import App from '@/App'
import HomePage from '@/pages/home/HomePage'
import InventoryPage from '@/pages/inventory/InventoryPage'
import CarDetailsPage from '@/pages/inventory/CarDetailsPage'
import ContactPage from '@/pages/contact/ContactPage'
import LoginPage from '@/pages/account/LoginPage'
import SignUpPage from '@/pages/account/SignUpPage'
import ForgotPasswordPage from '@/pages/account/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/account/ResetPasswordPage'
import VerifyEmailPage from '@/pages/account/VerifyEmailPage'
import ProfilePage from '@/pages/account/ProfilePage'
import ProtectedRoute from '@/features/account/ProtectedRoute'
import AboutPage from '@/pages/about/AboutPage'
import ServicesPage from '@/pages/services/ServicesPage'
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage'
import TermsPage from '@/pages/legal/TermsPage'
import NotFoundPage from '@/pages/errors/NotFoundPage'
import RouteErrorPage from '@/pages/errors/RouteErrorPage'
import GaragePage from '@/pages/garage/GaragePage'
import CheckoutPage from '@/pages/garage/CheckoutPage'
import CheckoutSuccessPage from '@/pages/garage/CheckoutSuccessPage'
import BookingsPage from '@/pages/garage/BookingsPage'
import SavedCarsPage from '@/pages/inventory/SavedCarsPage'
import StoriesPage from '@/pages/stories/StoriesPage'
import InnovationPage from '@/pages/innovation/InnovationPage'
import VehicleConfiguratorPage from '@/pages/configurator/VehicleConfiguratorPage'

const AuthTitle = ({ title, children }) => {
  useEffect(() => { document.title = `${title} | REVEX` }, [title])
  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'inventory/:id', element: <CarDetailsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'stories', element: <StoriesPage /> },
      { path: 'innovation', element: <InnovationPage /> },
      { path: 'configurator', element: <VehicleConfiguratorPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'saved', element: <SavedCarsPage /> },
      { path: 'cart', element: <GaragePage /> },
      { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: 'bookings', element: <ProtectedRoute><BookingsPage /></ProtectedRoute> },
      { path: 'checkout/success', element: <CheckoutSuccessPage /> },
      { path: 'account', element: <Navigate to="/login" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/login', element: <AuthTitle title="Log in"><LoginPage /></AuthTitle> },
  { path: '/signup', element: <AuthTitle title="Sign up"><SignUpPage /></AuthTitle> },
  { path: '/forgot-password', element: <AuthTitle title="Forgot password"><ForgotPasswordPage /></AuthTitle> },
  { path: '/reset-password', element: <AuthTitle title="Reset password"><ResetPasswordPage /></AuthTitle> },
  { path: '/verify-email', element: <AuthTitle title="Verify email"><VerifyEmailPage /></AuthTitle> },
])
