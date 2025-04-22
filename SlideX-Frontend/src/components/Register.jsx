import React from "react";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import SlideX from '../assets/slidex.png'
const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  // const onFinish = (values)=>{
  //   console.log("hello", values);
    
  // }
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    console.log("value:", values)
    setLoading(true);
    try {
      // Get sessionId from localStorage if exists (for guest conversion)
      const sessionId = localStorage.getItem('sessionId');
      
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          ...(sessionId ? { sessionId } : {}) // Include sessionId if exists
        }),
      });

      const data = await response.json();
      console.log("data",data)
      if (!response.ok) {
        console.log("Message",data.message)
        throw new Error(data.message || 'Registration failed');
      }
      console.log("Registration successful, now showing message");
      
      // If there was a guest session, migrate slides to new user
      if (sessionId) {
        try {
          const migrateResponse = await fetch('http://localhost:3000/api/auth/guest-to-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
              sessionId,
              userId: data.user.id
            })
          });
          
          if (!migrateResponse.ok) {
            throw new Error('Failed to migrate guest slides');
          }
          
          localStorage.removeItem('sessionId');
          messageApi.success('Registration successful! Your guest slides have been migrated. Please check your email to verify your account.');
        } catch (migrateError) {
          console.error('Migration error:', migrateError);
          messageApi.warning('Registration successful, but could not migrate guest slides. Please check your email to verify your account.');
        }
      } else {
        messageApi.success('Registration successful! Please check your email to verify your account.');
      }
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.log("value:", values)
      messageApi.error(error.message || 'An error occurred during registration');
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
            Create your SlideX account
          </Title>
          <p className="text-sm text-gray-500">It’s quick and easy</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          name="register-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              size="large"
              placeholder="John Doe"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              size="large"
              placeholder="john@example.com"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ backgroundColor: "#E67423", borderColor: "#E67423" }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 font-semibold">
            Login here
          </a>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
