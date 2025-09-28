import React from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface GamesListProps {
  games: Product[];
  isLoading: boolean;
}

function GamesList({ games, isLoading }: GamesListProps) {
  const handleViewDetails = (productId: string) => {
    // Store product ID in localStorage for backup
    localStorage.setItem("productID", productId);
    // Navigate with product ID as URL parameter
    window.location.href = `/product-info?id=${productId}`;
  };

  const addToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_CART_API_URL}/cart/${product._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      });

      if (response.ok) {
        // Show success notification
        const toast = document.createElement('div');
        toast.className = 'toast toast-top toast-end';
        toast.innerHTML = `
          <div class="alert alert-success">
            <span>Added to cart successfully!</span>
          </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Show error notification
      const toast = document.createElement('div');
      toast.className = 'toast toast-top toast-end';
      toast.innerHTML = `
        <div class="alert alert-error">
          <span>Failed to add to cart!</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg">Loading amazing games...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-2xl font-bold mb-2">No games found</h3>
        <p className="text-base-content/70 mb-6">Try adjusting your search or filter criteria</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((product) => (
        <div key={product._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <figure className="px-4 pt-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="rounded-xl h-48 w-full object-cover cursor-pointer"
              onClick={() => handleViewDetails(product._id)}
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
              <div className="badge badge-outline badge-lg">{product.category}</div>
              <div className="text-2xl font-bold text-primary">
                {product.price === 0 ? "FREE" : `$${product.price}`}
              </div>
            </div>
            
            <div className="card-actions justify-between mt-4">
              <button 
                className="btn btn-outline btn-sm flex-1"
                onClick={() => addToCart(product)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V5a2 2 0 00-2-2H9a2 2 0 00-2 2v3"></path>
                </svg>
                Add to Cart
              </button>
              
              <button 
                className="btn btn-primary btn-sm flex-1 ml-2"
                onClick={() => handleViewDetails(product._id)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GamesList;
