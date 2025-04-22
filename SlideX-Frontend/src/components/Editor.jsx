import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Flex, Layout } from "antd";
import '../App.css'; 
import Navbar from "./Navbar";
import Slide from "./Slide";
import Canvas from "./Canvas";



const { Header, Footer, Sider, Content } = Layout;

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#111111",
  backgroundColor: "#ffffff",
  border: ".005px solid black",
  display:"flex",
  justifyContent: "center",
  alignItems: "center"
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#111111",
  backgroundColor: "#ffffff",
  border: ".005px solid black",
  padding:"5px",
  overflowY:"auto"
};


const footerStyle = {
  textAlign: "center",
  color: "#111111",
  backgroundColor: "#ffffff",
  height:"2%",
  border: ".005px solid black"
};
const layoutStyle = {
 
  overflow: "hidden",
  width: "100%",
  height:"100vh",
  maxWidth: "100%",
};
const Editor = () => {
  const { id: slideId } = useParams();
  console.log("SlideId: ", slideId)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlide = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const sessionId = localStorage.getItem('sessionId');
        
        // Load existing slides
        const response = await fetch('/api/slide/showSlides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: userId || null,
            sessionId: userId ? null : sessionId
          }),
        });

        const { slides } = await response.json();
        const currentSlide = slides.find(slide => slide._id === slideId);

        if (currentSlide) {
          dispatch(setCurrentIndex(0));
          dispatch(updateSlideJson({
            slideIndex: 0,
            canvasJson: currentSlide.elements
          }));
        }
      } catch (error) {
        console.error('Error loading slide:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlide();
  }, [slideId, dispatch]);

  if (loading) {
    return <div>Loading slide...</div>;
  }

  return (

    <Layout style={layoutStyle}>
     <Navbar/>
      <Layout>
      <Sider width="17%" style={siderStyle} className="hide-scrollbar">
        <Slide/>
      </Sider>
      <Layout>
        <Content style={contentStyle}><Canvas/></Content>
        <Footer  style={footerStyle}>© {new Date().getFullYear()} SlideX. All Rights Reserved. Crafted with ❤️ by Arunava.</Footer>
        </Layout>
      </Layout>
    </Layout>

  
   
  
  )
};
export default Editor;
