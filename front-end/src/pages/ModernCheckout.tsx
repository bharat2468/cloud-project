import { useState, useEffect, Fragment } from "react";

interface CartProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartData {
  total: number;
  Products: CartProduct[];
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

function ModernCheckout() {
  const [cartData, setCartData] = useState<CartData>({ total: 0, Products: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

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
          setError("Failed to load cart data");
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

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const validateShipping = () => {
    return Object.values(shippingInfo).every(value => value.trim() !== "");
  };

  const validatePayment = () => {
    return Object.values(paymentInfo).every(value => value.trim() !== "");
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      const modal = document.getElementById('success_modal') as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    } catch (error) {
      console.error("Order failed:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const calculateTax = () => (cartData.total * 0.08);
  const calculateShipping = () => cartData.total > 50 ? 0 : 9.99;
  const calculateTotal = () => cartData.total + calculateTax() + calculateShipping();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading checkout...</p>
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

  if (cartData.Products.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-base-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-base-content/60 mb-4">Add some games to your cart before checkout.</p>
          <a href="/" className="btn btn-primary">Continue Shopping</a>
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
            <h1 className="text-4xl font-bold text-primary mb-2">Checkout</h1>
            <p className="text-base-content/70">Complete your purchase</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <ul className="steps steps-horizontal w-full">
              <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Shipping</li>
              <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Payment</li>
              <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Review</li>
            </ul>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Shipping Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">First Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={shippingInfo.firstName}
                          onChange={(e) => handleShippingChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Last Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={shippingInfo.lastName}
                          onChange={(e) => handleShippingChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Address</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={shippingInfo.address}
                        onChange={(e) => handleShippingChange('address', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">City</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={shippingInfo.city}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">State</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={shippingInfo.state}
                          onChange={(e) => handleShippingChange('state', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">ZIP Code</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={shippingInfo.zipCode}
                          onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-6">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setCurrentStep(2)}
                        disabled={!validateShipping()}
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Payment Information</h2>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Cardholder Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={paymentInfo.cardholderName}
                        onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Card Number</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Expiry Date</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">CVV</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={paymentInfo.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="card-actions justify-between mt-6">
                      <button 
                        className="btn btn-outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back to Shipping
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setCurrentStep(3)}
                        disabled={!validatePayment()}
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title text-2xl mb-6">Order Review</h2>
                      
                      {/* Shipping Info Review */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                        <div className="bg-base-200 p-4 rounded-lg">
                          <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                          <p>{shippingInfo.address}</p>
                          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                          <p>{shippingInfo.email}</p>
                        </div>
                      </div>

                      {/* Payment Info Review */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                        <div className="bg-base-200 p-4 rounded-lg">
                          <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                          <p>{paymentInfo.cardholderName}</p>
                        </div>
                      </div>

                      <div className="card-actions justify-between">
                        <button 
                          className="btn btn-outline"
                          onClick={() => setCurrentStep(2)}
                        >
                          Back to Payment
                        </button>
                        <button 
                          className={`btn btn-success btn-lg ${processing ? 'loading' : ''}`}
                          onClick={handlePlaceOrder}
                          disabled={processing}
                        >
                          {processing ? 'Processing...' : 'Place Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-xl sticky top-8">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartData.Products.map((product) => (
                      <div key={product._id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-lg">
                            <img src={product.image} alt={product.name} className="object-cover" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{product.name}</h4>
                          <p className="text-xs text-base-content/60">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cartData.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={calculateShipping() === 0 ? "text-success" : ""}>
                        {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {calculateShipping() === 0 && (
                    <div className="alert alert-success mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Free shipping on orders over $50!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="font-bold text-lg mb-2">Order Placed Successfully!</h3>
          <p className="py-4">Thank you for your purchase! You'll receive an email confirmation shortly.</p>
          <div className="modal-action justify-center">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = "/"}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </dialog>
    </Fragment>
  );
}

export default ModernCheckout;
