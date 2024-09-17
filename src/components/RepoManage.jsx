import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

export default function RepoManage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("car");
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null); // State for image preview
  const [editIndex, setEditIndex] = useState(null); // State for editing

  // Load items from localStorage when component mounts
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(storedItems);
  }, []);

  // Function to save items to localStorage
  const saveItemsToLocalStorage = (items) => {
    localStorage.setItem("items", JSON.stringify(items));
  };

  // Handle form submission to add or update an item
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (picture || preview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newItem = {
          picture: e.target.result || preview, // Use preview when editing image to know the exack image to edit
          name,
          category,
        };

        let updatedItems;
        if (editIndex !== null) {
          // Update existing item
          updatedItems = items.map((item, index) =>
            index === editIndex ? newItem : item
          );
          setEditIndex(null); // Reset editing state
        } else {
          // Add new item
          updatedItems = [...items, newItem];
        }
        //update state in my form and save to local storage and den rest form
        setItems(updatedItems); 
        saveItemsToLocalStorage(updatedItems); 
        resetForm(); 
      };
      //how to convert image to base64
      if (picture) {
        reader.readAsDataURL(picture); // Convert image to Base64
      } else {
        const newItem = {
          picture: preview, //to edit image
          name,
          category,
        };

        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        saveItemsToLocalStorage(updatedItems);
        resetForm();
      }
    }
  };

  // Delete an item from the list and update state den save to localStorage
  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems); 
    saveItemsToLocalStorage(updatedItems);  
  };

  // Edit an existing item
  const handleEdit = (index) => {
    const item = items[index];
    setName(item.name);
    setCategory(item.category);
    setPreview(item.picture); // dis will display image preview for the selected item
    setEditIndex(index); // to make mark index for editing
  };

  // Reset form after submission
  const resetForm = () => {
    setName("");
    setCategory("car");
    setPicture(null);
    setPreview(null); // Clear preview
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setPicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // to set the image preview
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="container">
      <div className="repo-form">
        <h1>Repository Management</h1>
        <hr />
        <form onSubmit={handleFormSubmit}>
          <div className="file">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required={!preview} // Require image only if no preview (new item)
            />
          </div>

          {/* Show image preview when available */}
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview"  />
            </div>
          )}

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="car">Car</option>
            <option value="bags">Bags</option>
            <option value="human">Human</option>
            <option value="school">School</option>
            <option value="others">Others</option>
          </select>
          <button type="submit">
            {editIndex !== null ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>

      <div className="display">
        <h1>To do Lists</h1>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div className="repo-cover" key={index}>
              <img src={item.picture} alt="pic" />
              <p className="name">{item.name}</p>
              <p className="category">{item.category}</p>
              <div className="icons">
                <FaPencilAlt
                  className="pencil"
                  onClick={() => handleEdit(index)}
                />
                <FaTrashAlt
                  className="trash"
                  onClick={() => handleDelete(index)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="noItem">No items in your to-do list.</p>
        )}
      </div>
    </div>
  );
}
