import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/nav.js';
import '../styles/categories.css';
import axios from 'axios';

const brands = {
    "Fruits": ["Fresh Fruits", "Dry Fruits"],
    "Vegetable": ["Fresh Vegetables", "Root Vegetables"]
};

function Category() {
    const [selectedCategory, setSelectedCategory] = useState("Fruits");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const getUserEmail = () => {
        const token = localStorage.getItem('token');
        const user = token.split(',');
        return user[1];
    }

    useEffect(() => {
        const fetchdata = async () => {
            try {
                let url = 'http://localhost:3001/items/';
                if (selectedBrand && selectedCategory) {
                    url += `${selectedBrand}/${selectedCategory}`;
                } else if (selectedBrand) {
                    url += `${selectedBrand}/undefined`;
                } else if (selectedCategory) {
                    url += `undefined/${selectedCategory}`;
                }
                const response = await axios.get(url);
                setItems(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchdata();
    }, [selectedBrand, selectedCategory]);


    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedBrand(null);
    };

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand);
    };

    const addToCart = async (productId) => {
        try {
            const userEmail = getUserEmail();
            await axios.post('http://localhost:3001/api/add', {
                userEmail: userEmail,
                productId: productId
            });
            navigate('/cart');
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    return (
        <div className="full-container">
            <Nav />
            <div className="container1">
                <div className="left-panel">
                    <div className="filter-options">
                        <div className="filter-card">
                            <div className="card-header">CATEGORY</div>
                            <div className="card-body">
                                {Object.keys(brands).map((category, index) => (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="category"
                                            onChange={() => handleCategoryClick(category)}
                                            checked={selectedCategory === category}
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>
                        </div>
                        {selectedCategory && (
                            <div className="filter-card">
                                <div className="card-header">BRAND</div>
                                <div className="card-body">
                                    {brands[selectedCategory].map((brand, index) => (
                                        <label key={index}>
                                            <input
                                                type="radio"
                                                name="brand"
                                                onChange={() => handleBrandClick(brand)}
                                                checked={selectedBrand === brand}
                                            />
                                            {brand}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="right-panel">
                    <div className="image-gallery">
                        {items.map(product => (
                            <div key={product.id} className="product-item">
                                <div className="product-card">
                                    <img src={require(`../../src/uploads/${product.images}`)} alt={product.name} />
                                    <div className="product-info">
                                        <div className="name">{product.productName}</div>
                                        <div className="brand">{product.brand}</div>
                                        <div className="name">{product.gram}</div>
                                        <div className="price">MRP: {product.price}</div>
                                      
                                        <button className="a-btn" onClick={() => addToCart(product.id)}>ADD TO CART</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* {selectedProduct && <ProductDetails product={selectedProduct} />} */   }
                </div>
            </div>
        </div>
    );
}

export default Category;