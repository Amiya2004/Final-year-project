import { motion } from 'framer-motion';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
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
    const { settings } = useSettings();
    const { t } = useLanguage();
    const missionItems = [
        t('missionItem1'),
        t('missionItem2'),
        t('missionItem3'),
        t('missionItem4')
    ];

    const whyChooseUsItems = [
        {
            icon: <StarOutlined />,
            text: t('chooseItem1')
        },
        {
            icon: <SafetyOutlined />,
            text: t('chooseItem2')
        },
        {
            icon: <ThunderboltOutlined />,
            text: t('chooseItem3')
        },
        {
            icon: <RocketOutlined />,
            text: t('chooseItem4')
        },
        {
            icon: <SafetyOutlined />,
            text: t('chooseItem5')
        },
        {
            icon: <SmileOutlined />,
            text: t('chooseItem6')
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
                        {t('aboutStore')} <span className="store-name-highlight">{settings.storeName}</span>
                    </Title>
                    <Paragraph className="about-hero-subtitle">
                        {t('aboutDescription', { storeName: settings.storeName })}
                    </Paragraph>
                    <div className="about-hero-stats">
                        <motion.div
                            className="hero-stat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="hero-stat-value">500+</span>
                            <span className="hero-stat-label">{t('products')}</span>
                        </motion.div>
                        <motion.div
                            className="hero-stat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="hero-stat-value">10+</span>
                            <span className="hero-stat-label">{t('yearsServing')}</span>
                        </motion.div>
                        <motion.div
                            className="hero-stat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="hero-stat-value">1000+</span>
                            <span className="hero-stat-label">{t('happyCustomers')}</span>
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
                                <Title level={3} className="about-card-title">{t('ourVision')}</Title>
                                <Paragraph className="about-card-text">
                                    {t('visionText')}
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
                                <Title level={3} className="about-card-title">{t('ourMission')}</Title>
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
                    <Title level={2} className="choose-us-title">{t('whyChooseUs')}</Title>
                </Divider>
                <Paragraph className="choose-us-subtitle">
                    {t('whyChooseUsSubtitle')}
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
                        {t('experienceDifference').split(' ').slice(0, -1).join(' ')} <span className="store-name-highlight">{t('experienceDifference').split(' ').slice(-1)}</span>
                    </Title>
                    <Paragraph className="about-cta-text">
                        {t('experienceText', { storeName: settings.storeName })}
                    </Paragraph>
                    <div className="about-cta-badges">
                        <div className="cta-badge">
                            <span className="cta-badge-icon">🌿</span>
                            <span>{t('freshProducts')}</span>
                        </div>
                        <div className="cta-badge">
                            <span className="cta-badge-icon">💰</span>
                            <span>{t('bestPrices')}</span>
                        </div>
                        <div className="cta-badge">
                            <span className="cta-badge-icon">🚚</span>
                            <span>{t('fastDelivery')}</span>
                        </div>
                        <div className="cta-badge">
                            <span className="cta-badge-icon">🛡️</span>
                            <span>{t('trustedQuality')}</span>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default About;
