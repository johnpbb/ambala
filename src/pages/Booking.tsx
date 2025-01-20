import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { supabase } from '../lib/supabase'
import { addDays, differenceInDays } from 'date-fns'
import AuthModal from '../components/AuthModal'

interface Car {
  id: string
  name: string
  price_per_day: number
}

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState<Car | null>(null)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 1))
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'mpaisa'>('paypal')
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Fetch car details
    async function fetchCar() {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single()
          
        if (error) throw error
        setCar(data)
      } catch (error) {
        console.error('Error fetching car:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [id])

  if (loading || !car) {
    return <div>Loading...</div>
  }

  const numberOfDays = differenceInDays(endDate, startDate) || 1
  const totalAmount = car.price_per_day * numberOfDays

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      if (!user) {
        setShowAuthModal(true)
        return
      }

      const order = await actions.order.capture()
      
      const { error } = await supabase.from('bookings').insert({
        car_id: car.id,
        user_id: user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total_amount: totalAmount,
        payment_id: order.id,
        payment_method: 'paypal',
        status: 'confirmed'
      })

      if (error) throw error

      alert('Booking confirmed!')
      navigate('/')
      
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('There was an error processing your payment. Please try again.')
    }
  }

  const handleMPAiSAPayment = async () => {
    try {
      if (!user) {
        setShowAuthModal(true)
        return
      }

      const { error } = await supabase.from('bookings').insert({
        car_id: car.id,
        user_id: user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total_amount: totalAmount,
        payment_method: 'mpaisa',
        status: 'pending'
      })

      if (error) throw error

      alert('M-PAiSA payment initiated! Check your phone to complete payment.')
    } catch (error: any) {
      console.error('Error initiating M-PAiSA payment:', error)
      alert(error.message || 'Error initiating payment. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold">Book {car.name}</h2>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                min={startDate.toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-lg font-medium">
              Total: ${totalAmount} USD for {numberOfDays} days
            </p>
          </div>

          {!user && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <p className="text-yellow-700">
                Please sign in to complete your booking
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In to Continue
              </button>
            </div>
          )}

          <div className="mt-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`px-4 py-2 rounded ${
                  paymentMethod === 'paypal' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                PayPal
              </button>
              <button
                onClick={() => setPaymentMethod('mpaisa')}
                className={`px-4 py-2 rounded ${
                  paymentMethod === 'mpaisa'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                M-PAiSA
              </button>
            </div>

            {paymentMethod === 'paypal' ? (
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalAmount.toString(),
                          currency_code: "USD"
                        },
                        description: `Car rental: ${car.name}`
                      }
                    ]
                  })
                }}
                onApprove={handlePayPalApprove}
              />
            ) : (
              <button
                onClick={handleMPAiSAPayment}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Pay with M-PAiSA
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setUser(supabase.auth.getUser())
          setShowAuthModal(false)
        }}
      />
    </div>
  )
}