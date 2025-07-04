import React, { useEffect, useState, useCallback } from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../../assets/payment.json'; // Import as default
import { getTransactionHistory, getPaymentDetails } from '../../services/paymentService';
import { FiExternalLink, FiSearch, FiX } from 'react-icons/fi';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Memoized search function
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredPayments(payments);
      return;
    }
    
    const filtered = payments.filter((pay) =>
      pay.id.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      pay.email?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      pay.contact?.includes(searchQuery.trim())
    );
    setFilteredPayments(filtered);
  }, [payments, searchQuery]);

  // Auto-search when query changes
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Fetch payments on mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTransactionHistory();
        setPayments(res.data || []);
      } catch (err) {
        console.error('❌ Error fetching payment history:', err);
        setError('Failed to load payment history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const fetchPaymentDetails = async (paymentId) => {
    try {
      setDetailsLoading(true);
      setError(null);
      const res = await getPaymentDetails(paymentId);
      setPaymentDetails(res.data);
    } catch (err) {
      console.error('❌ Error fetching payment details:', err);
      setError('Failed to fetch payment details. Please try again.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setPaymentDetails(null);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Search Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Transaction ID, Email, or Contact"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              aria-label="Search payments"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Search payments"
          >
            Search
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🧾 Razorpay Payment History
        </h2>
        
        {searchQuery && (
          <p className="text-sm text-gray-600">
            {filteredPayments.length > 0 
              ? `Found ${filteredPayments.length} payment(s) matching "${searchQuery}"`
              : `No payments found matching "${searchQuery}"`
            }
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <Lottie options={defaultOptions} height={300} width={300} />
          <p className="text-gray-500 mt-4 font-medium">
            Loading payment history...
          </p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No payments found matching your search.' : 'No payments found.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        /* Payments Table */
        <div className="bg-white  border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                      {pay.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₹{formatAmount(pay.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pay.status === 'captured' 
                          ? 'bg-green-100 text-green-800'
                          : pay.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 uppercase">
                      {pay.method}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pay.email || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pay.contact || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(pay.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => {
                          setSelectedPayment(pay.id);
                          fetchPaymentDetails(pay.id);
                        }}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label={`View details for payment ${pay.id}`}
                      >
                        <FiExternalLink className="mr-1" size={14} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Payment Details
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Payment ID</p>
                <p className="font-mono text-lg text-gray-900">{selectedPayment}</p>
              </div>

              {detailsLoading ? (
                <div className="flex flex-col justify-center items-center py-12">
                  <Lottie options={defaultOptions} height={200} width={200} />
                  <p className="text-gray-500 mt-4">Loading payment details...</p>
                </div>
              ) : paymentDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            paymentDetails.status === 'captured' ? 'text-green-600' : 
                            paymentDetails.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {paymentDetails.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">₹{formatAmount(paymentDetails.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium">{paymentDetails.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium uppercase">{paymentDetails.method}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Customer Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{paymentDetails.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{paymentDetails.contact || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Transaction Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created At:</span>
                        <span className="font-medium">{formatDate(paymentDetails.created_at)}</span>
                      </div>
                      {paymentDetails.captured_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Captured At:</span>
                          <span className="font-medium">{formatDate(paymentDetails.captured_at)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium font-mono">{paymentDetails.order_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice ID:</span>
                        <span className="font-medium font-mono">{paymentDetails.invoice_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {paymentDetails.card && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Card Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Network:</span>
                          <span className="font-medium">{paymentDetails.card.network}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{paymentDetails.card.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card Number:</span>
                          <span className="font-medium font-mono">**** **** **** {paymentDetails.card.last4}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600">Failed to load payment details</p>
                  <button
                    onClick={() => fetchPaymentDetails(selectedPayment)}
                    className="mt-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;