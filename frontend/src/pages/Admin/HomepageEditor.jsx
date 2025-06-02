import React, { useState } from 'react';

const HomepageEditor = () => {
  const [bannerUrl, setBannerUrl] = useState('https://example.com/banner.jpg');
  const [offerText, setOfferText] = useState('Limited time offer! Get 30% off.');
  const [activeTab, setActiveTab] = useState('banner');

  const handleSaveBanner = () => {
    console.log('Saving banner:', bannerUrl);
  };

  const handleSaveOffer = () => {
    console.log('Saving offer:', offerText);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Homepage Editor</h2>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'banner' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('banner')}
        >
          Banner Section
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'offer' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('offer')}
        >
          Offer Section
        </button>
      </div>

      {activeTab === 'banner' && (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold">Edit Banner Image</h3>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter banner image URL"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSaveBanner}
          >
            Save Banner
          </button>
        </div>
      )}

      {activeTab === 'offer' && (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold">Edit Offer Text</h3>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter offer text"
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSaveOffer}
          >
            Save Offer
          </button>
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
