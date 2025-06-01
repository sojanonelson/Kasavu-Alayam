import React, { useState, useEffect } from "react";
import {
  PlusCircle, Upload, ListTree, Tag, BookOpen,
  Package, Palette, Ruler, Scissors, Users,
  Loader2, CheckCircle, AlertCircle, X
} from "lucide-react";
import productService from "../../../services/productservice";
import catergoryService from "../../../services/categoryService";

const CreateProduct = () => {
  const [form, setForm] = useState({
    title: "dcd",
    description: "vdvd",
    stockQuantity: "300",
    color: "red",
    category: "",
    subcategory: "",
      price:"",
      sku:"",
    specialPrice: "",
    productDetails: {
      type: "dvd",
      fabric: "cotton",
      idealFor: "male",
      size: "M",
      netQuantity: "1",
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
    catergoryService.getAllCategoriesWithSubcategories()
      .then(res => {
        if (Array.isArray(res)) setCategories(res);
        else setCategories([]);
      })
      .catch(err => {
        console.error(err);
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

      // Check number of images
      if (files.length + images.length > 4) {
        setImageError("You can upload a maximum of 4 images");
        return;
      }

      // Check file sizes (assuming 2MB limit per image)
      const oversizedFiles = files.filter(file => file.size > 2 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setImageError("Some images are too large (max 2MB per image)");
        return;
      }

      setImages(prev => [...prev, ...files].slice(0, 4)); // Ensure max 4 images
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate images
    if (images.length === 0) {
      setImageError("Please upload at least one image");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (key === "productDetails") {
          Object.keys(form.productDetails).forEach(subKey => {
            formData.append(`productDetails[${subKey}]`, form.productDetails[subKey]);
          });
        } else {
          formData.append(key, form[key]);
        }
      });

      images.forEach(img => {
        formData.append("images", img);
      });

      await productService.createProduct(formData);
      setSuccess(true);

      // Reset form
      setForm({
        title: "",
        description: "",
        stockQuantity: "",
        color: "",
        category: "",
        price:"",
        sku:"",
    specialPrice: "",
        subcategory: "",
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

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto  bg-gray-100">
      <div className="w-full max-w-full mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center p-6">
          <PlusCircle className="mr-2 text-indigo-600" />
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-5 rounded-lg w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Tag className="mr-2 text-indigo-500" size={18} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Product Title*</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Cotton T-Shirt"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Stock Quantity*</label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    name="stockQuantity"
                    placeholder="100"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
               <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Price*</label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    name="price"
                    placeholder="100"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
               <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Special Price*</label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    name="specialPrice"
                    placeholder="100"
                    value={form.specialPrice}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
               <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Color*</label>
                <div className="relative">
                  <Palette className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="sku"
                    placeholder="Stock keeping unit.."
                    value={form.sku}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Color*</label>
                <div className="relative">
                  <Palette className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="color"
                    placeholder="e.g., Navy Blue"
                    value={form.color}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Description*</label>
                <textarea
                  name="description"
                  placeholder="Product description..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="bg-gray-50 p-5 rounded-lg w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <ListTree className="mr-2 text-indigo-500" size={18} />
              Category & Subcategory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Category*</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedCategoryId(e.target.value);
                    setForm(prev => ({ ...prev, subcategory: "" }));
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  {(Array.isArray(categories) ? categories : []).map(cat => (
                    <option value={cat._id} key={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Subcategory*</label>
                <select
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  required
                  disabled={!form.category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                >
                  <option value="">{form.category ? "Select Subcategory" : "Select category first"}</option>
                  {(Array.isArray(subcategories) ? subcategories : []).map(sub => (
                    <option value={sub._id} key={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-gray-50 p-5 rounded-lg w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <BookOpen className="mr-2 text-indigo-500" size={18} />
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="type"
                    placeholder="e.g., T-Shirt, Dress"
                    value={form.productDetails.type}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Fabric</label>
                <input
                  type="text"
                  name="fabric"
                  placeholder="e.g., 100% Cotton"
                  value={form.productDetails.fabric}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Ideal For</label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="idealFor"
                    placeholder="e.g., Men, Women, Kids"
                    value={form.productDetails.idealFor}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="size"
                    placeholder="e.g., S, M, L, XL"
                    value={form.productDetails.size}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700">Net Quantity</label>
                <input
                  type="text"
                  name="netQuantity"
                  placeholder="e.g., 1 piece"
                  value={form.productDetails.netQuantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-gray-50 p-5 rounded-lg w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Upload className="mr-2 text-indigo-500" size={18} />
              Product Images
            </h2>

            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG (Max 4 images, 2MB each)
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      For faster website loading, please optimize your images
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {imageError && (
                <div className="flex items-center p-3 bg-red-50 text-red-600 rounded-md">
                  <AlertCircle className="mr-2" size={16} />
                  <span className="text-sm">{imageError}</span>
                </div>
              )}

              {images.length > 0 && (
                <div className="w-full">
                  <p className="text-sm text-gray-500 mb-2">
                    {images.length}/4 images selected ({images.reduce((acc, img) => acc + Math.round(img.size / 1024), 0)}KB total)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
                    {Array.from(images).map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="h-24 w-full object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                          {Math.round(file.size / 1024)}KB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end w-full">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-6 py-2.5 rounded-md text-white font-medium ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              } transition-colors`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Product Added!
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
