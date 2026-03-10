import { motion } from 'framer-motion';
import { useSettings } from '../../contexts/SettingsContext';
import { useReviews } from '../../contexts/ReviewsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Typography,
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Rate,
    Divider
} from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import './Contact.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const { settings } = useSettings();
    const { addReview } = useReviews();
    const { t } = useLanguage();
    const [reviewForm] = Form.useForm();

    const onSubmitReview = async (values) => {
        try {
            await addReview({
                name: values.name,
                comment: values.feedback,
                rating: values.rating
            });
            reviewForm.resetFields();
        } catch (error) {
            console.error('Failed to store feedback:', error);
        }
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <Title level={1} className="contact-title">{t('contactUs')}</Title>
                <Paragraph className="contact-subtitle">
                    {t('contactSubtitle')}
                </Paragraph>
            </section>

            <section className="contact-container">
                <Row gutter={[40, 40]} justify="center" className="contact-info-row">
                    <Col xs={24} md={20} lg={12} xl={10}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="info-card" bordered={false}>
                                <Title level={3} className="info-card-title">{t('storeInformation')}</Title>
                                <Divider />

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <EnvironmentOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>{t('address')}</Text>
                                        <Paragraph>
                                            156, Nellai Velmurgan Store<br />
                                            Sullipalayam, Perundurai - 638052<br />
                                            Tamil Nadu, India
                                        </Paragraph>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <PhoneOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>{t('phoneNumber')}</Text>
                                        <Paragraph>{settings.contactPhone}</Paragraph>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <MailOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>{t('email')}</Text>
                                        <Paragraph>{settings.contactEmail}</Paragraph>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <ClockCircleOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>{t('workingHours')}</Text>
                                        <Paragraph>
                                            {t('workingHoursValue')}<br />
                                            {t('workingDays')}
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </Col>

                    <Col xs={24} md={20} lg={12} xl={10}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="review-card" bordered={false}>
                                <Title level={3} className="info-card-title">{t('feedbackTitle')}</Title>
                                <Paragraph className="review-subtitle">
                                    {t('feedbackSubtitle')}
                                </Paragraph>
                                <Divider />

                                <Form
                                    form={reviewForm}
                                    layout="vertical"
                                    onFinish={onSubmitReview}
                                    autoComplete="off"
                                    size="large"
                                >
                                    <Form.Item
                                        name="name"
                                        label={t('name')}
                                        rules={[{ required: true, message: t('pleaseEnterName') }]}
                                    >
                                        <Input placeholder={t('enterYourName')} />
                                    </Form.Item>

                                    <Form.Item
                                        name="rating"
                                        label={t('rating')}
                                        rules={[{ required: true, message: t('pleaseSelectRating') }]}
                                    >
                                        <Rate />
                                    </Form.Item>

                                    <Form.Item
                                        name="feedback"
                                        label={t('feedback')}
                                        rules={[{ required: true, message: t('pleaseEnterFeedback') }]}
                                    >
                                        <TextArea rows={4} placeholder={t('writeFeedback')} />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block className="review-submit-btn">
                                            {t('submitFeedback')}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                <motion.div
                    className="map-section"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Divider className="map-divider">
                        <Title level={2}>{t('visitOurStore')}</Title>
                    </Divider>

                    <div className="map-description">
                        <Paragraph>
                            {t('mapDescription')}
                        </Paragraph>
                    </div>

                    <div className="map-wrapper">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15645.58!2d77.5855!3d11.2721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1715418123456!5m2!1sen!2sin"
                            width="100%"
                            height="400"
                            style={{ border: 0, borderRadius: '12px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Nellai Velmurgan Store Location"
                        ></iframe>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Contact;
