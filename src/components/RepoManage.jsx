import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

export default function RepoManage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("car");
  const [picture, setPicture] = useState(null);

  // Load items from localStorage when component mounts
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(storedItems);
  }, []);

  // Function to save items to localStorage
  //items argument will not let it disapear when reload
  const saveItemsToLocalStorage = (items) => {
    localStorage.setItem("items", JSON.stringify(items));
  };

  // Handle form submission to add a new item
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (picture) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newItem = {
          picture: e.target.result,
          name,
          category,
        };

        const updatedItems = [...items, newItem];
        setItems(updatedItems); // Update state
        saveItemsToLocalStorage(updatedItems); // Save to localStorage
        resetForm(); // Reset form
      };
      reader.readAsDataURL(picture); // Convert image to Base64 by js
    }
  };



  // Delete an item from the list
  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems); // Update state
    saveItemsToLocalStorage(updatedItems); // Save to localStorage
  };

  // Edit an existing item
  const handleEdit = (index) => {
    const item = items[index];
    setName(item.name);
    setCategory(item.category);

    // Remove the item from the list to allow editing
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
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
              onChange={(e) => setPicture(e.target.files[0])}
              required
            />
          </div>
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
          <button type="submit">Add Item</button>
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
