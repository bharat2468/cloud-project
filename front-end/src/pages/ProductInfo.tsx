import "../Style/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Fragment, useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

function ProductInfo() {
  const [inputValue, setInputValue] = useState<Product | null>(null);
  const productID = localStorage.getItem("productID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PRODUCT_API_URL}/products/${productID}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setInputValue(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmithandler = () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Add to cart");
      fetch(`${import.meta.env.VITE_CART_API_URL}/cart/${productID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Added to cart");
            alert("Added to cart");
          } else {
            console.log("Failed to add to cart");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("Token not found");
      window.location.href = "/login";
    }
  };

  if (!inputValue) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-content">
              <div className="text-center">
                <h4>Loading product...</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-content">
              <div className="row">
                <div className="col-lg-12">
                  <div className="main-profile ">
                    <div className="row">
                      <div className="col-lg-4">
                        <img src={inputValue.image} alt="" />
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <div className="main-info header-text">
                          <h4>{inputValue.name}</h4>
                          <p>{inputValue.description}</p>
                          <div className="main-button">
                            <button className="searchButton" type="button" onClick={onSubmithandler}>
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <ul>
                          <li>
                            Game Category <span>{inputValue.category}</span>
                          </li>
                          <li>
                            Price <span>{inputValue.price}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductInfo;
