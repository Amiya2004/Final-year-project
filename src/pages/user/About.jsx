import { motion } from 'framer-motion';
import { Typography, Row, Col, Card, Divider, List } from 'antd';
import {
    CheckCircleOutlined,
    ShopOutlined,
    RocketOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    SmileOutlined,
    StarOutlined
} from '@ant-design/icons';
import './About.css';

const { Title, Paragraph } = Typography;

const About = () => {
    const missionItems = [
        'Provide fresh and quality grocery products',
        'Ensure transparent pricing',
        'Reduce product wastage using smart inventory tracking',
        'Offer easy online ordering for customers'
    ];

    const whyChooseUsItems = [
        {
            icon: <StarOutlined />,
            text: 'Quality products from trusted local sources'
        },
        {
            icon: <SafetyOutlined />,
            text: 'Freshness & expiry-aware stock management'
        },
        {
            icon: <ThunderboltOutlined />,
            text: 'Smart re-order & monthly essentials feature'
        },
        {
            icon: <RocketOutlined />,
            text: 'Fast pickup and delivery options'
        },
        {
            icon: <SafetyOutlined />,
            text: 'Secure online ordering'
        },
        {
            icon: <SmileOutlined />,
            text: 'Trusted by local families for generations'
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <motion.section
                className="about-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="about-hero-overlay" />
                <div className="about-hero-content">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="about-hero-icon"
                    >
                        <ShopOutlined />
                    </motion.div>
                    <Title level={1} className="about-hero-title">
                        About <span className="store-name-highlight">Nellai Velmurugan Store</span>
                    </Title>
                    <Paragraph className="about-hero-subtitle">
                        Nellai Velmurugan Store is a trusted local grocery shop providing quality food
                        products and daily essentials to customers in our area. Our mission is to deliver
                        fresh products, reliable brands, and affordable prices to every household.
                    </Paragraph>
                    <div className="about-hero-stats">
                        <motion.div
                            className="hero-stat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="hero-stat-value">500+</span>
                            <span className="hero-stat-label">Products</span>
                        </motion.div>
                        <motion.div
                            className="hero-stat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="hero-stat-value">10+</span>
                            <span className="hero-stat-label">Years Serving</span>
                        </motion.div>
                        <motion.div
                            className="hero-stat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="hero-stat-value">1000+</span>
                            <span className="hero-stat-label">Happy Customers</span>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Vision & Mission Section */}
            <section className="about-section vision-mission-section">
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="about-card vision-card" hoverable>
                                <div className="about-card-icon vision-icon">
                                    <ShopOutlined />
                                </div>
                                <Title level={3} className="about-card-title">Our Vision</Title>
                                <Paragraph className="about-card-text">
                                    To digitally transform local grocery shopping by combining traditional
                                    trust with modern technology for faster and smarter service. We envision
                                    a future where every household can access fresh, quality groceries with
                                    just a few clicks while maintaining the warmth of a neighborhood store.
                                </Paragraph>
                                <div className="card-accent vision-accent" />
                            </Card>
                        </motion.div>
                    </Col>
                    <Col xs={24} md={12}>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="about-card mission-card" hoverable>
                                <div className="about-card-icon mission-icon">
                                    <RocketOutlined />
                                </div>
                                <Title level={3} className="about-card-title">Our Mission</Title>
                                <List
                                    className="mission-list"
                                    dataSource={missionItems}
                                    renderItem={(item) => (
                                        <List.Item className="mission-list-item">
                                            <CheckCircleOutlined className="mission-check-icon" />
                                            <span>{item}</span>
                                        </List.Item>
                                    )}
                                />
                                <div className="card-accent mission-accent" />
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </section>

            {/* Why Choose Us Section */}
            <section className="about-section choose-us-section">
                <Divider className="choose-us-divider">
                    <Title level={2} className="choose-us-title">Why Choose Us</Title>
                </Divider>
                <Paragraph className="choose-us-subtitle">
                    We go the extra mile to ensure every customer gets the best shopping experience
                </Paragraph>

                <Row gutter={[24, 24]} className="choose-us-grid">
                    {whyChooseUsItems.map((item, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <Card className="choose-us-card" hoverable>
                                    <div className="choose-us-icon-wrapper">
                                        <CheckCircleOutlined className="choose-us-check" />
                                    </div>
                                    <div className="choose-us-content">
                                        <span className="choose-us-item-icon">{item.icon}</span>
                                        <Paragraph className="choose-us-text">{item.text}</Paragraph>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Store Values / Bottom CTA */}
            <motion.section
                className="about-section about-cta-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="about-cta-content">
                    <Title level={2} className="about-cta-title">
                        Experience the <span className="store-name-highlight">Difference</span>
                    </Title>
                    <Paragraph className="about-cta-text">
                        Visit us today or shop online to enjoy fresh groceries, great prices, and the
                        trusted service that Nellai Velmurugan Store is known for.
                    </Paragraph>
                    <div className="about-cta-badges">
                        <div className="cta-badge">
                            <span className="cta-badge-icon">🌿</span>
                            <span>Fresh Products</span>
                        </div>
                        <div className="cta-badge">
                            <span className="cta-badge-icon">💰</span>
                            <span>Best Prices</span>
                        </div>
                        <div className="cta-badge">
                            <span className="cta-badge-icon">🚚</span>
                            <span>Fast Delivery</span>
                        </div>
                        <div className="cta-badge">
                            <span className="cta-badge-icon">🛡️</span>
                            <span>Trusted Quality</span>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default About;
