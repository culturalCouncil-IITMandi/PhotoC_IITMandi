import React, { useState } from "react";
import "./FilterTab.css";

const FilterTab = () => {
  const [selectedFilter, setSelectedFilter] = useState("");

  return (
    <nav className="filter-tab">
      {/* Dropdown Filter */}
      <div className="filter-group">
        <label className="filter-label">Filter By</label>
        <select
          className="filter-dropdown"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="">Select Filter</option>
          <option value="recent">Recent Events</option>
          <option value="popular">Popular Events</option>
          <option value="featured">Featured Events</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="filter-group">
        <label className="filter-label">Event Name</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search events..."
        />
      </div>

      {/* Date Picker */}
      <div className="filter-group">
        <label className="filter-label">Date</label>
        <input type="date" className="filter-input" />
      </div>

      {/* Image Uploader */}
      <div className="filter-group">
        <label className="filter-label">Upload Image</label>
        <input type="file" className="filter-file" accept="image/*" />
      </div>

      {/* Apply Filters Button */}
      <button className="filter-button">Apply</button>
    </nav>
  );
};

export default FilterTab;
