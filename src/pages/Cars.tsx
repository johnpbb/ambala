import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Car as CarIcon, Users, Fuel, Calendar } from 'lucide-react'

interface Car {
  id: string
  name: string
  image: string
  price_per_day: number
  description: string
  passengers: number
  fuel_type: string
  transmission: string
  year: number
}

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'economy' | 'luxury'>('all')

  useEffect(() => {
    async function fetchCars() {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('price_per_day', { ascending: true })
          
        if (error) throw error
        setCars(data || [])
      } catch (error) {
        console.error('Error fetching cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const filteredCars = cars.filter(car => {
    if (filter === 'all') return true
    if (filter === 'economy') return car.price_per_day <= 100
    return car.price_per_day > 100
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Our Fleet
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Choose from our selection of well-maintained vehicles
          </p>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Cars
          </button>
          <button
            onClick={() => setFilter('economy')}
            className={`px-4 py-2 rounded-md ${
              filter === 'economy'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Economy
          </button>
          <button
            onClick={() => setFilter('luxury')}
            className={`px-4 py-2 rounded-md ${
              filter === 'luxury'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Luxury
          </button>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={car.image}
                  alt={car.name}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {car.name}
                </h3>
                <p className="mt-2 text-gray-500 line-clamp-2">
                  {car.description}
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-500">
                    <Users className="h-5 w-5 mr-2" />
                    {car.passengers} Passengers
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Fuel className="h-5 w-5 mr-2" />
                    {car.fuel_type}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <CarIcon className="h-5 w-5 mr-2" />
                    {car.transmission}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-5 w-5 mr-2" />
                    {car.year}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${car.price_per_day}
                    <span className="text-sm font-normal text-gray-500">/day</span>
                  </span>
                  <Link
                    to={`/book/${car.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500">No cars found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}