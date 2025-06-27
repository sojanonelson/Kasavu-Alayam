import React, { useEffect, useState } from 'react';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getUserAddresses,
} from '../../services/AddressService';

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    place: '',
    city: '',
    state: '',
    pincode: '',
    postOffice:''
  });
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddresses(userId);
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  useEffect(() => {
    if (userId) fetchAddresses();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    if (!formData.place || !formData.city || !formData.state || !formData.pincode || !formData.postOffice) return;

    try {
      if (editingId) {
        await updateAddress(userId, editingId, formData);
        setEditingId(null);
      } else {
        await addAddress(userId, formData);
      }
      setFormData({ place: '', city: '', state: '', pincode: '' });
      fetchAddresses();
    } catch (err) {
      console.error('Error saving address:', err);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      place: address.place,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      postOffice:address.postOffice
    });
    setEditingId(address._id);
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(userId, addressId);
      fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  return (
    <div className="p-6 bg-white ">
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Addresses</h2>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="Place"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="postOffice"
            value={formData.postOffice}
            onChange={handleChange}
            placeholder="postOffice"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddOrUpdate}
          className={`px-4 py-2 rounded text-white ${
            editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {editingId ? 'Update Address' : 'Add Address'}
        </button>

        {/* Address List */}
        <div className="mt-8 space-y-4">
          {addresses.length === 0 ? (
            <p className="text-gray-600 text-center">🚫 No address found. Please create one.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className="border p-4 rounded bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{addr.place}, {addr.city}</p>
                  <p className="text-sm text-gray-600">{addr.state} - {addr.pincode}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Address;
