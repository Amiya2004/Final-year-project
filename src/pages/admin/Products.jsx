import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, Loader } from 'lucide-react';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct } from '../../services/database';
import { sampleCategories } from '../../data/sampleData';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', stock: '', unit: '',
        expiryDate: '', image: '', rating: 4.5,
        brands: ['', '', ''],
        availableUnits: [{ label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }]
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToProducts((data) => {
            setProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAdd = () => {
        setFormData({ name: '', category: '', price: '', stock: '', unit: '', expiryDate: '', image: '', rating: 4.5, brands: ['', '', ''], availableUnits: [{ label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }] });
        setShowAddModal(true);
    };

    const handleOpenEdit = (product) => {
        setFormData({
            name: product.name || '',
            category: product.category || '',
            price: product.price || '',
            stock: product.stock || '',
            unit: product.unit || '',
            expiryDate: product.expiryDate || '',
            image: product.image || '',
            rating: product.rating || 4.5,
            brands: [...(product.brands || []), '', '', ''].slice(0, 3),
            availableUnits: [
                ...(product.availableUnits || []).map(u => typeof u === 'string' ? { label: u, price: '', stock: '' } : { label: u.label || '', price: u.price || '', stock: u.stock || '' }),
                { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }
            ].slice(0, 3)
        });
        setEditingProduct(product);
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const availableUnits = (formData.availableUnits || []).filter(u => u.label && u.label.trim() !== '').map(u => ({ label: u.label.trim(), price: Number(u.price) || 0, stock: Number(u.stock) || 0 }));
            const totalStock = availableUnits.reduce((sum, u) => sum + u.stock, 0);
            const productData = {
                ...formData,
                price: availableUnits.length > 0 ? availableUnits[0].price : Number(formData.price),
                stock: availableUnits.length > 0 ? totalStock : Number(formData.stock),
                rating: Number(formData.rating),
                brands: (formData.brands || []).filter(b => b.trim() !== ''),
                availableUnits
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData);
            }
            setShowAddModal(false);
            setEditingProduct(null);
        } catch (err) {
            console.error('Error saving product:', err);
            alert('Failed to save product. Please try again.');
        }
        setSaving(false);
    };

    const handleDelete = async (product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            try {
                await deleteProduct(product.id);
            } catch (err) {
                console.error('Error deleting product:', err);
                alert('Failed to delete product.');
            }
        }
    };

    if (loading) {
        return (
            <div className="products-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={32} className="spinning" />
                <span style={{ marginLeft: '12px' }}>Loading products from database...</span>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your product inventory</p>
                </div>
                <button className="add-btn" onClick={handleOpenAdd}>
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
            </div>

            {/* Search */}
            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        className="product-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <span className="product-category">{product.category}</span>
                            <h3>{product.name}</h3>

                            <div className="product-meta">
                                <span className="product-price">₹{product.price}</span>
                                <span className="product-stock">Stock: {product.stock}</span>
                            </div>
                        </div>
                        <div className="product-actions">
                            <button className="edit-btn" onClick={() => handleOpenEdit(product)}>
                                <Edit2 size={16} />
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(product)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
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
                        <form className="product-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={(e) => handleFormChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleFormChange('category', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {sampleCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Price per Quantity (₹)</label>
                                <div className="unit-inputs">
                                    {(formData.availableUnits || [{ label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }]).map((unit, i) => (
                                        <div key={i} className="unit-row-3col">
                                            <input
                                                type="text"
                                                placeholder={`Quantity ${i + 1} (e.g. 250ml)`}
                                                value={unit.label || ''}
                                                onChange={(e) => {
                                                    const updated = [...(formData.availableUnits || [{ label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }])];
                                                    updated[i] = { ...updated[i], label: e.target.value };
                                                    handleFormChange('availableUnits', updated);
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder={`Price ₹`}
                                                value={unit.price || ''}
                                                onChange={(e) => {
                                                    const updated = [...(formData.availableUnits || [{ label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }])];
                                                    updated[i] = { ...updated[i], price: e.target.value };
                                                    handleFormChange('availableUnits', updated);
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder={`Stock`}
                                                value={unit.stock || ''}
                                                onChange={(e) => {
                                                    const updated = [...(formData.availableUnits || [{ label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }, { label: '', price: '', stock: '' }])];
                                                    updated[i] = { ...updated[i], stock: e.target.value };
                                                    handleFormChange('availableUnits', updated);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => handleFormChange('expiryDate', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Unit</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. kg, liter, pack"
                                        value={formData.unit}
                                        onChange={(e) => handleFormChange('unit', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Brands</label>
                                <div className="multi-input-row">
                                    {(formData.brands || ['', '', '']).map((brand, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            placeholder={`Brand ${i + 1}`}
                                            value={brand}
                                            onChange={(e) => {
                                                const updated = [...(formData.brands || ['', '', ''])];
                                                updated[i] = e.target.value;
                                                handleFormChange('brands', updated);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Product Image URL</label>
                                <input
                                    type="url"
                                    placeholder="Enter image URL"
                                    value={formData.image}
                                    onChange={(e) => handleFormChange('image', e.target.value)}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => { setShowAddModal(false); setEditingProduct(null); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn" disabled={saving}>
                                    {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
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
