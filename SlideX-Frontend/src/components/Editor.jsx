import React from "react";


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
  
  return(

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
