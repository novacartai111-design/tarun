import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          We’re Here to Help
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have queries regarding order delivery, returns, sizing, or styling advice? Reach out to the NovaCart Ai support desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-bold">Contact Information</h3>
            <p className="text-xs text-blue-100 mt-1">
              Our customer care executive team is active Monday through Saturday, 9:00 AM to 7:00 PM IST.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-200 block">Email Us</span>
                <span className="text-white font-medium">support@novacart.ai</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-200 block">WhatsApp / Helpline</span>
                <span className="text-white font-medium">+91 (080) 4123-8990</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-200 block">Fulfillment Center</span>
                <span className="text-white font-medium">
                  NovaCart Digital Hub, 100 Feet Road, Indiranagar, Bengaluru, Karnataka, 560038
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-200 block">Working Hours</span>
                <span className="text-white font-medium">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-600/50 text-[11px] text-blue-200">
            NovaCart Ai • novaworld.digital
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Message Received!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you for getting in touch. Our support specialist will respond to you via email within 2–4 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', message: '' });
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-gray-900 mb-2">Send us a Message</h3>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you with your order, return or product inquiry?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-md shadow-blue-500/20"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
