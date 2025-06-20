import React, { useEffect, useState } from "react";
import axios from "axios";
import websiteSettingService from "../../services/websiteSettingService";
import Cropper from "react-easy-crop";
import Modal from "react-modal";

const HomepageEditor = () => {
  const [activeTab, setActiveTab] = useState("banner");
  const [contactNumber, setContactNumber] = useState("");
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [carouselImages, setCarouselImages] = useState([]);
  const [maintenanceStart, setMaintenanceStart] = useState("");
  const [maintenanceEnd, setMaintenanceEnd] = useState("");
  const [alertAllCustomers, setAlertAllCustomers] = useState(false);
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [websetting, setWebsetting] = useState({ maintenanceTime: {} });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await websiteSettingService.getWebSettings();
        setWebsetting(res || { maintenanceTime: {} });
        const setting = res || {};

        if (setting.carouselImages?.length) {
          const formattedImages = setting.carouselImages.map((img) => ({
            file: null,
            url: img.url || img,
            title: img.title || "",
            subtitle: img.subtitle || "",
            public_id: img.public_id || null
          }));
          setCarouselImages(formattedImages);
        }

        if (setting.contact?.phone) setContactNumber(setting.contact.phone);
        if (setting.branches?.length) {
          setBranches(setting.branches.map((b) => b?.place || b));
        }
        if (setting.maintenanceTime) {
          setMaintenanceStart(setting.maintenanceTime.start || "");
          setMaintenanceEnd(setting.maintenanceTime.end || "");
          setAlertAllCustomers(setting.maintenanceTime.alertAll || false);
          setUnderMaintenance(setting.maintenanceTime.underMaintenance || false);
        }
      } catch (err) {
        console.error("Failed to fetch website settings:", err);
        alert("Failed to load website settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();

    return () => {
      carouselImages.forEach((img) => {
        if (img.file && img.url) URL.revokeObjectURL(img.url);
      });
    };
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return "Not scheduled";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleSaveBanner = async () => {
    try {
      const imagesToUpload = carouselImages.filter(img => img.file);
      if (imagesToUpload.length === 0) {
        return alert("No new images selected!");
      }

      const formData = new FormData();
      carouselImages.forEach((img, index) => {
        if (img.file) {
          formData.append("carouselImages", img.file);
          formData.append(`titles[${index}]`, img.title);
          formData.append(`subtitles[${index}]`, img.subtitle);
        }
      });

      const res = await websiteSettingService.uploadCarouselImages(formData);
      setCarouselImages(res.carouselImages.map(img => ({
        file: null,
        url: img.url,
        title: img.title,
        subtitle: img.subtitle,
        public_id: img.public_id
      })));
      alert("Banner images saved successfully!");
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner images!");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      title: "",
      subtitle: "",
      public_id: null
    }));
    setCarouselImages([...carouselImages, ...newImages]);
  };

  const handleTitleSubtitleChange = (index, field, value) => {
    const updated = [...carouselImages];
    updated[index][field] = value;
    setCarouselImages(updated);
  };

  const handleDeleteImage = async (index) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const imageToDelete = carouselImages[index];
      if (imageToDelete.public_id) {
        await websiteSettingService.deleteCarouselImage(imageToDelete.public_id);
      }

      const newImages = [...carouselImages];
      if (newImages[index].url) {
        URL.revokeObjectURL(newImages[index].url);
      }
      newImages.splice(index, 1);
      setCarouselImages(newImages);
      alert("Image deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    }
  };

  const handleSaveContact = async () => {
    try {
      await websiteSettingService.updateContactInfo({
        phone: contactNumber,
        email: "support@example.com",
        location: "Some Address",
      });
      alert("Contact saved successfully!");
    } catch (err) {
      console.error("Error saving contact:", err);
      alert("Failed to save contact!");
    }
  };

  const handleSaveBranches = async () => {
    try {
      const branchesPayload = branches.map((branch) => ({
        place: branch,
        location: "Not Specified",
      }));

      await websiteSettingService.updateBranches({
        branches: branchesPayload,
      });
      alert("Branches saved successfully!");
    } catch (err) {
      console.error("Error saving branches:", err);
      alert("Failed to save branches!");
    }
  };

  const handleSaveMaintenance = async () => {
    try {
      await websiteSettingService.updateMaintenanceStatus({
        underMaintenance,
        maintenanceTimeStart: maintenanceStart,
        maintenanceTimeEnd: maintenanceEnd,
        alertAll: alertAllCustomers,
      });
      alert("Maintenance settings saved successfully!");
    } catch (err) {
      console.error("Error saving maintenance info:", err);
      alert("Failed to save maintenance settings!");
    }
  };

  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setBranches([...branches, newBranch.trim()]);
      setNewBranch("");
    }
  };

  const handleDeleteBranch = (branchToDelete) => {
    if (window.confirm(`Are you sure you want to delete '${branchToDelete}'?`)) {
      setBranches(branches.filter((b) => b !== branchToDelete));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <div className="flex border-b">
        {["banner", "contact", "maintenance"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 font-semibold ${activeTab === tab ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {activeTab === "banner" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-6">Edit Banner Images</h3>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Add New Images</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {carouselImages.map((imgObj, index) => (
                <div key={index} className="relative border p-2 rounded bg-white shadow">
                  {imgObj.url ? (
                    <img 
                      src={imgObj.url} 
                      alt={`carousel-${index}`} 
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x150?text=Image+Not+Found';
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                      <span>No Image</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    title="Delete image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={imgObj.title}
                        onChange={(e) => handleTitleSubtitleChange(index, "title", e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Image title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={imgObj.subtitle}
                        onChange={(e) => handleTitleSubtitleChange(index, "subtitle", e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Image subtitle"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button 
                onClick={handleSaveBanner} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={!carouselImages.some(img => img.file)}
              >
                Save Carousel
              </button>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Branches</label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-l"
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    placeholder="New branch location"
                  />
                  <button
                    onClick={handleAddBranch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                
                <ul className="border rounded divide-y">
                  {branches.map((branch, index) => (
                    <li key={index} className="p-2 flex justify-between items-center">
                      <span>{branch}</span>
                      <button
                        onClick={() => handleDeleteBranch(branch)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button 
                onClick={handleSaveContact}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Save Contact
              </button>
              <button 
                onClick={handleSaveBranches}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Save Branches
              </button>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-6">Maintenance Settings</h3>
            
            {websetting.maintenanceTime?.start && (
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <p className="mb-2 font-medium">Current Maintenance Window:</p>
                <p className="mb-1">Start Time: {formatDateTime(websetting.maintenanceTime.start)}</p>
                <p>End Time: {formatDateTime(websetting.maintenanceTime.end)}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={underMaintenance}
                  onChange={(e) => setUnderMaintenance(e.target.checked)}
                  className="mr-2 h-5 w-5"
                  id="underMaintenance"
                />
                <label htmlFor="underMaintenance" className="font-medium">Under Maintenance</label>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Start Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2 border rounded" 
                  value={maintenanceStart}  
                  min={new Date().toISOString().slice(0, 16)} 
                  onChange={(e) => setMaintenanceStart(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">End Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2 border rounded" 
                  min={new Date().toISOString().slice(0, 16)} 
                  value={maintenanceEnd} 
                  onChange={(e) => setMaintenanceEnd(e.target.value)} 
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={alertAllCustomers} 
                  onChange={(e) => setAlertAllCustomers(e.target.checked)} 
                  className="mr-2 h-5 w-5"
                  id="alertAll"
                />
                <label htmlFor="alertAll">Alert all customers</label>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button 
                onClick={handleSaveMaintenance} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Save Maintenance Settings
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={cropModalOpen}
        onRequestClose={() => setCropModalOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-white rounded-lg overflow-hidden w-[90vw] h-[90vh] max-w-4xl">
          {selectedImage && (
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
            />
          )}
          <div className="p-4 flex justify-between">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setCropModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Crop
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomepageEditor;