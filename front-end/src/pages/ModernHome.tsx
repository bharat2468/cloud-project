import React, { Fragment, useEffect, useState } from "react";
import GamesList from "../components/GamesList";
import SearchAndFilter from "../components/SearchAndFilter";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

function ModernHome() {
  const [data, setData] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_PRODUCT_API_URL}/products`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);
        setFilteredData(jsonData);
      } else {
        console.log("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(product => product.category.toLowerCase() === category.toLowerCase());
      setFilteredData(filtered);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    const filtered = data.filter(product => 
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const categories = ["all", ...new Set(data.map(product => product.category))];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[50vh] bg-gradient-to-r from-primary to-secondary">
        <div className="hero-content text-center text-primary-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Game Store</h1>
            <p className="mb-5">
              Discover amazing games at unbeatable prices. From action-packed adventures to relaxing puzzles.
            </p>
            <button className="btn btn-accent btn-lg">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <SearchAndFilter
          searchKeyword={searchKeyword}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
        />

        {/* Results Stats */}
        {!isLoading && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg">
              <span className="font-semibold">{filteredData.length}</span> games found
              {searchKeyword && (
                <span className="text-base-content/70"> for "{searchKeyword}"</span>
              )}
              {selectedCategory !== "all" && (
                <span className="text-base-content/70"> in {selectedCategory}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="stats shadow">
                <div className="stat py-2 px-4">
                  <div className="stat-title text-xs">Total Games</div>
                  <div className="stat-value text-sm">{data.length}</div>
                </div>
                <div className="stat py-2 px-4">
                  <div className="stat-title text-xs">Categories</div>
                  <div className="stat-value text-sm">{categories.length - 1}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Games List Component */}
        <GamesList games={filteredData} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ModernHome;
