import React, { Fragment, useEffect, useState } from "react";

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
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="form-control flex-1">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Search games..." 
                className="input input-bordered flex-1"
                value={searchKeyword}
                onChange={(e) => handleSearch(e.target.value)}
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
              className="select select-bordered"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((product) => (
              <div key={product._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className="px-4 pt-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="rounded-xl h-48 w-full object-cover"
                    // onError={(e) => {
                    //   e.currentTarget.src = "https://via.placeholder.com/300x200?text=Game+Image";
                    // }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg">
                    {product.name}
                    {product.price === 0 && <div className="badge badge-success">FREE</div>}
                  </h2>
                  <p className="text-sm text-base-content/70 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="badge badge-outline">{product.category}</div>
                    <div className="text-2xl font-bold text-primary">
                      {product.price === 0 ? "FREE" : `$${product.price}`}
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        localStorage.setItem("productID", product._id);
                        window.location.href = "/product-info";
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredData.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">No games found</h3>
            <p className="text-base-content/70">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModernHome;
