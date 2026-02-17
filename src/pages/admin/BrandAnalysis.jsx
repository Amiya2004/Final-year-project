import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award, BarChart2, Filter } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { sampleProducts, tamilNaduBrands, brandSalesData } from '../../data/sampleData';
import './BrandAnalysis.css';

const BrandAnalysis = () => {
    const [selectedBrand, setSelectedBrand] = useState('all');

    const brandColors = {
        'sakthi': '#ef4444',
        'aachi': '#f59e0b',
        'mtr': '#22c55e',
        'everest': '#3b82f6',
        'brahmins': '#8b5cf6',
        'jp-masala': '#ec4899',
        'anil': '#06b6d4',
        'meiyal': '#84cc16'
    };

    const getBrandProducts = (brandId) => {
        return sampleProducts.filter(p => p.brand === brandId);
    };

    const getBrandStats = (brandId) => {
        const products = getBrandProducts(brandId);
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const avgRating = products.length > 0
            ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
            : 0;
        return { products: products.length, totalStock, avgRating };
    };

    const topBrands = [...brandSalesData].sort((a, b) => b.sales - a.sales).slice(0, 3);
    const lowestBrands = [...brandSalesData].sort((a, b) => a.sales - b.sales).slice(0, 3);

    const brandPieData = brandSalesData.map((brand, index) => ({
        name: brand.brand,
        value: brand.sales,
        color: Object.values(brandColors)[index % Object.values(brandColors).length]
    }));

    const getDemandColor = (demand) => {
        switch (demand) {
            case 'high': return '#22c55e';
            case 'medium': return '#f59e0b';
            case 'low': return '#ef4444';
            default: return '#64748b';
        }
    };

    const filteredProducts = selectedBrand === 'all'
        ? sampleProducts
        : sampleProducts.filter(p => p.brand === selectedBrand);

    return (
        <div className="brand-analysis">
            <div className="page-header">
                <div>
                    <h1>Brand-wise Analysis</h1>
                    <p>Analyze performance of Tamil Nadu grocery brands</p>
                </div>
            </div>

            {/* Top & Lowest Performing Brands */}
            <div className="brand-performance-row">
                <motion.div
                    className="performance-card top"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="performance-header">
                        <Award size={24} />
                        <h3>Top Selling Brands</h3>
                    </div>
                    <div className="brands-list">
                        {topBrands.map((brand, index) => (
                            <div key={brand.brand} className="brand-rank-item">
                                <span className="rank-number">{index + 1}</span>
                                <span className="brand-name">{brand.brand}</span>
                                <span className="brand-sales">₹{(brand.sales / 1000).toFixed(0)}k</span>
                                <TrendingUp size={16} className="trend-up" />
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="performance-card low"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="performance-header">
                        <BarChart2 size={24} />
                        <h3>Needs Attention</h3>
                    </div>
                    <div className="brands-list">
                        {lowestBrands.map((brand, index) => (
                            <div key={brand.brand} className="brand-rank-item">
                                <span className="rank-number low">{index + 1}</span>
                                <span className="brand-name">{brand.brand}</span>
                                <span className="brand-sales">₹{(brand.sales / 1000).toFixed(0)}k</span>
                                <TrendingDown size={16} className="trend-down" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3>Brand Sales Comparison</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={brandSalesData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `₹${value / 1000}k`} />
                            <YAxis type="category" dataKey="brand" stroke="#64748b" width={80} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1e293b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}
                                formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                            />
                            <Bar
                                dataKey="sales"
                                fill="#22c55e"
                                radius={[0, 8, 8, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3>Market Share</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={brandPieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {brandPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#1e293b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}
                                formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Brand Cards */}
            <div className="section-header">
                <h2>Brand Details</h2>
                <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="brand-filter"
                >
                    <option value="all">All Brands</option>
                    {tamilNaduBrands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>
            </div>

            <div className="brands-grid">
                {tamilNaduBrands.map((brand, index) => {
                    const stats = getBrandStats(brand.id);
                    const salesData = brandSalesData.find(b => b.brand.toLowerCase() === brand.name.toLowerCase());

                    return (
                        <motion.div
                            key={brand.id}
                            className={`brand-card ${selectedBrand === 'all' || selectedBrand === brand.id ? '' : 'hidden'}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="brand-header">
                                <span className="brand-logo">{brand.logo}</span>
                                <div className="brand-info">
                                    <h4>{brand.name}</h4>
                                    <p>{brand.description}</p>
                                </div>
                            </div>

                            <div className="brand-stats">
                                <div className="stat">
                                    <span className="stat-value">{stats.products}</span>
                                    <span className="stat-label">Products</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{stats.totalStock}</span>
                                    <span className="stat-label">Stock</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">⭐ {stats.avgRating}</span>
                                    <span className="stat-label">Rating</span>
                                </div>
                            </div>

                            {salesData && (
                                <div className="brand-sales-info">
                                    <div className="sales-amount">
                                        <span>Total Sales</span>
                                        <strong>₹{salesData.sales.toLocaleString()}</strong>
                                    </div>
                                    <span
                                        className="demand-badge"
                                        style={{
                                            backgroundColor: `${getDemandColor(salesData.demand)}15`,
                                            color: getDemandColor(salesData.demand)
                                        }}
                                    >
                                        {salesData.demand.toUpperCase()} DEMAND
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default BrandAnalysis;
