import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import websiteSettingService from "../../../services/websiteSettingService";

// Sortable Item Component
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
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const CarouselManager = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
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
      console.error(err);
      setError('Failed to fetch carousel images');
      setCarouselImages([]);
    }
  };

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', title);
      formData.append('subtitle', subtitle);

      await websiteSettingService.uploadCarouselImage(formData);

      setImage(null);
      setTitle('');
      setSubtitle('');

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      await fetchCarouselImages();
    } catch (err) {
      console.error(err);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId) => {
    if (isDraggingRef.current) return;

    try {
      await websiteSettingService.deleteCarouselImage(publicId);
      await fetchCarouselImages();
    } catch (err) {
      console.error(err);
      setError('Failed to delete image');
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

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = carouselImages.findIndex(img => img.public_id === active.id);
    const newIndex = carouselImages.findIndex(img => img.public_id === over.id);

    const newImages = arrayMove(carouselImages, oldIndex, newIndex);
    setCarouselImages(newImages);

    try {
      const orderedPublicIds = newImages.map(img => img.public_id);
      const response = await websiteSettingService.reorderCarouselImages(orderedPublicIds);

      if (!response.success) {
        throw new Error(response.message);
      }

      await fetchCarouselImages();
    } catch (err) {
      console.error('Reorder failed:', err);
      setError(err.message || 'Failed to reorder images');

      setCarouselImages([...carouselImages]);
    }
  };

  return (
    <div className="w-full  p-4 ">
      <div className="max-w-6xl mx-auto bg-white  p-6 h-full overflow-auto">
  
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Image</h3>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !image}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Carousel Images ({carouselImages.length})
          </h3>
          {carouselImages.length > 1 ? (
            <p className="text-sm text-gray-500 mb-4">
              💡 Drag and drop to reorder images
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Upload at least 2 images to enable drag-and-drop reordering
            </p>
          )}
        </div>

        {carouselImages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-2">No carousel images yet</div>
            <div className="text-sm text-gray-400">Upload your first image to get started</div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={carouselImages.map(img => img.public_id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {carouselImages.map((img, index) => (
                  <SortableItem
                    key={img.public_id}
                    id={img.public_id}
                    disabled={carouselImages.length < 2}
                  >
                    <div
                      className={`bg-white p-4 rounded-lg shadow border transition-all duration-200 hover:shadow-md ${
                        carouselImages.length < 2
                          ? 'cursor-default'
                          : 'cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 relative">
                          <img
                            src={img.url}
                            alt={img.title || 'Carousel Image'}
                            className="w-full md:w-48 h-32 object-cover rounded border"
                            draggable={false}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NS4zMzMzIDUxLjMzMzNDODUuMzMzMyA1Ni44NTYxIDgwLjg1NjEgNjEuMzMzMyA3NS4zMzMzIDYxLjMzMzNDNjkuODEwNiA2MS4zMzMzIDY1LjMzMzMgNTYuODU2MSA2NS4zMzMzIDUxLjMzMzNDNjUuMzMzMyA0NS44MTA2IDY5LjgxMDYgNDEuMzMzMyA3NS4zMzMzIDQxLjMzMzNDODAuODU2MSA0MS4zMzMzIDg1LjMzMzMgNDUuODEwNiA4NS4zMzMzIDUxLjMzMzNaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0xNDQgOTZMMTI0IDc2TDg0IDk2SDQ0VjMySDQ0SDE1NlY5Nkg0NFoiIGZpbGw9IiM5QjlCOUIiLz4KPC9zdmc+';
                            }}
                          />
                          {carouselImages.length > 1 && (
                            <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {img.title || 'Untitled'}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {img.subtitle || 'No subtitle'}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleDelete(img.public_id)}
                              disabled={isDragging}
                              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {carouselImages.length > 1 && (
                          <div className="flex-shrink-0 text-gray-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                            </svg>
                          </div>
                        )}
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
  );
};

export default CarouselManager;
