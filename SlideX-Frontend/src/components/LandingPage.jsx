import React from "react";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import card1Image from "../assets/ai-powered-creativity2.png"
import card2Image from "../assets/smart-template2.png"
import card3Image from "../assets/no-design-skill-required.png"
import heroBackgroundImage from "../assets/hero-background.png"
import {Link} from "react-router-dom"
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-md fixed top-0 left-0 z-50">
     <Link to="/">
        <div className="text-2xl font-bold" style={{ color: "#E67423" }}>
          SlideX
        </div>
        </Link>
        <div className="hidden md:flex gap-6 text-gray-800 font-medium">
          <a href="#features" className="hover:text-[#E67423]">Features</a>
          <a href="#about" className="hover:text-[#E67423]">About</a>
          <a href="#contact" className="hover:text-[#E67423]">Contact</a>
        </div>
        <div className="hidden md:flex gap-3">
          <Link to="/login">
          <Button type="default" className="border-[#E67423] text-[#E67423] hover:!border-orange-500 hover:!text-orange-500">Login</Button>
          </Link>
          <Link to="/register">
          <Button type="primary" style={{ backgroundColor: "#E67423", borderColor: "#E67423" }}>Sign Up</Button>
          </Link>
        </div>
        <div className="md:hidden">
          <MenuOutlined className="text-2xl text-[#E67423]" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col justify-center items-center text-center px-4 py-32 bg-gradient-to-br from-orange-50 to-white mt-16  " style={{ backgroundImage: `url(${heroBackgroundImage})` }}>
        <h1 className="text-5xl font-bold text-white mb-4">Welcome to <span style={{ color: "#ffffff" }}>SlideX</span></h1>
        <p className="text-lg text-white max-w-xl mb-6">
          Create, manage, and share stunning slide decks effortlessly. SlideX makes presentation building fast, beautiful, and collaborative.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {/* <Button type="primary" size="large" className="hover:!border-orange-500 hover:!text-orange-500" >Get Started</Button> */}
          <Link to="/presentation">
          <Button type="default" size="large" className="border-[#E67423] text-[#E67423] hover:!border-orange-500 hover:!text-orange-500">Get Started</Button>
          </Link>
        </div>
      </section>

     {/* Why Choose SlideX */}
<section id="features" className="py-20 px-6 md:px-20 bg-[#fff2e6]">
<h2 className="text-3xl font-bold text-center mb-14 text-gray-900">
  Why Choose <span className="text-[#E67423]">SlideX</span>
</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
  {/* Card 1 */}
  <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition-all duration-300">
    <img
      src={card1Image}
      alt="AI Design"
      className="w-100 mx-auto mb-6"
    />
    <h3 className="text-xl font-semibold mb-2">
      AI-Powered Creativity
    </h3>
    <p className="text-gray-600">
      Let AI guide your design decisions with layout suggestions and
      auto-formatting.
    </p>
  </div>

  {/* Card 2 */}
  <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition-all duration-300">
    <img
      src={card2Image}
      alt="Templates"
      className="w-100 mx-auto mb-6"
    />
    <h3 className="text-xl font-semibold mb-2">Smart Templates</h3>
    <p className="text-gray-600">
      Choose from a wide variety of modern, beautiful templates crafted
      for impact.
    </p>
  </div>

  {/* Card 3 */}
  <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition-all duration-300">
    <img
      src={card3Image}
      alt="Easy to Use"
      className="w-100 mx-auto mb-6"
    />
    <h3 className="text-xl font-semibold mb-2">User-Friendly</h3>
    <p className="text-gray-600">
      Intuitive interface that anyone can use—no design skills required!
    </p>
  </div>
</div>
</section>

     {/* Call to Action */}
  <section className="bg-[#E67423] text-white py-20 text-center">
  <h2 className="text-3xl font-semibold mb-4">Slide Into Better Presentations</h2>
  <p className="mb-6 text-lg">Sign up today and transform your ideas into powerful stories.</p>
  <Link to="/presentation">
  <Button type="default" size="large" className="bg-white text-[#E67423] hover:text-orange-600">
    Create Your First Slide
  </Button>
  </Link>
</section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-500">
        © {new Date().getFullYear()} SlideX — All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
