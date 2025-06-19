"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants/constant";

const API_URL = `${BASE_URL}/api/admin/categories`;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setCategories);
  }, [token]);

  const handleAddClick = () => {
    setEditing(null);
    setForm({ name: "", description: "", image: "" });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, description: cat.description, image: cat.image });
    setImageFile(null);
    setImagePreview(cat.image || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ name: "", description: "", image: "" });
    setImageFile(null);
    setImagePreview("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCategories(categories.filter((c) => c._id !== id));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview("");
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editing) {
      // For editing, we'll use JSON if no new image, or FormData if there's a new image
      if (imageFile) {
        // Send with FormData if there's a new image file
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('image', imageFile);
        
        // Debug: Log what's being sent
        console.log('Sending FormData for edit with:', {
          name: form.name,
          description: form.description,
          imageFile: imageFile.name,
          imageSize: imageFile.size
        });
        
        const res = await fetch(`${API_URL}/${editing}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        // Debug: Log the response
        console.log('Edit response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Edit server error:', errorText);
          throw new Error(`Failed to update category: ${res.status} ${errorText}`);
        }
        
        const updated = await res.json();
        console.log('Edit success response:', updated);
        setCategories(categories.map((c) => (c._id === editing ? updated : c)));
      } else {
        // Send as JSON if no new image file
        const res = await fetch(`${API_URL}/${editing}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            image: form.image
          }),
        });
        const updated = await res.json();
        setCategories(categories.map((c) => (c._id === editing ? updated : c)));
      }
      
      setEditing(null);
      setForm({ name: "", description: "", image: "" });
      setImageFile(null);
      setImagePreview("");
      setShowModal(false);
    } else {
      // For creating new category
      if (imageFile) {
        // Send with FormData if there's an image file
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('image', imageFile);
        
        // Debug: Log what's being sent
        console.log('Sending FormData with:', {
          name: form.name,
          description: form.description,
          imageFile: imageFile.name,
          imageSize: imageFile.size
        });
        
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        // Debug: Log the response
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server error:', errorText);
          throw new Error(`Failed to add category: ${res.status} ${errorText}`);
        }
        
        const result = await res.json();
        console.log('Success response:', result);
      } else {
        // Send as JSON if no image file
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            image: form.image
          }),
        });
        if (!res.ok) throw new Error("Failed to add category");
      }
      
      // Refresh the categories list
      fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setCategories);
      
      setForm({ name: "", description: "", image: "" });
      setImageFile(null);
      setImagePreview("");
      setShowModal(false);
    }
  };

  return (
    <div className="mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">
        Category Management
      </h1>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddClick}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <th className="py-3 px-6 text-left rounded-tl-lg">Image</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b last:border-b-0 hover:bg-purple-50 transition-colors"
                >
                  <td className="py-3 px-6">
                    {cat.image && (
                      <img
                        src={`${BASE_URL}${cat.image}`}
                        alt={cat.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6">{cat.name}</td>
                  <td className="py-3 px-6">{cat.description}</td>
                  <td className="py-3 px-6 flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-pink-100 text-pink-700 px-3 py-1 rounded-lg font-semibold hover:bg-pink-200 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {editing ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-3 relative">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  {!imagePreview && form.image && (
                    <div className="mt-3 relative">
                      <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                      <div className="relative inline-block">
                        <img
                          src={form.image}
                          alt="Current"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {editing ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
