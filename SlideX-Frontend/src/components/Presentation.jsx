import React from "react";
import { Avatar, Card, Dropdown, Input, Space, Typography, message } from "antd";
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, UserOutlined, MoreOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import image from "../assets/createNewSlide.png";
// import './tailwind.css';
import { useState, useEffect } from "react";
const { Title, Text } = Typography;
const { Meta } = Card;

const templates = [
  { title: "Blank presentation", color: "red", caption: "Start fresh" },
  // { title: 'Prototyping', color: '#10B981', caption: 'Wireframe template' },
  // { title: 'Consulting Proposal', color: '#3B82F6', caption: 'Business' },
  // { title: 'Marketing Plan', color: '#8B5CF6', caption: 'Strategy' },
  // { title: 'Team Retro', color: '#EF4444', caption: 'Meeting notes' },
];

const recentPresentations = [
  { title: "Q2 Report", date: "Opened 11 Apr 2025" },
  { title: "Product Launch", date: "Opened 10 Apr 2025" },
  { title: "Client Pitch", date: "Opened 9 Apr 2025" },
  { title: "Roadmap 2025", date: "Opened 8 Apr 2025" },
];

const Presentation = () => {
  const [user, setUser] = useState(null);
  const [userSlides, setUserSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserSlides(parsedUser.id);
    } else {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        fetchSessionSlides(sessionId);
      }
    }
  }, []);

  const fetchUserSlides = async (userId) => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/slide/showSlides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch slides');
      
      setUserSlides(data.slides || []);
    } catch (error) {
      messageApi.error(error.message || 'Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionSlides = async (sessionId) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/slide/showSlides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch slides');
      
      setUserSlides(data.slides || []);
    } catch (error) {
      messageApi.error(error.message || 'Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const handleSlideClick = (slideId) => {
    messageApi.success('Redirecting to editor...');
    setTimeout(() => navigate(`/editor/${slideId}`), 1500);
  };
  const createNewSlide = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const authToken = localStorage.getItem('authToken');
      let sessionId = localStorage.getItem('sessionId');
      
      // Generate session ID if not exists
      if (!user && !sessionId) {
        sessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
      }

      const response = await fetch('http://localhost:3000/api/slide/createSlide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify({
          ...(user ? { userId: user.id } : { sessionId })
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create slide');
      }

      messageApi.success('New slide created! Redirecting to editor...');
      setTimeout(() => navigate(`/editor/${data.newSlideId}`), 1500);
    } catch (error) {
      messageApi.error(error.message || 'Failed to create new slide');
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const menuItems = (slideId) => [
    { 
      key: "1", 
      label: "Open",
      onClick: () => handleSlideClick(slideId)
    },
    { 
      key: "4", 
      label: "Remove",
      onClick: () => handleDeleteSlide(slideId)
    },
  ];

  const handleDeleteSlide = async (slideId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('You must be logged in to delete slides');
      }

      const response = await fetch('http://localhost:3000/api/slide/deleteSlide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify({ userId, slideId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete slide');
      
      messageApi.success('Slide deleted successfully');
      fetchUserSlides(userId);
    } catch (error) {
      messageApi.error(error.message || 'Failed to delete slide');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9fa] to-gray-100">
      {contextHolder}
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#E67423] mr-8">SlideX</h1>
        </div>

        {/* <Input.Search 
          placeholder="Search presentations" 
          enterButton={<SearchOutlined />} 
          className="max-w-2xl"
        /> */}

        <Space>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <div className="px-4 py-2">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-gray-600 text-sm">{user?.email}</p>
                    </div>
                  ),
                },
                {
                  type: 'divider',
                },
                {
                  key: '2',
                  label: 'Logout',
                  onClick: () => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    messageApi.success('Logged out successfully');
                    navigate('/');
                  },
                }
              ],
            }}
            trigger={['click']}
          >
            <Avatar
              className="bg-[#E67423] cursor-pointer"
              style={{ backgroundColor: '#E67423' }}
            >
              {user ? user.name[0].toUpperCase() : <UserOutlined />}
            </Avatar>
          </Dropdown>
        </Space>
      </nav>

      {/* Template Section */}
      <section className="p-8">
        <Title level={4} className="mb-4">
          Start a new presentation
        </Title>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {templates.map((template) => (
            <Card
              key={template.title}
              className="w-48  hover:cursor-pointer"
              cover={
           
                <div className="border">
                  <img src={image} alt="Create slide" />
                </div>
              }
              onClick={createNewSlide}
            >
              <Meta
                title={
                  <span className="text-sm text-amber-600 font-semibold">
                    {template.title}
                  </span>
                }
              
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Presentations */}
      <section className="p-8 pt-0">
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Recent presentations</Title>
          <Dropdown menu={{ items: menuItems }}>
            <Text className="text-[#E67423] cursor-pointer">
              Owned by anyone ▼
            </Text>
          </Dropdown>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div>Loading slides...</div>
          ) : userSlides.length > 0 ? (
            userSlides.map((slide) => (
              <Card
                key={slide._id}
                hoverable
                className="rounded-xl"
                onClick={() => handleSlideClick(slide._id)}
                cover={
                  <div className="h-48 bg-gray-100 rounded-t-xl flex items-center justify-center">
                    <img src={image} alt="" />
                  </div>
                }
                actions={[
                  <Dropdown menu={{ items: menuItems(slide._id) }} key="more">
                    <MoreOutlined className="text-gray-400 hover:text-[#E67423]" />
                  </Dropdown>,
                ]}
              >
                <Meta
                  title={slide.title || 'Untitled Presentation'}
                  description={
                    <Text type="secondary" className="text-xs">
                      {new Date(slide.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  }
                />
              </Card>
            ))
          ) : (
            <div>No slides found. Create your first presentation!</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Presentation;
