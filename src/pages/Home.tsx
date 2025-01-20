import { Link } from 'react-router-dom'
import { Car, Shield, Clock, MapPin } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury car on road"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore Fiji in Style
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            Experience the freedom of the open road with Ambala Rental Cars. From city cruisers to luxury vehicles, we have the perfect car for your Fijian adventure.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/cars"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View Our Fleet
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Ambala Rental Cars?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Experience hassle-free car rental with our premium service
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <Car className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      Premium Fleet
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Choose from our selection of well-maintained vehicles, from compact cars to luxury SUVs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      Fully Insured
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Drive with peace of mind knowing you're covered by our comprehensive insurance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      24/7 Support
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our customer service team is available around the clock to assist you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Convenient Locations
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Pick up your car from any of our locations across Fiji
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                city: 'Nadi',
                address: 'Nadi International Airport',
                hours: '24/7',
              },
              {
                city: 'Suva',
                address: 'Victoria Parade, Suva',
                hours: 'Mon-Sun: 8AM-8PM',
              },
              {
                city: 'Denarau',
                address: 'Port Denarau Marina',
                hours: 'Mon-Sun: 7AM-9PM',
              },
            ].map((location) => (
              <div
                key={location.city}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">
                      {location.city}
                    </h3>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500">{location.address}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Operating Hours: {location.hours}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}