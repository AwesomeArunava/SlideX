import React from "react";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Slide from "./Slide";
import SlideX from '../assets/slidex.png'
const { Title } = Typography;

const LoginPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      messageApi.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      messageApi.error(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center p-4">
      {contextHolder}
      <Card
        className="shadow-xl rounded-2xl w-full max-w-md border border-orange-200"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="text-center mb-6">
          <img
            src={SlideX}
            alt="SlideX"
            className="mx-auto mb-2 rounded-full"
          />
          <Title level={3} style={{ color: "#E67423", marginBottom: 0 }}>
            Welcome Back to SlideX
          </Title>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="user@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                backgroundColor: "#E67423",
                borderColor: "#E67423",
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-orange-500 font-semibold">
            Register now
          </a>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
