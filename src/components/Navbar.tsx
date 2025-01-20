import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Car, Phone, Home, LogIn, User, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [user, setUser] = useState(supabase.auth.getUser())
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link 
      to={to}
      onClick={() => setIsMenuOpen(false)}
      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive(to) 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-50'}`}
    >
      {children}
    </Link>
  )

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 font-semibold text-xl text-gray-900">
                Ambala Rental Cars
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/">
              <Home className="mr-1 h-4 w-4" />
              Home
            </NavLink>

            <NavLink to="/cars">
              <Car className="mr-1 h-4 w-4" />
              Our Cars
            </NavLink>

            <NavLink to="/contact">
              <Phone className="mr-1 h-4 w-4" />
              Contact
            </NavLink>

            {user ? (
              <div className="flex items-center space-x-4">
                <NavLink to="/dashboard">
                  <User className="mr-1 h-4 w-4" />
                  Dashboard
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <LogIn className="mr-1 h-4 w-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/">
              <Home className="mr-1 h-4 w-4" />
              Home
            </NavLink>

            <NavLink to="/cars">
              <Car className="mr-1 h-4 w-4" />
              Our Cars
            </NavLink>

            <NavLink to="/contact">
              <Phone className="mr-1 h-4 w-4" />
              Contact
            </NavLink>

            {user ? (
              <>
                <NavLink to="/dashboard">
                  <User className="mr-1 h-4 w-4" />
                  Dashboard
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true)
                  setIsMenuOpen(false)
                }}
                className="w-full text-left inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md"
              >
                <LogIn className="mr-1 h-4 w-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setUser(supabase.auth.getUser())
          setShowAuthModal(false)
        }}
      />
    </nav>
  )
}