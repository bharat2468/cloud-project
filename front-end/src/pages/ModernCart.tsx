import { Fragment, useEffect, useState } from "react";

interface CartProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface CartData {
  total: number;
  Products: CartProduct[];
}

function ModernCart() {
  const [cartData, setCartData] = useState<CartData>({ total: 0, Products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_CART_API_URL}/cart`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartData(data);
        } else {
          if (response.status === 401) {
            setError("Session expired. Please login again.");
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          } else {
            setError("Failed to load cart data.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const removeFromCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_CART_API_URL}/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        }
      });

      if (response.ok) {
        // Refresh cart data by fetching again
        const refreshResponse = await fetch(`${import.meta.env.VITE_CART_API_URL}/cart`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });
        
        if (refreshResponse.ok) {
          const updatedData = await refreshResponse.json();
          setCartData(updatedData);
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Your Gaming Cart</h1>
            <p className="text-base-content/70">
              {cartData.Products.length > 0 
                ? `${cartData.Products.length} items in your cart`
                : "Your cart is empty"
              }
            </p>
          </div>

          {cartData.Products.length === 0 ? (
            // Empty Cart State
            <div className="text-center py-16">
              <div className="mb-8">
                <svg className="mx-auto h-24 w-24 text-base-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-base-content/60 mb-8">Looks like you haven't added any games to your cart yet.</p>
              <a href="/" className="btn btn-primary btn-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                </svg>
                Continue Shopping
              </a>
            </div>
          ) : (
            // Cart with Items
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Cart Items</h2>
                    
                    <div className="space-y-4">
                      {cartData.Products.map((product) => (
                        <div key={product._id} className="flex items-center gap-4 p-4 border border-base-300 rounded-lg hover:shadow-md transition-shadow">
                          <div className="avatar">
                            <div className="w-20 h-20 rounded-lg">
                              <img src={product.image} alt={product.name} className="object-cover" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-base-content/60">{product.category}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-2xl font-bold text-primary">${product.price}</span>
                              <button 
                                className="btn btn-error btn-sm"
                                onClick={() => removeFromCart(product._id)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card bg-base-100 shadow-xl sticky top-8">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${cartData.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-success">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                      <div className="divider my-2"></div>
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-primary">${cartData.total}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                      <a href="/checkout" className="btn btn-primary btn-lg w-full">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        Proceed to Checkout
                      </a>
                      
                      <a href="/" className="btn btn-outline w-full">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                        </svg>
                        Continue Shopping
                      </a>
                    </div>

                    {/* Promo Code */}
                    <div className="mt-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Promo Code</span>
                        </label>
                        <div className="join">
                          <input className="input input-bordered join-item flex-1" placeholder="Enter code" />
                          <button className="btn btn-primary join-item">Apply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default ModernCart;
