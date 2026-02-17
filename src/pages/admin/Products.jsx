import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { sampleProducts, sampleCategories, tamilNaduBrands } from '../../data/sampleData';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState(sampleProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (index) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const updatedProducts = products.filter((_, i) => i !== index);
            setProducts(updatedProducts);
        }
    };

    return (
        <div className="products-page">
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your product inventory</p>
                </div>
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Products Stats */}
            <div className="products-stats">
                <div className="stat-item">
                    <span className="stat-value">{products.length}</span>
                    <span className="stat-label">Total Products</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{sampleCategories.length}</span>
                    <span className="stat-label">Categories</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{tamilNaduBrands.length}</span>
                    <span className="stat-label">Brands</span>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search products by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.name}
                        className="product-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <span className="product-category">{product.category}</span>
                            <h3>{product.name}</h3>
                            <p className="product-brand">{product.brand}</p>
                            <div className="product-meta">
                                <span className="product-price">₹{product.price}</span>
                                <span className="product-stock">Stock: {product.stock}</span>
                            </div>
                        </div>
                        <div className="product-actions">
                            <button className="edit-btn" onClick={() => setEditingProduct(product)}>
                                <Edit2 size={16} />
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(index)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-products">
                    <Package size={48} />
                    <h3>No products found</h3>
                    <p>Try adjusting your search or add a new product</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {(showAddModal || editingProduct) && (
                <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditingProduct(null); }}>
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form className="product-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        defaultValue={editingProduct?.name || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <select defaultValue={editingProduct?.brand || ''}>
                                        <option value="">Select Brand</option>
                                        {tamilNaduBrands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                        <option value="local">Local</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select defaultValue={editingProduct?.category || ''}>
                                        <option value="">Select Category</option>
                                        {sampleCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        defaultValue={editingProduct?.price || ''}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="Enter stock"
                                        defaultValue={editingProduct?.stock || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input
                                        type="date"
                                        defaultValue={editingProduct?.expiryDate || ''}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Product Image URL</label>
                                <input
                                    type="url"
                                    placeholder="Enter image URL"
                                    defaultValue={editingProduct?.image || ''}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => { setShowAddModal(false); setEditingProduct(null); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Products;
