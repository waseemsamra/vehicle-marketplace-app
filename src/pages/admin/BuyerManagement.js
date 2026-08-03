import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/dev';

const BuyerManagement = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    status: 'active'
  });

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    try {
      const response = await fetch(`${API_URL}/buyers`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      const buyersList = Array.isArray(data) ? data : (data.items || data.buyers || []);
      setBuyers(buyersList);
    } catch (error) {
      console.error('Load buyers error:', error);
      if (error.message.includes('Failed to fetch')) {
        toast.error('CORS error: Backend needs Access-Control-Allow-Origin header');
      } else {
        toast.error(`Failed to load buyers: ${error.message}`);
      }
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const buyerId = editingBuyer?.buyerId || editingBuyer?.id || editingBuyer?.BuyerId;
      console.log('Editing buyer:', editingBuyer);
      console.log('Buyer ID:', buyerId);
      console.log('Form data:', formData);
      
      const url = editingBuyer 
        ? `${API_URL}/buyers/${buyerId}`
        : `${API_URL}/buyers`;
      
      console.log('Request URL:', url);
      const method = editingBuyer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to save buyer');
      }

      toast.success(editingBuyer ? 'Buyer updated!' : 'Buyer created!');
      setShowModal(false);
      resetForm();
      loadBuyers();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (buyer) => {
    if (!window.confirm(`Delete ${buyer.firstName} ${buyer.lastName}?`)) return;
    
    try {
      const buyerId = buyer.buyerId || buyer.id || buyer.BuyerId;
      const response = await fetch(`${API_URL}/buyers/${buyerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete buyer');

      toast.success('Buyer deleted!');
      loadBuyers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (buyer) => {
    setEditingBuyer(buyer);
    setFormData({
      firstName: buyer.firstName || '',
      lastName: buyer.lastName || '',
      email: buyer.email || '',
      phone: buyer.phone || '',
      address: buyer.address || '',
      city: buyer.city || '',
      state: buyer.state || '',
      zipCode: buyer.zipCode || '',
      status: buyer.status || 'active'
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      status: 'active'
    });
    setEditingBuyer(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
          <p className="text-gray-500 mt-1">{buyers.length} total buyers</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Buyer
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buyers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No buyers found. Click "Add Buyer" to create one.
                  </td>
                </tr>
              ) : (
                buyers.map((buyer) => (
                  <tr key={buyer.buyerId || buyer.id} className="hover:bg-gray-100/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{buyer.firstName} {buyer.lastName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{buyer.email}</div>
                      <div className="text-xs text-gray-400">{buyer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {buyer.city && buyer.state ? `${buyer.city}, ${buyer.state}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        buyer.status === 'active' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {buyer.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(buyer)}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded text-sm font-medium transition-colors mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(buyer)}
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
                {editingBuyer ? 'Edit Buyer' : 'Add New Buyer'}
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
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  {editingBuyer ? 'Update Buyer' : 'Create Buyer'}
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

export default BuyerManagement;
