import React from "react";

interface SearchAndFilterProps {
  searchKeyword: string;
  selectedCategory: string;
  categories: string[];
  onSearch: (keyword: string) => void;
  onCategoryChange: (category: string) => void;
}

function SearchAndFilter({
  searchKeyword,
  selectedCategory,
  categories,
  onSearch,
  onCategoryChange,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="form-control flex-1">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search games..." 
            className="input input-bordered flex-1"
            value={searchKeyword}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="btn btn-square btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="form-control">
        <select 
          className="select select-bordered w-full lg:w-auto"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

     
    </div>
  );
}

export default SearchAndFilter;
