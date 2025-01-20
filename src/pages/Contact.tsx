import { Phone, Mail, MapPin, Clock, Car, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('submitting')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([data])

      if (error) throw error
      
      setFormStatus('success')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormStatus('error')
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Have questions? We're here to help make your car rental experience smooth and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-8">
                  Contact Information
                </h3>

                <dl className="space-y-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <dt className="text-sm font-medium text-gray-500">
                        Phone
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        +679 XXX XXXX
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        Available 24/7 for emergencies
                      </dd>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        info@ambalarentals.com.fj
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        We typically respond within 2 hours
                      </dd>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <dt className="text-sm font-medium text-gray-500">
                        Main Office
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        123 Main Street, Nadi, Fiji
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        Near Nadi International Airport
                      </dd>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <dt className="text-sm font-medium text-gray-500">
                        Business Hours
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Monday - Friday: 8:00 AM - 6:00 PM
                      </dd>
                      <dd className="text-sm text-gray-900">
                        Saturday: 9:00 AM - 4:00 PM
                      </dd>
                      <dd className="text-sm text-gray-900">
                        Sunday: 10:00 AM - 2:00 PM
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="/cars"
                    className="flex items-center p-3 text-base font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <Car className="h-5 w-5 text-blue-600 mr-3" />
                    View Our Fleet
                  </a>
                  <a
                    href="/faq"
                    className="flex items-center p-3 text-base font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
                    FAQs
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-8">
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {formStatus === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-md">
                    Your message has been sent successfully. We'll get back to you soon!
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    There was an error sending your message. Please try again later.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}