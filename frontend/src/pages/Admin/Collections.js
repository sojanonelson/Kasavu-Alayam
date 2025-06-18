import { useState, useEffect } from "react";
import { Plus, Folder, Trash, Edit3, Save, X, Grid, Tag } from "lucide-react";
import collectionService from "../../services/collectionService";
import categoryService from "../../services/categoryService";

const CollectionManager = () => {
  const [collections, setCollections] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchCollections();
      await fetchCategory();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const fetchCollections = async () => {
    const res = await collectionService.getAllCollection();
    setCollections(Array.isArray(res) ? res : []);
  };

  const fetchCategory = async () => {
    const res = await categoryService.getAllCategories();
    setAllCategories(Array.isArray(res) ? res : []);
  };

  const handleCreate = async () => {
    if (!newTitle || selectedCategories.length === 0)
      return alert("Fill all fields!");
    await collectionService.createCollection({
      title: newTitle,
      categories: selectedCategories,
    });
    setNewTitle("");
    setSelectedCategories([]);
    fetchCollections();
  };

  const handleDelete = async (id) => {
    await collectionService.deleteCollection(id);
    fetchCollections();
  };

  const handleEdit = async () => {
    if (!editTitle.trim()) return alert("Title cannot be empty!");
    await collectionService.updateCollection(editId, { title: editTitle });
    setIsEditing(false);
    setEditId(null);
    fetchCollections();
  };

  const startEditing = (col) => {
    setIsEditing(true);
    setEditTitle(col.title);
    setEditId(col._id);
  };

  const cardColors = [
    'border-l-blue-500 bg-blue-50',
    'border-l-purple-500 bg-purple-50',
    'border-l-green-500 bg-green-50',
    'border-l-orange-500 bg-orange-50',
    'border-l-red-500 bg-red-50',
    'border-l-teal-500 bg-teal-50'
  ];

  const getCardColor = (index) => cardColors[index % cardColors.length];

  const categoryColors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-pink-100 text-pink-800 border-pink-200'
  ];

  const getCategoryColor = (index) => categoryColors[index % categoryColors.length];

  if (isLoading) {
      return (
    <div className="flex flex-col justify-center items-center h-screen text-gray-600 ">
      <div className="text-6xl custom-font animate-pulse">Kasavu Aalayam</div>
      <div className="text-base mt-2 text-gray-800 font-light tracking-wide">Data is being loaded from the server...</div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto p-6">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Grid className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Collection Manager</h1>
          </div>
          <p className="text-gray-600 text-lg">Organize and manage your collections efficiently</p>
          <div className="w-24 h-1 bg-blue-600 rounded-full mt-2"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Create Collection */}
          <div className="lg:col-span-1 w-full">
            <div className="sticky top-6">
              {/* Create Collection Card */}
              <div className="bg-white border border-gray-200 p-6 mb-2">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Create New Collection</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collection Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter collection name"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Select Categories
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto">
                      {allCategories.map((cat, index) => (
                        <label
                          key={cat._id}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={cat._id}
                            checked={selectedCategories.includes(cat._id)}
                            onChange={(e) => {
                              const id = e.target.value;
                              if (selectedCategories.includes(id)) {
                                setSelectedCategories(selectedCategories.filter((c) => c !== id));
                              } else {
                                setSelectedCategories([...selectedCategories, id]);
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <Tag className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCreate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Collection
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Collections */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-gray-700" />
                <h3 className="text-2xl font-semibold text-gray-900">Your Collections</h3>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                  {collections.length}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {collections.map((col, index) => (
                <div key={col._id} className={`bg-white rounded-xl border-l-4 ${getCardColor(index)} border border-gray-200 p-6`}>
                  <div className="flex justify-between items-start mb-4">
                    {isEditing && editId === col._id ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={handleEdit}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditId(null);
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-1">{col.title}</h4>
                          <p className="text-gray-600 text-sm">
                            {col.categories.length} {col.categories.length === 1 ? 'category' : 'categories'}
                          </p>
                        </div>
                        <button
                          onClick={() => startEditing(col)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(col._id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors ml-3"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                  {col.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {col.categories.map((cat, catIndex) => (
                        <span
                          key={cat._id}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(catIndex)}`}
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-gray-400 mb-2">
                        <Tag className="w-8 h-8 mx-auto" />
                      </div>
                      <p className="text-gray-500 text-sm">No categories assigned</p>
                    </div>
                  )}
                </div>
              ))}

              {collections.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Collections Yet</h3>
                  <p className="text-gray-600">Create your first collection to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionManager;
