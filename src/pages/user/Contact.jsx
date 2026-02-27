import { motion } from 'framer-motion';
import { useSettings } from '../../contexts/SettingsContext';
import {
    Typography,
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Divider
} from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    SendOutlined
} from '@ant-design/icons';
import './Contact.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const { settings } = useSettings();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
        // Here you would typically send the form data to a backend
        alert('Thank you for reaching out! We will get back to you soon.');
        form.resetFields();
    };

    return (
        <div className="contact-page">
            {/* Header Section */}
            <motion.section
                className="contact-hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Title level={1} className="contact-title">Contact Us</Title>
                <Paragraph className="contact-subtitle">
                    We are here to assist you with your grocery needs. Reach out to us for any queries or feedback.
                </Paragraph>
            </motion.section>

            <section className="contact-container">
                <Row gutter={[40, 40]}>
                    {/* Left Column - Store Information */}
                    <Col xs={24} lg={10}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="info-card" bordered={false}>
                                <Title level={3} className="info-card-title">Store Information</Title>
                                <Divider />

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <EnvironmentOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>Address</Text>
                                        <Paragraph>
                                            {settings.storeName}<br />
                                            Sullipalayam, Perundurai – 638052<br />
                                            Tamil Nadu, India
                                        </Paragraph>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <PhoneOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>Phone Number</Text>
                                        <Paragraph>{settings.contactPhone}</Paragraph>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <MailOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>Email</Text>
                                        <Paragraph>{settings.contactEmail}</Paragraph>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <ClockCircleOutlined className="info-icon" />
                                    </div>
                                    <div className="info-text">
                                        <Text strong>Working Hours</Text>
                                        <Paragraph>
                                            6:00 AM – 10:30 PM<br />
                                            (Monday – Sunday)
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* Right Column - Contact Form */}
                    <Col xs={24} lg={14}>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="form-card" bordered={false}>
                                <Title level={3} className="info-card-title">Send us a Message</Title>
                                <Divider />
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    autoComplete="off"
                                    size="large"
                                >
                                    <Form.Item
                                        name="name"
                                        label="Name"
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                    >
                                        <Input placeholder="Enter your full name" />
                                    </Form.Item>

                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                rules={[
                                                    { required: true, message: 'Please enter your email' },
                                                    { type: 'email', message: 'Please enter a valid email' }
                                                ]}
                                            >
                                                <Input placeholder="Enter your email" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="phone"
                                                label="Phone Number"
                                                rules={[{ required: true, message: 'Please enter your phone number' }]}
                                            >
                                                <Input placeholder="Enter your phone number" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="message"
                                        label="Message"
                                        rules={[{ required: true, message: 'Please enter your message' }]}
                                    >
                                        <TextArea rows={5} placeholder="How can we help you?" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SendOutlined />}
                                            block
                                            className="submit-btn"
                                        >
                                            Submit Message
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                {/* Google Map Location Section */}
                <motion.div
                    className="map-section"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Divider className="map-divider">
                        <Title level={2}>📍 Visit Our Store</Title>
                    </Divider>

                    <div className="map-description">
                        <Paragraph>
                            Find us easily using the map below. We are located in Perundurai and open daily from 6:00 AM to 10:30 PM.
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
                            title="Nellai Velmurugan Store Location"
                        ></iframe>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Contact;
