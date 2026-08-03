import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/dev';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    rating: 5,
    status: 'active'
  });

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const response = await fetch(`${API_URL}/sellers`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      const sellersList = Array.isArray(data) ? data : (data.items || data.sellers || []);
      setSellers(sellersList);
    } catch (error) {
      console.error('Load sellers error:', error);
      if (error.message.includes('Failed to fetch')) {
        toast.error('CORS error: Backend needs Access-Control-Allow-Origin header');
      } else {
        toast.error(`Failed to load sellers: ${error.message}`);
      }
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sellerId = editingSeller?.sellerId || editingSeller?.id || editingSeller?.SellerId;
      console.log('Editing seller:', editingSeller);
      console.log('Seller ID:', sellerId);
      console.log('Form data:', formData);
      
      const url = editingSeller 
        ? `${API_URL}/sellers/${sellerId}`
        : `${API_URL}/sellers`;
      
      console.log('Request URL:', url);
      const method = editingSeller ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to save seller');
      }

      toast.success(editingSeller ? 'Seller updated!' : 'Seller created!');
      setShowModal(false);
      resetForm();
      loadSellers();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (seller) => {
    if (!window.confirm(`Delete ${seller.firstName} ${seller.lastName}?`)) return;
    
    try {
      const sellerId = seller.sellerId || seller.id || seller.SellerId;
      const response = await fetch(`${API_URL}/sellers/${sellerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete seller');

      toast.success('Seller deleted!');
      loadSellers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (seller) => {
    setEditingSeller(seller);
    setFormData({
      firstName: seller.firstName || '',
      lastName: seller.lastName || '',
      email: seller.email || '',
      phone: seller.phone || '',
      businessName: seller.businessName || '',
      address: seller.address || '',
      city: seller.city || '',
      state: seller.state || '',
      zipCode: seller.zipCode || '',
      rating: seller.rating || 5,
      status: seller.status || 'active'
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      rating: 5,
      status: 'active'
    });
    setEditingSeller(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
              <p className="text-gray-500 mt-1">{sellers.length} total sellers</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Seller
            </button>
          </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Business</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No sellers found. Click "Add Seller" to create one.
                  </td>
                </tr>
              ) : (
                sellers.map((seller) => (
                  <tr key={seller.sellerId || seller.id} className="hover:bg-gray-100/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{seller.firstName} {seller.lastName}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{seller.businessName || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{seller.email}</div>
                      <div className="text-xs text-gray-400">{seller.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {seller.city && seller.state ? `${seller.city}, ${seller.state}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-700 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-gray-900 font-medium">{seller.rating || 5}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        seller.status === 'active' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {seller.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(seller)}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded text-sm font-medium transition-colors mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(seller)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-gray-900 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSeller ? 'Edit Seller' : 'Add New Seller'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  {editingSeller ? 'Update Seller' : 'Create Seller'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagement;
