import React, { useState } from 'react';

const HomepageEditor = () => {
  const [activeTab, setActiveTab] = useState('banner');
  const [bannerUrl, setBannerUrl] = useState('https://example.com/banner.jpg');
  const [offerText, setOfferText] = useState('Limited time offer! Get 30% off.');
  const [contactNumber, setContactNumber] = useState('+91 9876543210');
  const [branches, setBranches] = useState(['Main Branch', 'Downtown Branch', 'Northside Branch']);
  const [newBranch, setNewBranch] = useState('');

  // Save Handlers
  const handleSaveBanner = () => {
    console.log('Saving banner:', bannerUrl);
  };

  const handleSaveOffer = () => {
    console.log('Saving offer:', offerText);
  };

  const handleSaveContact = () => {
    console.log('Saving contact number:', contactNumber);
  };

  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setBranches([...branches, newBranch.trim()]);
      setNewBranch('');
    }
  };

  const handleDeleteBranch = (branchToDelete) => {
    setBranches(branches.filter((b) => b !== branchToDelete));
  };

  return (
    <div className="w-full h-screen bg-gray-100 p-0 m-0 flex flex-col overflow-hidden">
     

      <div className="flex flex-1 overflow-hidden">
       

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs Nav */}
          <div className="flex flex-row border-b border-gray-300 bg-gray-200">
            {[
              { label: 'Banner', value: 'banner' },
              { label: 'Offer', value: 'offer' },
              { label: 'Contact', value: 'contact' },
              { label: 'Branches', value: 'branches' },
            ].map((tab) => (
              <button
                key={tab.value}
                className={`flex-1 py-3 text-center font-medium transition-colors duration-200 ${
                  activeTab === tab.value
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            {activeTab === 'banner' && (
              <>
                

                <div className="bg-white p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6">Edit Banner Image</h3>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Banner Image URL</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300"
                      placeholder="Enter banner image URL"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Banner Preview</label>
                    <div className="border border-gray-300 p-2">
                      <img src={bannerUrl} alt="Banner Preview" className="w-full h-48 object-cover" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      className="bg-gray-800 text-white px-6 py-2 hover:bg-gray-900"
                      onClick={handleSaveBanner}
                    >
                      Save Banner
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'offer' && (
              <div className="bg-white p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-6">Navbar</h3>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Offer Text</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300"
                    placeholder="Enter offer text"
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Offer Preview</label>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <p className="text-lg font-semibold">{offerText}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-200 text-gray-800 px-6 py-2 hover:bg-gray-300"
                    onClick={() => setOfferText('Limited time offer! Get 30% off.')}
                  >
                    Reset
                  </button>
                  <button
                    className="bg-gray-800 text-white px-6 py-2 hover:bg-gray-900"
                    onClick={handleSaveOffer}
                  >
                    Save Offer
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-6">Edit Contact Information</h3>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300"
                    placeholder="Enter contact number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Contact Preview</label>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <p className="text-lg font-semibold">{contactNumber}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-200 text-gray-800 px-6 py-2 hover:bg-gray-300"
                    onClick={() => setContactNumber('+91 9876543210')}
                  >
                    Reset
                  </button>
                  <button
                    className="bg-gray-800 text-white px-6 py-2 hover:bg-gray-900"
                    onClick={handleSaveContact}
                  >
                    Save Contact
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'branches' && (
              <div className="bg-white p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Manage Branches</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Total: {branches.length}</span>
                    <button className="bg-gray-800 text-white px-4 py-1 text-sm hover:bg-gray-900">
                      Export List
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300"
                    placeholder="Enter branch name"
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                  />
                  <button
                    className="bg-gray-800 text-white px-4 py-2 hover:bg-gray-900"
                    onClick={handleAddBranch}
                  >
                    Add Branch
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left font-medium">Branch Name</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Contact</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.map((branch, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-3">
                            <div className="font-medium">{branch}</div>
                            <div className="text-sm text-gray-500">ID: BR{idx+1}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs">Active</span>
                          </td>
                          <td className="p-3 text-sm">+91 12345 6789{idx}</td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteBranch(branch)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomepageEditor;
