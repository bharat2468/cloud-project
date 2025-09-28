import { Fragment, useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

function ModernProductInfo() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("id");
        
        if (!productId) {
          setError("Product ID not found");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_PRODUCT_API_URL}/products/${productId}`);
        
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const addToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_CART_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity
        })
      });

      if (response.ok) {
        // Show success message
        const successAlert = document.getElementById('success-alert');
        if (successAlert) {
          successAlert.classList.remove('hidden');
          setTimeout(() => {
            successAlert.classList.add('hidden');
          }, 3000);
        }
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error("Error:", error);
      const errorAlert = document.getElementById('error-alert');
      if (errorAlert) {
        errorAlert.classList.remove('hidden');
        setTimeout(() => {
          errorAlert.classList.add('hidden');
        }, 3000);
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || "Product not found"}</span>
          </div>
          <a href="/" className="btn btn-primary mt-4">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="min-h-screen bg-base-200 py-8">
        {/* Success Alert */}
        <div id="success-alert" className="fixed top-20 right-4 z-50 alert alert-success w-auto hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Added to cart successfully!</span>
        </div>

        {/* Error Alert */}
        <div id="error-alert" className="fixed top-20 right-4 z-50 alert alert-error w-auto hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to add to cart!</span>
        </div>

        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-6">
            <ul>
              <li><a href="/" className="text-primary">Home</a></li>
              <li><span className="text-base-content/60">{product.category}</span></li>
              <li><span className="text-base-content/60">{product.name}</span></li>
            </ul>
          </div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-6 pt-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="rounded-xl w-full h-96 object-cover"
                />
              </figure>
            </div>

            {/* Product Info */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="badge badge-primary badge-lg mb-2">{product.category}</div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="rating rating-sm">
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" defaultChecked />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                  </div>
                  <span className="text-sm text-base-content/60">(4.2 out of 5)</span>
                </div>

                <div className="text-4xl font-bold text-primary mb-6">${product.price}</div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-base-content/80 leading-relaxed">{product.description}</p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center">
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="mx-4 text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    className={`btn btn-primary btn-lg w-full ${addingToCart ? 'loading' : ''}`}
                    onClick={addToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding to Cart...' : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H17M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"></path>
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button className="btn btn-outline btn-lg w-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    Add to Wishlist
                  </button>
                </div>

                {/* Product Features */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="badge badge-success badge-sm">✓</div>
                      <span className="text-sm">Digital Download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-success badge-sm">✓</div>
                      <span className="text-sm">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-success badge-sm">✓</div>
                      <span className="text-sm">No DRM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-success badge-sm">✓</div>
                      <span className="text-sm">Cloud Saves</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Related Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="card bg-base-100 shadow-xl">
                  <figure>
                    <div className="w-full h-48 bg-base-300 animate-pulse"></div>
                  </figure>
                  <div className="card-body">
                    <div className="h-4 bg-base-300 rounded animate-pulse mb-2"></div>
                    <div className="h-6 bg-base-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ModernProductInfo;
