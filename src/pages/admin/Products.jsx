import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, Loader, X } from 'lucide-react';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct } from '../../services/database';
import { sampleCategories } from '../../data/sampleData';
import { useLanguage } from '../../contexts/LanguageContext';
import './Products.css';

const Products = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const emptyVariant = () => ({ label: '', price: '', stock: '' });
    const emptyBrand = () => ({ name: '', variants: [emptyVariant()] });
    const [formData, setFormData] = useState({
        name: '', category: '', unit: '',
        expiryDate: '', image: '', rating: 4.5,
        lowStockThreshold: 10, overStockThreshold: 200,
        brands: [emptyBrand()]
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
        setFormData({ name: '', category: '', unit: '', expiryDate: '', image: '', rating: 4.5, lowStockThreshold: 10, overStockThreshold: 200, brands: [emptyBrand()] });
        setShowAddModal(true);
    };

    const handleOpenEdit = (product) => {
        let brands;
        if (product.brands && product.brands.length > 0 && typeof product.brands[0] === 'object' && product.brands[0].variants) {
            brands = product.brands.map(b => ({
                name: b.name || '',
                variants: (b.variants || []).map(v => ({ label: v.label || '', price: v.price || '', stock: v.stock || '' }))
            }));
        } else {
            const oldNames = (product.brands || []).filter(b => typeof b === 'string' && b.trim());
            const oldVariants = (product.availableUnits || []).map(u =>
                typeof u === 'string' ? { label: u, price: '', stock: '' } : { label: u.label || '', price: u.price || '', stock: u.stock || '' }
            );
            if (oldNames.length > 0) {
                brands = oldNames.map(name => ({ name, variants: oldVariants.length > 0 ? oldVariants.map(v => ({ ...v })) : [emptyVariant()] }));
            } else {
                brands = [{ name: '', variants: oldVariants.length > 0 ? oldVariants : [emptyVariant()] }];
            }
        }
        if (brands.length === 0) brands = [emptyBrand()];
        setFormData({
            name: product.name || '', category: product.category || '', unit: product.unit || '',
            expiryDate: product.expiryDate || '', image: product.image || '', rating: product.rating || 4.5,
            lowStockThreshold: product.lowStockThreshold ?? 10, overStockThreshold: product.overStockThreshold ?? 200,
            brands
        });
        setEditingProduct(product);
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddBrand = () => {
        setFormData(prev => ({ ...prev, brands: [...prev.brands, emptyBrand()] }));
    };

    const handleRemoveBrand = (bi) => {
        setFormData(prev => ({ ...prev, brands: prev.brands.filter((_, i) => i !== bi) }));
    };

    const handleBrandNameChange = (bi, name) => {
        setFormData(prev => {
            const brands = [...prev.brands];
            brands[bi] = { ...brands[bi], name };
            return { ...prev, brands };
        });
    };

    const handleAddVariant = (bi) => {
        setFormData(prev => {
            const brands = [...prev.brands];
            brands[bi] = { ...brands[bi], variants: [...brands[bi].variants, emptyVariant()] };
            return { ...prev, brands };
        });
    };

    const handleRemoveVariant = (bi, vi) => {
        setFormData(prev => {
            const brands = [...prev.brands];
            brands[bi] = { ...brands[bi], variants: brands[bi].variants.filter((_, i) => i !== vi) };
            return { ...prev, brands };
        });
    };

    const handleVariantChange = (bi, vi, field, value) => {
        setFormData(prev => {
            const brands = [...prev.brands];
            const variants = [...brands[bi].variants];
            variants[vi] = { ...variants[vi], [field]: value };
            brands[bi] = { ...brands[bi], variants };
            return { ...prev, brands };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const brandsData = formData.brands
                .filter(b => b.name.trim() !== '')
                .map(b => ({
                    name: b.name.trim(),
                    variants: b.variants
                        .filter(v => v.label && v.label.trim() !== '')
                        .map(v => ({ label: v.label.trim(), price: Number(v.price) || 0, stock: Number(v.stock) || 0 }))
                }));

            const allVariants = brandsData.flatMap(b => b.variants);
            const totalStock = allVariants.reduce((sum, v) => sum + v.stock, 0);
            const firstPrice = allVariants.length > 0 ? allVariants[0].price : 0;

            // Deduplicated availableUnits for backward compatibility
            const seen = new Set();
            const availableUnits = [];
            for (const v of allVariants) {
                if (!seen.has(v.label)) { seen.add(v.label); availableUnits.push(v); }
            }

            const productData = {
                name: formData.name,
                category: formData.category,
                unit: formData.unit,
                expiryDate: formData.expiryDate,
                image: formData.image,
                rating: Number(formData.rating),
                price: firstPrice,
                stock: totalStock,
                lowStockThreshold: Number(formData.lowStockThreshold) || 10,
                overStockThreshold: Number(formData.overStockThreshold) || 200,
                brands: brandsData,
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
            alert(t('failedToSaveProduct'));
        }
        setSaving(false);
    };

    const handleDelete = async (product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            try {
                await deleteProduct(product.id);
            } catch (err) {
                console.error('Error deleting product:', err);
                alert(t('failedToDeleteProduct'));
            }
        }
    };

    if (loading) {
        return (
            <div className="products-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={32} className="spinning" />
                <span style={{ marginLeft: '12px' }}>{t('loadingProducts')}</span>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="page-header">
                <div>
                    <h1>{t('adminProducts')}</h1>
                    <p>{t('manageProductInventory')}</p>
                </div>
                <button className="add-btn" onClick={handleOpenAdd}>
                    <Plus size={20} />
                    {t('addProduct')}
                </button>
            </div>

            {/* Products Stats */}
            <div className="products-stats">
                <div className="stat-item">
                    <span className="stat-value">{products.length}</span>
                    <span className="stat-label">{t('totalProducts')}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{sampleCategories.length}</span>
                    <span className="stat-label">{t('categories')}</span>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder={t('searchProductsByName')}
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
                        <span className="product-stock">{t('stock')}: {product.stock}</span>
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
                    <h3>{t('noProductsFound')}</h3>
                    <p>{t('tryAdjustingSearchOrAdd')}</p>
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
                        <h2>{editingProduct ? t('editProduct') : t('addNewProduct')}</h2>
                        <form className="product-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('productName')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('enterProductName')}
                                        value={formData.name}
                                        onChange={(e) => handleFormChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('category')}</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleFormChange('category', e.target.value)}
                                        required
                                    >
                                        <option value="">{t('selectCategory')}</option>
                                        {sampleCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('expiryDate')}</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => handleFormChange('expiryDate', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('unit')}</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. kg, liter, pack"
                                        value={formData.unit}
                                        onChange={(e) => handleFormChange('unit', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('lowStockThreshold')}</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 10"
                                        value={formData.lowStockThreshold}
                                        onChange={(e) => handleFormChange('lowStockThreshold', e.target.value)}
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('overStockThreshold')}</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 200"
                                        value={formData.overStockThreshold}
                                        onChange={(e) => handleFormChange('overStockThreshold', e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Brands & Pricing Section */}
                            <div className="brands-section">
                                <div className="brands-section-header">
                                    <h3>{t('brandsPricing')}</h3>
                                    <button type="button" className="add-brand-btn" onClick={handleAddBrand}>
                                        <Plus size={16} /> {t('addBrand')}
                                    </button>
                                </div>
                                {formData.brands.map((brand, bi) => (
                                    <div key={bi} className="brand-card">
                                        <div className="brand-card-header">
                                            <div className="brand-name-input">
                                                <span className="brand-number">{bi + 1}</span>
                                                <input
                                                    type="text"
                                                    placeholder={t('brandNamePlaceholder')}
                                                    value={brand.name}
                                                    onChange={(e) => handleBrandNameChange(bi, e.target.value)}
                                                />
                                            </div>
                                            {formData.brands.length > 1 && (
                                                <button type="button" className="remove-brand-btn" onClick={() => handleRemoveBrand(bi)} title={t('removeBrand')}>
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="variant-labels">
                                            <span>{t('quantity')}</span>
                                            <span>{t('price')} (₹)</span>
                                            <span>{t('stock')}</span>
                                            <span></span>
                                        </div>
                                        <div className="variants-list">
                                            {brand.variants.map((variant, vi) => (
                                                <div key={vi} className="variant-row">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 250ml"
                                                        value={variant.label}
                                                        onChange={(e) => handleVariantChange(bi, vi, 'label', e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="₹ 0"
                                                        value={variant.price}
                                                        onChange={(e) => handleVariantChange(bi, vi, 'price', e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={variant.stock}
                                                        onChange={(e) => handleVariantChange(bi, vi, 'stock', e.target.value)}
                                                    />
                                                    {brand.variants.length > 1 && (
                                                        <button type="button" className="remove-variant-btn" onClick={() => handleRemoveVariant(bi, vi)} title={t('removeVariant')}>
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" className="add-variant-btn" onClick={() => handleAddVariant(bi)}>
                                            <Plus size={14} /> {t('addVariant')}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <label>{t('productImageUrl')}</label>
                                <input
                                    type="url"
                                    placeholder={t('enterImageUrl')}
                                    value={formData.image}
                                    onChange={(e) => handleFormChange('image', e.target.value)}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => { setShowAddModal(false); setEditingProduct(null); }}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="save-btn" disabled={saving}>
                                    {saving ? t('saving') : (editingProduct ? t('updateProduct') : t('addProduct'))}
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
