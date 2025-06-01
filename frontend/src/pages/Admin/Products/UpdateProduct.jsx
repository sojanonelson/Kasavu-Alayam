import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../../../services/productservice";
import { Edit, Save, Trash2 } from "lucide-react";
import { useToast } from "../../../components/ui/ToastContext";

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
       price:"",
    specialPrice: "",
    netQuantity: "",
    category: "",
    subcategory: "",
  });

  const [images, setImages] = useState([]);
  const [initialImages, setInitialImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        setProductData(res);
        setProductForm({
          title: res.title,
          description: res.description,
          stockQuantity: res.stockQuantity,
          price:res.price,
    specialPrice:res.specialPrice,
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
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
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
    // Add success notification here
  } catch (err) {
    console.error("Failed to update product", err);
    // Add error notification here
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
     
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  console.log("Data D:",productForm)
  return (
    <div className="flex w-full mx-auto min-h-screen p-4">
      <aside className="w-1/5 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Sections</h2>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => setActiveSection("details")}
              className={`w-full text-left p-2 rounded transition ${
                activeSection === "details"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Product Details
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveSection("images")}
              className={`w-full text-left p-2 rounded transition ${
                activeSection === "images"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Product Images
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveSection("basic")}
              className={`w-full text-left p-2 rounded transition ${
                activeSection === "basic"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Basic Information
            </button>
          </li>
        </ul>
      </aside>

      <main className="w-3/4 p-4 ml-4 bg-white rounded-lg ">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Edit className="mr-2" /> Edit Product
        </h1>

        {activeSection === "details" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={productForm.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={productForm.stockQuantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  required
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  min=""
                  required
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special price
                </label>
                <input
                  type="number"
                  name="specialPrice"
                  value={productForm.specialPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={productForm.color}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Save  className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </form>
        )}

        {activeSection === "images" && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 4)
              </label>
              <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.file ? URL.createObjectURL(image.file) : image.url}
                      alt={`Product ${index}`}
                      className="w-40 h-40 object-cover rounded-lg shadow"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                {images.length} of 4 images uploaded
              </p>
            </div>
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Save className="mr-2" /> Save Image Changes
                </>
              )}
            </button>
          </div>
        )}

        {activeSection === "basic" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={productForm.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric
                </label>
                <input
                  type="text"
                  name="fabric"
                  value={productForm.fabric}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ideal For
                </label>
                <input
                  type="text"
                  name="idealFor"
                  value={productForm.idealFor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={productForm.size}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Net Quantity
                </label>
                <input
                  type="text"
                  name="netQuantity"
                  value={productForm.netQuantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category ID
                </label>
                <input
                  type="text"
                  name="category"
                  value={productForm.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory ID
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={productForm.subcategory}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Save className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default UpdateProduct;