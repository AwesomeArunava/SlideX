import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
        
        // Load slide deck by ID
        const response = await fetch(`http://localhost:3000/api/slide/${slideId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const slideDeck = await response.json();
        
        if (slideDeck?.slides) {
          // Initialize Redux state with the full slides array from the deck
          dispatch({
            type: 'slides/setSlides',
            payload: slideDeck.slides.map(slide => ({
              elements: slide.elements,
              history: [],
              redoStack: []
            }))
          });
          
          // Set initial current index
          const initialIndex = slideDeck.slides.length > 0 ? 0 : -1;
          dispatch(setCurrentIndex(initialIndex));
          
          if (initialIndex !== -1) {
            dispatch(updateSlideJson({
              slideIndex: initialIndex,
              canvasJson: slideDeck.slides[initialIndex].elements
            }));
          }
        }
      } catch (error) {
        console.error('Error loading slide:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlide();
  }, [slideId, dispatch]);

  // Auto-save when slides change
  const { slides, currentIndex } = useSelector((state) => state.slides);
  useEffect(() => {
    if (!loading) { // Only save after initial load
      const currentSlide = slides[currentIndex];
      if (currentSlide?.elements) {
        fetch('http://localhost:3000/api/slide/updateSlide', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slideDeckId: slideId,
            slides: slides
          }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to save slide');
          }
        })
        .catch(error => console.error('Error saving slide:', error));
      }
    }
  }, [slides, currentIndex, slideId, loading]);

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
