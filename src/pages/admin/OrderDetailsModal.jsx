import { motion } from 'framer-motion';
import { X, Package, Hash, User, MapPin, Phone, Mail, Calendar, DollarSign, ShoppingCart } from 'lucide-react';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="modal-header">
                    <h2>Order Details</h2>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </header>

                <div className="modal-body">
                    <div className="order-main-info">
                        <div className="info-item">
                            <Hash />
                            <div>
                                <span>Order ID</span>
                                <strong>#{order.id.slice(-6).toUpperCase()}</strong>
                            </div>
                        </div>
                        <div className="info-item">
                            <Calendar />
                            <div>
                                <span>Date</span>
                                <strong>{formatDate(order.createdAt)}</strong>
                            </div>
                        </div>
                        <div className="info-item">
                            <DollarSign />
                            <div>
                                <span>Total</span>
                                <strong>₹{order.total.toFixed(2)}</strong>
                            </div>
                        </div>
                        <div className={`status-tag ${order.status}`}>
                            {order.status}
                        </div>
                    </div>

                    <div className="customer-details">
                        <h3><User /> Customer Information</h3>
                        <div className="details-grid">
                            <p><strong>Name:</strong> {order.customerName}</p>
                            <p><strong><Mail /> Email:</strong> {order.email}</p>
                            <p><strong><Phone /> Phone:</strong> {order.phone}</p>
                            <p><strong><MapPin /> Address:</strong> {`${order.address.addressLine1}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`}</p>
                        </div>
                    </div>

                    <div className="items-section">
                        <h3><ShoppingCart /> Order Items ({order.items.length})</h3>
                        <div className="items-list">
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-info">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-category">{item.category}</p>
                                    </div>
                                    <div className="item-qty-price">
                                        <p>Qty: {item.quantity}</p>
                                        <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetailsModal;
