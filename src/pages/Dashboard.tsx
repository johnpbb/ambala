import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { Car, ChevronRight, Users, CreditCard, X, Calendar, Clock, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Booking {
  id: string
  car: {
    name: string
    image: string
    description: string
    fuel_type: string
    transmission: string
    passengers: number
    year: number
  }
  start_date: string
  end_date: string
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  pickup_location?: string
}

interface User {
  id: string
  email: string
  role: string
}

interface BillingInfo {
  id: string
  card_last4: string
  card_brand: string
  exp_month: number
  exp_year: number
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'billing' | 'users'>('current')
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/')
        return
      }
      setUser(user)

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.role === 'admin')

      // Load all bookings for the user with full car details
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          id,
          start_date,
          end_date,
          total_amount,
          status,
          payment_method,
          created_at,
          car:cars (
            name,
            image,
            description,
            fuel_type,
            transmission,
            passengers,
            year
          )
        `)
        .eq(isAdmin ? 'status' : 'user_id', isAdmin ? 'pending' : user.id)
        .order('created_at', { ascending: false })

      setBookings(bookingsData || [])

      // Load billing info if it exists
      const { data: billingData } = await supabase
        .from('billing_info')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      setBillingInfo(billingData)

      // Load users if admin
      if (profile?.role === 'admin') {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        
        setUsers(usersData || [])
      }
    }

    loadData()
  }, [navigate])

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (error) {
      alert('Error updating booking status')
      return
    }

    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ))
  }

  const updateUserRole = async (userId: string, role: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)

    if (error) {
      alert('Error updating user role')
      return
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, role } : user
    ))
  }

  const updateBillingInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const billingData = {
      user_id: user.id,
      card_last4: formData.get('card_number')?.toString().slice(-4) || '',
      card_brand: 'visa',
      exp_month: parseInt(formData.get('exp_month')?.toString() || '0'),
      exp_year: parseInt(formData.get('exp_year')?.toString() || '0')
    }

    const { error } = await supabase
      .from('billing_info')
      .upsert(billingData)

    if (error) {
      alert('Error updating billing information')
      return
    }

    setBillingInfo(billingData as BillingInfo)
    alert('Billing information updated successfully')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const currentDate = new Date()
  const currentBookings = bookings.filter(booking => new Date(booking.end_date) >= currentDate)
  const pastBookings = bookings.filter(booking => new Date(booking.end_date) < currentDate)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex items-center px-4 py-2 rounded ${
              activeTab === 'current' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            <Car className="w-4 h-4 mr-2" />
            Current Bookings
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex items-center px-4 py-2 rounded ${
              activeTab === 'past' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            <Car className="w-4 h-4 mr-2" />
            Past Bookings
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center px-4 py-2 rounded ${
              activeTab === 'billing' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Billing Info
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-4 py-2 rounded ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </button>
          )}
        </div>
      </div>

      {(activeTab === 'current' || activeTab === 'past') && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {(activeTab === 'current' ? currentBookings : pastBookings).map((booking) => (
              <li 
                key={booking.id} 
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={booking.car.image}
                      alt={booking.car.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">{booking.car.name}</h3>
                      <p className="text-gray-500">
                        {format(new Date(booking.start_date), 'PP')} - {format(new Date(booking.end_date), 'PP')}
                      </p>
                      <p className="text-gray-500">
                        ${booking.total_amount} USD • {booking.payment_method}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                    {isAdmin && booking.status === 'pending' && (
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateBookingStatus(booking.id, 'confirmed')
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateBookingStatus(booking.id, 'cancelled')
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    <ChevronRight className="ml-4 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Billing Information</h3>
            
            {billingInfo && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <p>Card: **** **** **** {billingInfo.card_last4}</p>
                <p>Expires: {billingInfo.exp_month}/{billingInfo.exp_year}</p>
              </div>
            )}

            <form onSubmit={updateBillingInfo} className="mt-6 space-y-6">
              <div>
                <label htmlFor="card_number" className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  name="card_number"
                  id="card_number"
                  required
                  pattern="\d{16}"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp_month" className="block text-sm font-medium text-gray-700">
                    Expiration Month
                  </label>
                  <input
                    type="number"
                    name="exp_month"
                    id="exp_month"
                    min="1"
                    max="12"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="exp_year" className="block text-sm font-medium text-gray-700">
                    Expiration Year
                  </label>
                  <input
                    type="number"
                    name="exp_year"
                    id="exp_year"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Billing Information
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'users' && isAdmin && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{user.email}</h3>
                    <p className="text-gray-500">Role: {user.role || 'user'}</p>
                  </div>
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6">
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img
                    src={selectedBooking.car.image}
                    alt={selectedBooking.car.name}
                    className="object-cover w-full h-64 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{selectedBooking.car.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedBooking.car.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{selectedBooking.car.passengers} Passengers</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Car className="h-5 w-5 mr-2" />
                        <span>{selectedBooking.car.transmission}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{selectedBooking.car.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Booking Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>
                            {format(new Date(selectedBooking.start_date), 'PPP')} - 
                            {format(new Date(selectedBooking.end_date), 'PPP')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 mr-2" />
                          <span>Created: {format(new Date(selectedBooking.created_at), 'PPp')}</span>
                        </div>
                        {selectedBooking.pickup_location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-2" />
                            <span>Pickup: {selectedBooking.pickup_location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Payment Details</h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">Amount: ${selectedBooking.total_amount} USD</p>
                        <p className="text-gray-600">Method: {selectedBooking.payment_method}</p>
                        <p className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          selectedBooking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : selectedBooking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Status: {selectedBooking.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}