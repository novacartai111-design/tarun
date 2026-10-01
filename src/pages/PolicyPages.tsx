import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Truck, RotateCcw, ShieldCheck, FileText } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does Pan-India delivery take?',
      a: 'Orders shipped to Tier-1 metropolitan cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Kolkata, Pune) are delivered within 2–3 business days. For other states and regions, delivery typically takes 4–5 business days.',
    },
    {
      q: 'Is Cash on Delivery (COD) available?',
      a: 'Yes! We support Cash on Delivery across 19,000+ PIN codes in India. You can pay with cash or via UPI directly to the delivery courier executive upon doorstep arrival.',
    },
    {
      q: 'How does Nova AI Shopping Assistant work?',
      a: 'Nova AI is our virtual stylist. Click the “Ask Nova AI” button anytime and mention your occasion (e.g. college fest, festive pooja, casual date), budget, or preferred colors. Nova AI recommends matching products in our store catalog.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a 7-day hassle-free doorstep return and exchange policy from the date of delivery. Items must be unused, unwashed, with original tags intact.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is placed, you will receive an Order ID (e.g. NC-2026-XXXX). Go to the "Track Order" link in our header or visit /orders to see live milestone updates from packing to doorstep delivery.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-xs text-gray-500">
          Got questions? Here are quick answers to our most common customer queries.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition transform ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-xs text-gray-700 leading-relaxed">
      <div className="flex items-center space-x-2 text-blue-600 mb-2">
        <Truck className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">Shipping & Delivery Policy</h1>
      </div>
      <p>
        At <strong>NovaCart Ai</strong> (novaworld.digital), we are committed to delivering your fashion orders quickly, safely, and transparently across India.
      </p>

      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-1">Pan-India Delivery Timelines:</h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-800">
          <li><strong>Metro Cities:</strong> 2 to 3 business days.</li>
          <li><strong>Rest of India:</strong> 3 to 5 business days.</li>
          <li><strong>Free Shipping:</strong> On all orders above ₹999. Orders below ₹999 carry a flat ₹99 delivery charge.</li>
        </ul>
      </div>

      <h3 className="font-bold text-sm text-gray-900 mt-4">Courier Partners</h3>
      <p>
        We partner with India's leading logistics providers including Delhivery, Blue Dart, and Xpressbees to ensure real-time tracking from dispatch to final delivery.
      </p>
    </div>
  );
};

export const ReturnsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-xs text-gray-700 leading-relaxed">
      <div className="flex items-center space-x-2 text-green-600 mb-2">
        <RotateCcw className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">7-Day Returns & Refund Policy</h1>
      </div>
      <p>
        We want you to love your style. If for any reason you are not completely satisfied with your order, we offer an easy <strong>7-Day Doorstep Return & Exchange Policy</strong>.
      </p>

      <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
        <h3 className="font-bold text-green-900 mb-1">Return Eligibility:</h3>
        <ul className="list-disc pl-5 space-y-1 text-green-800">
          <li>Return request must be raised within 7 days of package delivery.</li>
          <li>Product must be unworn, unwashed, and in original packaging with intact tags.</li>
          <li>Refunds for prepaid orders are credited back to the original UPI / Card account within 3–5 business days.</li>
          <li>Refunds for Cash on Delivery (COD) are transferred via instant UPI or NEFT bank transfer upon pickup.</li>
        </ul>
      </div>
    </div>
  );
};

export const PrivacyTermsPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const isPrivacy = type === 'privacy';
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-xs text-gray-700 leading-relaxed">
      <div className="flex items-center space-x-2 text-blue-600 mb-2">
        <ShieldCheck className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">
          {isPrivacy ? 'Privacy & Data Protection Policy' : 'Terms & Conditions'}
        </h1>
      </div>
      <p>
        Last Updated: October 2026. Official terms for NovaCart Ai operated on <strong>novaworld.digital</strong>.
      </p>
      <p>
        We respect your privacy. NovaCart Ai does not sell your personal information. Customer details (name, phone, delivery address) are utilized solely for fulfilling your orders, sending delivery SMS/WhatsApp updates, and offering personalized styling recommendations through Nova AI.
      </p>
      <p>
        All digital payment transactions are processed through RBI-authorized payment aggregators utilizing industry-standard 256-bit SSL encryption.
      </p>
    </div>
  );
};
