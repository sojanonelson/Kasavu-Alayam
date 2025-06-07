import React, { useState, useEffect } from "react";
import {
  PlusCircle, Upload, ListTree, Tag, BookOpen,
  Package, Palette, Ruler, Scissors, Users,
  Loader2, CheckCircle, AlertCircle, X
} from "lucide-react";
import productService from "../../../services/productservice";
import categoryService from "../../../services/categoryService";

const CreateProduct = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    stockQuantity: "",
    color: "",
    category: "",
    subcategory: "",
    price: "",
    sku: "",
    specialPrice: "",
    productDetails: {
      type: "",
      fabric: "",
      idealFor: "",
      size: "",
      netQuantity: "",
    },
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    categoryService.getAllCategoriesWithSubcategories()
      .then(res => {
        if (Array.isArray(res)) setCategories(res);
        else setCategories([]);
      })
      .catch(err => {
        console.error("Failed to fetch categories", err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    const cat = categories.find(cat => cat._id === selectedCategoryId);
    if (cat) setSubcategories(cat.subcategories || []);
    else setSubcategories([]);
  }, [selectedCategoryId, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.productDetails) {
      setForm(prev => ({
        ...prev,
        productDetails: { ...prev.productDetails, [name]: value },
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImageError("");
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (files.length + images.length > 4) {
        setImageError("You can upload a maximum of 4 images.");
        return;
      }

      const oversizedFiles = files.filter(file => file.size > 2 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setImageError("Some images exceed the 2MB size limit.");
        return;
      }

      setImages(prev => [...prev, ...files].slice(0, 4));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setImageError("Please upload at least one image.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (key === "productDetails") {
          Object.entries(form.productDetails).forEach(([subKey, val]) => {
            formData.append(`productDetails[${subKey}]`, val);
          });
        } else {
          formData.append(key, form[key]);
        }
      });

      images.forEach(img => formData.append("images", img));

      await productService.createProduct(formData);
      setSuccess(true);

      // Reset form
      setForm({
        title: "",
        description: "",
        stockQuantity: "",
        color: "",
        category: "",
        subcategory: "",
        price: "",
        sku: "",
        specialPrice: "",
        productDetails: {
          type: "",
          fabric: "",
          idealFor: "",
          size: "",
          netQuantity: "",
        },
      });
      setImages([]);
      setSelectedCategoryId("");

      // Remove success after 3.5 seconds
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      alert(err.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full  bg-white  border border-gray-200 overflow-hidden relative">
        <header className="bg-red-600 text-white py-6 px-8 flex items-center space-x-3">
          <PlusCircle size={36} className="text-red-300" />
          <h1 className="text-3xl font-bold tracking-wider select-none">Add New Product</h1>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-12 relative z-10">
          {/* Basic Information */}
          <section className="space-y-5">
            <h2 className="flex items-center space-x-3 text-black text-2xl font-semibold tracking-tight border-b border-gray-300 pb-2 select-none">
              <Tag size={28} className="text-gray-700" />
              <span>Basic Information</span>
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <InputGroup label="Product Title" required>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>

              <InputGroup label="Stock Quantity" required icon={<Package size={20} className="text-gray-500" />}>
                <input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>

              <InputGroup label="Price" required icon={<Package size={20} className="text-gray-500" />}>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>

              <InputGroup label="Special Price" icon={<Package size={20} className="text-gray-500" />}>
                <input
                  type="number"
                  name="specialPrice"
                  value={form.specialPrice}
                  onChange={handleChange}
                  min="0"
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>

              <InputGroup label="SKU" icon={<Palette size={20} className="text-gray-500" />}>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>

              <InputGroup label="Color" required icon={<Palette size={20} className="text-gray-500" />}>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-black font-semibold mb-2 tracking-wide select-none">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-4 focus:ring-green-400 px-4 py-3 resize-none text-black placeholder-gray-400 shadow-sm transition duration-200"
                />
              </div>
            </div>
          </section>

          {/* Category & Subcategory */}
          <section className="space-y-5">
            <h2 className="flex items-center space-x-3 text-black text-2xl font-semibold tracking-tight border-b border-gray-300 pb-2 select-none">
              <ListTree size={28} className="text-gray-700" />
              <span>Category & Subcategory</span>
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <SelectGroup label="Category" required>
                <select
                  name="category"
                  value={form.category}
                  onChange={e => {
                    handleChange(e);
                    setSelectedCategoryId(e.target.value);
                    setForm(prev => ({ ...prev, subcategory: "" }));
                  }}
                  required
                  className={selectClass}
                  aria-label="Select category"
                >
                  <option value="" disabled>Choose a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </SelectGroup>

              <SelectGroup label="Subcategory" required>
                <select
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  disabled={!form.category}
                  required
                  className={selectClass + (form.category ? "" : " bg-gray-100 cursor-not-allowed")}
                  aria-label="Select subcategory"
                >
                  {!form.category && <option value="">Select category first</option>}
                  {form.category && <option value="">Choose a subcategory</option>}
                  {subcategories.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </SelectGroup>
            </div>
          </section>

          {/* Product Details */}
          <section className="space-y-5">
            <h2 className="flex items-center space-x-3 text-black text-2xl font-semibold tracking-tight border-b border-gray-300 pb-2 select-none">
              <BookOpen size={28} className="text-gray-700" />
              <span>Product Details</span>
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <InputGroup label="Type" icon={<Scissors size={20} className="text-gray-500" />}>
                <input
                  type="text"
                  name="type"
                  value={form.productDetails.type}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>
              <InputGroup label="Fabric">
                <input
                  type="text"
                  name="fabric"
                  value={form.productDetails.fabric}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>
              <InputGroup label="Ideal For" icon={<Users size={20} className="text-gray-500" />}>
                <input
                  type="text"
                  name="idealFor"
                  value={form.productDetails.idealFor}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>
              <InputGroup label="Size" icon={<Ruler size={20} className="text-gray-500" />}>
                <input
                  type="text"
                  name="size"
                  value={form.productDetails.size}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>
              <InputGroup label="Net Quantity">
                <input
                  type="text"
                  name="netQuantity"
                  value={form.productDetails.netQuantity}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </InputGroup>
            </div>
          </section>

          {/* Image Upload */}
          <section className="space-y-5">
            <h2 className="flex items-center space-x-3 text-black text-2xl font-semibold tracking-tight border-b border-gray-300 pb-2 select-none">
              <Upload size={28} className="text-gray-700" />
              <span>Product Images</span>
            </h2>

            <div className="border-4 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer p-6 flex flex-col items-center justify-center">
              <label
                htmlFor="uploadImages"
                className="flex flex-col items-center justify-center cursor-pointer"
                aria-label="Upload product images"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-4 animate-pulse" />
                <p className="text-black font-semibold mb-1 text-lg select-none">Click to upload or drag & drop</p>
                <p className="text-gray-500 text-sm select-none">PNG, JPG, JPEG (Max 4 images | 2MB each)</p>
                <input
                  type="file"
                  id="uploadImages"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {imageError && (
              <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded shadow animate-shake select-none">
                <AlertCircle size={20} />
                <span>{imageError}</span>
              </div>
            )}

            {images.length > 0 && (
              <>
                <p className="text-black font-semibold text-sm select-none">{images.length}/4 images selected ({images.reduce((acc, img) => acc + Math.round(img.size / 1024), 0)} KB total)</p>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative  overflow-hidden  transform hover:scale-[1.05] transition cursor-pointer border border-gray-300"
                      title={file.name}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="h-64 w-full object-cover select-none"
                        draggable={false}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Remove image ${file.name}`}
                      >
                        <X size={16} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 text-white text-xs py-1 text-center select-none">
                        {Math.round(file.size / 1024)} KB
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black"} flex items-center gap-3  px-10 py-3 font-bold text-white shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-400 select-none`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  <span>Product Added!</span>
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success Message Overlay */}
        {success && (
          <div className="absolute inset-0 bg-green-100 bg-opacity-90 flex items-center justify-center z-20 rounded-xl">
            <div className="bg-green-600 text-white px-10 py-6 rounded-lg shadow-lg flex items-center space-x-3 select-none">
              <CheckCircle size={32} />
              <span className="text-2xl font-semibold">Product Created Successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Shared styling for inputs
const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-black placeholder-transparent focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-200 shadow-sm";

// Shared select styling
const selectClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-black bg-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-200 shadow-sm";

// Input group wrapper with label
const InputGroup = ({ label, icon, children, required }) => (
  <div className="space-y-1">
    <label
      className="flex items-center gap-2 text-black font-semibold text-sm uppercase tracking-widest select-none"
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);

// Select group wrapper with label
const SelectGroup = ({ label, children, required }) => (
  <div className="space-y-1">
    <label
      className="text-black font-semibold text-sm uppercase tracking-widest select-none"
    >
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);

export default CreateProduct;

