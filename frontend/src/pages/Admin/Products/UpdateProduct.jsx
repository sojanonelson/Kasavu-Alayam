import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../../../services/productservice";
import { Edit, Save, Trash2, Info } from "lucide-react";
import { useToast } from "../../../components/ui/ToastContext";

const TOOLTIP_STYLE = "bg-gray-800 text-white text-xs rounded py-1 px-2 absolute z-20 bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-no-wrap shadow-lg";

const UpdateProduct = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [activeSection, setActiveSection] = useState("details");
  const { showToast } = useToast();
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    stockQuantity: 0,
    color: "",
    type: "",
    fabric: "",
    idealFor: "",
    size: "",
    price: "",
    specialPrice: "",
    netQuantity: "",
    category: "",
    subcategory: "",
  });

  const [images, setImages] = useState([]);
  const [initialImages, setInitialImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        setProductData(res);
        setProductForm({
          title: res.title,
          description: res.description,
          stockQuantity: res.stockQuantity,
          price: res.price,
          specialPrice: res.specialPrice,
          color: res.color,
          type: res.productDetails?.type || "",
          fabric: res.productDetails?.fabric || "",
          idealFor: res.productDetails?.idealFor || "",
          size: res.productDetails?.size || "",
          netQuantity: res.productDetails?.netQuantity || "",
          category: res.category?._id || "",
          subcategory: res.subcategory?._id || "",
        });
        const formattedImages = res.images?.map(img => ({
          url: img.url,
          public_id: img.public_id
        })) || [];
        setImages(formattedImages);
        setInitialImages(formattedImages);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }
    setImages(prev => [...prev, ...files.map(file => ({ file }))]);
  };

  const handleDeleteImage = (index) => {
    if (images.length <= 1) {
      alert("You must have at least one image.");
      setShowConfirmDelete(null);
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
    setShowConfirmDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updates = {
        title: productForm.title,
        description: productForm.description,
        stockQuantity: productForm.stockQuantity,
        price: productForm.price,
        specialPrice: productForm.specialPrice,
        color: productForm.color,
        productDetails: {
          type: productForm.type,
          fabric: productForm.fabric,
          idealFor: productForm.idealFor,
          size: productForm.size,
          netQuantity: productForm.netQuantity
        },
        category: productForm.category,
        subcategory: productForm.subcategory
      };

      await productService.updateProduct(id, updates);
      showToast("Product data updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update product", err);
      showToast("Failed to update product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Handle removed images
      const removedImages = initialImages.filter(initialImg => 
        !images.some(img => img.public_id === initialImg.public_id)
      ).map(img => img.public_id);
      
      if (removedImages.length > 0) {
        formData.append("removeExistingImages", JSON.stringify(removedImages));
      }

      // Append new images
      images.forEach(image => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      await productService.updateProductImages(id, formData);
      showToast("Product cover image updated successfully!", "success");
      
      // Refresh images after update
      const res = await productService.getProductById(id);
      setImages(res.images || []);
      setInitialImages(res.images || []);
    } catch (err) {
      console.error("Failed to update product images", err);
      showToast("Failed to update product images", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productData) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">Loading product details...</div>;
  }

  // Sidebar menu items with icons
  const sections = [
    { key: "details", label: "Product Details", icon: <Edit className="inline mr-2" size={18} /> },
    { key: "images", label: "Product Images", icon: <Save className="inline mr-2" size={18} /> },
    { key: "basic", label: "Basic Information", icon: <Trash2 className="inline mr-2" size={18} /> },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="sticky top-4 h-[calc(100vh-)]  border-r-2 w-1/5 bg-white p-6 flex flex-col">
        <h2 className="text-xl font-extrabold mb-6 tracking-wide text-gray-700 select-none">Update Product</h2>
        <nav className="flex flex-col space-y-3">
          {sections.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`flex items-center px-4 py-3 rounded-lg font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeSection === key 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              aria-current={activeSection === key ? "page" : undefined}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 w-full mx-auto rounded-xl bg-white ">
        {/* Header */}
        {/* <header className="flex items-center mb-8">
          <Edit size={32} className="text-blue-600 mr-3" />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 select-none">Update Product</h1>
        </header> */}

        {/* Sections */}
        {activeSection === "details" && (
          <form onSubmit={handleSubmit} className="space-y-6 w-3/5 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Title" name="title" value={productForm.title} onChange={handleChange} required />
              <FormInput label="Stock Quantity" name="stockQuantity" type="number" value={productForm.stockQuantity} onChange={handleChange} min="0" required />
              <FormInput label="Price" name="price" type="number" value={productForm.price} onChange={handleChange} required />
              <FormInput label="Special Price" name="specialPrice" type="number" value={productForm.specialPrice} onChange={handleChange} min="0" />
              <FormTextarea label="Description" name="description" value={productForm.description} onChange={handleChange} rows={4} required />
              <FormInput label="Color" name="color" value={productForm.color} onChange={handleChange} required />
            </div>
            <PrimaryButton disabled={isSubmitting} loading={isSubmitting} icon={<Save />}>
              Save Changes
            </PrimaryButton>
          </form>
        )}

        {activeSection === "images" && (
          <section className="space-y-8  py-10">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-4">Product Images (Max 4)</label>
              <div className="flex flex-wrap gap-5">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative group  overflow-hidden w-auto h-64 cursor-pointer transform transition-transform "
                    onMouseEnter={() => setHoveredImageIndex(idx)}
                    onMouseLeave={() => {
                      setHoveredImageIndex(null);
                      setShowConfirmDelete(null);
                    }}
                  >
                    <img
                      src={image.file ? URL.createObjectURL(image.file) : image.url}
                      alt={`Product ${idx + 1}`}
                      className="object-cover w-full h-full"
                      draggable={false}
                    />
                    {(hoveredImageIndex === idx) && (
                      <>
                        <div
                          className="absolute inset-0 bg-black bg-opacity-30 rounded-xl"
                          onClick={() => setShowConfirmDelete(idx)}
                          aria-label="Delete Image Overlay"
                        />
                        {showConfirmDelete === idx && (
                          <div className="absolute inset-0 bg-gray-900 bg-opacity-85 rounded-xl flex flex-col items-center justify-center space-y-3 p-2 text-white">
                            <p className="text-center font-semibold">Remove this image?</p>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleDeleteImage(idx)}
                                className="bg-red-600 px-3 py-1 rounded-md text-white font-semibold hover:bg-red-700"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(null)}
                                className="bg-gray-600 px-3 py-1 rounded-md text-white font-semibold hover:bg-gray-700"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Upload New Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
              <p className="mt-1 text-sm text-gray-500">
                {images.length} / 4 images uploaded
              </p>
            </div>

            <PrimaryButton disabled={isSubmitting} loading={isSubmitting} icon={<Save />} onClick={handleImageSubmit}>
              Save Image Changes
            </PrimaryButton>
          </section>
        )}

        {activeSection === "basic" && (
          <form onSubmit={handleSubmit} className="space-y-6  w-3/5  py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Type" name="type" value={productForm.type} onChange={handleChange} />
              <FormInput label="Fabric" name="fabric" value={productForm.fabric} onChange={handleChange} />
              <FormInput label="Ideal For" name="idealFor" value={productForm.idealFor} onChange={handleChange} />
              <FormInput label="Size" name="size" value={productForm.size} onChange={handleChange} />
              <FormInput label="Net Quantity" name="netQuantity" value={productForm.netQuantity} onChange={handleChange} />
              <FormInput label="Category ID" name="category" value={productForm.category} onChange={handleChange} readOnly />
              <FormInput label="Subcategory ID" name="subcategory" value={productForm.subcategory} onChange={handleChange} readOnly />
            </div>
            <PrimaryButton disabled={isSubmitting} loading={isSubmitting} icon={<Save />}>
              Save Changes
            </PrimaryButton>
          </form>
        )}
      </main>
    </div>
  );
};

// Components for form input fields with tooltip on label if provided
const FormInput = ({ label, name, value, onChange, type="text", required=false, min, readOnly=false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTextMap = {
    "Special Price": "Optional price lower than main price",
    "Net Quantity": "Quantity in packaging",
  };
  const tooltipText = tooltipTextMap[label] || null;

  return (
    <div className="relative group">
      <label
        htmlFor={name}
        className="inline-flex items-center mb-1 text-sm font-semibold text-gray-700 cursor-default"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
        {tooltipText && (
          <Info className="ml-1 text-gray-400" size={14} />
        )}
      </label>
      {showTooltip && tooltipText && (
        <div className={TOOLTIP_STYLE}>{tooltipText}</div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        required={required}
        readOnly={readOnly}
        className={`w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      />
    </div>
  );
};

const FormTextarea = ({ label, name, value, onChange, rows=3, required=false }) => {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 text-sm font-semibold text-gray-700 select-none">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className="w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y"
      />
    </div>
  );
};

const PrimaryButton = ({ children, loading = false, icon, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`inline-flex justify-center items-center gap-2 rounded-md px-5 py-3 text-white font-semibold shadow-md
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition duration-200
      ${disabled || loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"}`}
  >
    {loading ? (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    ) : icon ? icon : null}
    {children}
  </button>
);

export default UpdateProduct;
