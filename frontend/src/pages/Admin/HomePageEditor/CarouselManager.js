import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import websiteSettingService from "../../../services/websiteSettingService";

const SortableItem = ({ id, children, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? "default" : "grab",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const CarouselManager = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false); // State to track if dragging is enabled
  const [isDragging,setIsDragging]=useState(false)


  const isDraggingRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchCarouselImages = async () => {
    try {
      const images = await websiteSettingService.getCarouselImages();
      setCarouselImages(images || []);
    } catch (err) {
      setError("Failed to fetch carousel images");
      setCarouselImages([]);
    }
  };

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      await websiteSettingService.uploadCarouselImage(formData);
      setImage(null);
      setTitle("");
      setSubtitle("");
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      await fetchCarouselImages();
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId) => {
    if (isDraggingRef.current) return;

    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }
    try {
      await websiteSettingService.deleteCarouselImage(publicId);
      await fetchCarouselImages();
    } catch (err) {
      setError("Failed to delete image");
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    isDraggingRef.current = true;
  };

  const handleDragEnd = async (event) => {
    setIsDragging(false);
    isDraggingRef.current = false;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = carouselImages.findIndex((img) => img.public_id === active.id);
    const newIndex = carouselImages.findIndex((img) => img.public_id === over.id);
    const newImages = arrayMove(carouselImages, oldIndex, newIndex);
    setCarouselImages(newImages);
    try {
      const orderedPublicIds = newImages.map((img) => img.public_id);
      const response = await websiteSettingService.reorderCarouselImages(orderedPublicIds);
      if (!response.success) throw new Error(response.message);
      await fetchCarouselImages();
    } catch (err) {
      setError("Failed to reorder images");
      setCarouselImages([...carouselImages]);
    }
  };

  const toggleDragEnabled = () => {
    setIsDraggingEnabled(!isDraggingEnabled);
  };

  return (
    <div className="lg:h-[70vh] select-none w-full bg-white p-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold text-red-800 mb-8 text-center">Carousel Manager</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-1 bg-white border border-red-200 rounded-xl p-6 ">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Upload Image</h2>
            {error && (
              <div className="mb-4 text-red-800 bg-red-100 p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full file:px-4 file:py-2 file:bg-red-100 file:text-red-700 file:rounded file:border-0"
              />
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-red-200 rounded-md focus:ring-2 focus:ring-red-400"
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full p-3 border border-red-200 rounded-md focus:ring-2 focus:ring-red-400"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={loading || !image}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
          {/* Carousel Images */}
          <div className="lg:col-span-2 bg-white border border-red-200 rounded-xl p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-700">Carousel Images</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDragEnabled}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isDraggingEnabled ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 hover:bg-gray-400 text-gray-700"}`}
                >
                  {isDraggingEnabled ? "Disable Drag" : "Enable Drag"}
                </button>
                {carouselImages.length > 1 && isDraggingEnabled && (
                  <p className="text-sm text-red-500">Drag to reorder</p>
                )}
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {carouselImages.length === 0 ? (
                <div className="text-center text-red-500 py-10">
                  No images uploaded yet.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={carouselImages.map((img) => img.public_id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {carouselImages.map((img) => (
                        <SortableItem
                          key={img.public_id}
                          id={img.public_id}
                          disabled={!isDraggingEnabled || carouselImages.length < 2}
                        >
                          <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 shadow transition-all">
                            <img
                              src={img.url}
                              alt={img.title}
                              className="w-24 h-16 object-cover rounded shadow-md"
                            />
                            <div className="flex-grow overflow-hidden">
                              <h3 className="font-medium text-red-700 truncate">
                                {img.title || "Untitled"}
                              </h3>
                              <p className="text-sm text-red-500 truncate">
                                {img.subtitle || "No subtitle"}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(img.public_id);
                              }}
                              disabled={isDraggingEnabled}
                              aria-label={`Delete ${img.title || 'image'}`}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-semibold shadow hover:shadow-md"
                            >
                              Delete
                            </button>
                            <div className="text-red-300">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                              </svg>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselManager;
