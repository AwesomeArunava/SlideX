

{/* Navbar */}
<nav className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-md fixed top-0 left-0 z-50">
<div className="text-2xl font-bold" style={{ color: "#E67423" }}>
  SlideX
</div>
<div className="hidden md:flex gap-6 text-gray-800 font-medium">
  <a href="#features" className="hover:text-[#E67423]">Features</a>
  <a href="#about" className="hover:text-[#E67423]">About</a>
  <a href="#contact" className="hover:text-[#E67423]">Contact</a>
</div>
<div className="hidden md:flex gap-3">
  <Button type="default" className="border-[#E67423] text-[#E67423] hover:!border-orange-500 hover:!text-orange-500">Login</Button>
  <Button type="primary" style={{ backgroundColor: "#E67423", borderColor: "#E67423" }}>Sign Up</Button>
</div>
<div className="md:hidden">
  <MenuOutlined className="text-2xl text-[#E67423]" />
</div>
</nav>

 {/* Hero Section */}
 <section className="flex-grow flex flex-col justify-center items-center text-center px-4 py-32 bg-gradient-to-br from-orange-50 to-white mt-16">
 <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to <span style={{ color: "#E67423" }}>SlideX</span></h1>
 <p className="text-lg text-gray-600 max-w-xl mb-6">
   Create, manage, and share stunning slide decks effortlessly. SlideX makes presentation building fast, beautiful, and collaborative.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
   <Button type="primary" size="large" style={{ backgroundColor: "#E67423", borderColor: "#E67423" }}>Get Started</Button>
   <Button type="default" size="large" className="border-[#E67423] text-[#E67423] hover:!border-orange-500 hover:!text-orange-500">Learn More</Button>
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
      src="/images/ai-design.png"
      alt="AI Design"
      className="h-40 mx-auto mb-6"
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
      src="/images/templates.png"
      alt="Templates"
      className="h-40 mx-auto mb-6"
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
      src="/images/user-friendly.png"
      alt="Easy to Use"
      className="h-40 mx-auto mb-6"
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
  <Button type="default" size="large" className="bg-white text-[#E67423] hover:text-orange-600">
    Create Your First Slide
  </Button>
</section>