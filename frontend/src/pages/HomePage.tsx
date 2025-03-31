import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Edit3, Zap, Layout, Share2, Users, Play, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white rounded-2xl p-4 sm:p-6 border border-teal-100 shadow-md transition-all duration-300 h-full"
    >
      <div className="rounded-full bg-teal-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-teal-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </motion.div>
  );
};

// Testimonial Component
const Testimonial = ({
  content,
  author,
  role,
  avatar
}: {
  content: string;
  author: string;
  role: string;
  avatar: string;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-purple-100">
      <div className="flex items-center space-x-2 mb-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-coral-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
      <p className="text-gray-600 mb-4 italic text-sm sm:text-base">"{content}"</p>
      <div className="flex items-center">
        <img
          src={avatar}
          alt={author}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800 text-sm sm:text-base">{author}</p>
          <p className="text-teal-600 text-xs sm:text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742018435/upscalemedia-transformed_woy6ow.png"
                  alt="ShareIt Logo"
                  className="h-12 sm:h-20 w-auto rounded-md my-2"
                />
              </Link>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="w-6 h-6 text-teal-600" />
              </button>
            </div>
            <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:ml-10 md:space-x-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0`}>
              <a href="#features" className="block md:inline text-teal-600 hover:text-teal-800 font-medium mb-2 md:mb-0">Features</a>
              <a href="#testimonials" className="block md:inline text-teal-600 hover:text-teal-800 font-medium mb-2 md:mb-0">Testimonials</a>
              <a href="#faq" className="block md:inline text-teal-600 hover:text-teal-800 font-medium">FAQ</a>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/signup" className="text-coral-500 hover:text-coral-700 transition-colors">
                <button>Sign up</button>
              </Link>
              <button
                onClick={() => navigate("/signin")}
                className="bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              Share Your Ideas With The World
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10"
            >
              Create stunning blog posts with our powerful editor. Connect with readers, grow your audience, and build your personal brand.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
            >
              <button
                onClick={() => navigate("/signup")}
                className="group text-green-400 bg-coral-500 hover:bg-coral-600 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editor Preview Section */}
      <section className="py-12 sm:py-16 bg-teal-50" id="demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Rich Text Editor</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Our intuitive editor comes with all the features you need to create beautiful, engaging content.
            </p>
          </div>
          <div className="rounded-2xl bg-white shadow-2xl overflow-hidden border border-teal-100">
            <div className="border-b border-teal-200 bg-teal-50 px-4 py-3 flex items-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-coral-500 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-teal-500 rounded-full"></div>
              </div>
              <div className="ml-3 sm:ml-4 text-gray-700 font-medium text-sm sm:text-base">New Blog Post</div>
            </div>
            <div className="p-4 sm:p-8 min-h-64">
              <div className="flex flex-wrap mb-4 sm:mb-6 bg-teal-100 p-2 rounded-lg text-xs sm:text-sm text-gray-600 cursor-pointer gap-2">
                <div className="px-2 py-1 rounded-md bg-white shadow-sm">B</div>
                <div className="px-2 py-1">I</div>
                <div className="px-2 py-1">U</div>
                <div className="px-2 py-1">H1</div>
                <div className="px-2 py-1">H2</div>
                <div className="px-2 py-1">🔗</div>
                <div className="px-2 py-1">📷</div>
                <div className="px-2 py-1">📹</div>
                <div className="px-2 py-1">📊</div>
                <div className="px-2 py-1">📝</div>
              </div>
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  How to Create Engaging Content
                </h1>
                <p className="text-gray-700 text-sm sm:text-base">
                  Great content starts with understanding your audience...
                </p>
                <div className="aspect-video rounded-lg overflow-hidden bg-teal-200 flex items-center justify-center text-gray-400 my-4">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/ZlbHdYMWSOA"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  When creating your blog post, remember to include visuals, quotes, and clear sections...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              ShareIt comes packed with all the tools you need to create, publish, and grow your blog.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard icon={<Edit3 size={20} />} title="Rich Text Editor" description="Create beautiful posts with our intuitive editor supporting images, videos, and formatting." />
            <FeatureCard icon={<Layout size={20} />} title="Responsive Design" description="Your blog looks great on any device, from desktop to mobile, with no extra work." />
            <FeatureCard icon={<Zap size={20} />} title="Fast Performance" description="Lightning-fast page loads and optimized images keep your readers engaged." />
            <FeatureCard icon={<Share2 size={20} />} title="Social Sharing" description="Integrated social sharing tools help spread your content across platforms." />
            <FeatureCard icon={<Users size={20} />} title="Community Building" description="Comments, reactions, and subscriber tools to build your audience." />
            <FeatureCard icon={<Play size={20} />} title="Media Integration" description="Easily embed videos, podcasts, and interactive content in your posts." />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-purple-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of content creators who have chosen ShareIt for their publishing needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Testimonial
              content="ShareIt changed my writing experience. The editor is intuitive and the SEO tools helped me grow my audience by 200% in just 3 months."
              author="Sarah Johnson"
              role="Travel Blogger"
              avatar="data:image/jpeg;base64,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2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a██

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-teal-600 to-coral-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">Ready to Start Blogging?</h2>
          <p className="text-lg sm:text-xl text-teal-100 mb-8 sm:mb-10 max-w-3xl mx-auto">
            Join thousands of writers, creators, and businesses who trust ShareIt for their content needs.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-teal-600 hover:text-teal-700 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Create Your Blog Today
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-20 bg-white" id="faq">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Have questions? We've got answers.
            </p>
          </div>
          <div className="space-y-6 sm:space-y-8">
            {[
              {
                q: "Do I need coding skills to use ShareIt?",
                a: "Not at all! ShareIt is designed to be user-friendly for everyone. Our intuitive editor and templates make it easy to create beautiful content without any coding knowledge."
              },
              {
                q: "Can I import my existing blog?",
                a: "Yes! We provide tools to import content from WordPress, Medium, and other popular platforms. Your posts, images, and formatting will be preserved."
              },
              {
                q: "How do I monetize my blog?",
                a: "ShareIt supports various monetization options including native ad integration, membership features, and affiliate marketing tools to help you earn from your content."
              },
              {
                q: "Is there a free plan available?",
                a: "Yes, we offer a generous free plan that lets you publish up to 10 posts per month with all core features. Premium plans unlock additional tools and remove limits."
              },
              {
                q: "Can I use my own domain name?",
                a: "Absolutely! You can connect your custom domain on all paid plans, or use our free subdomain (yourblog.ShareIt.com) on the free plan."
              }
            ].map((item, i) => (
              <div key={i} className="border-b border-teal-200 pb-4 sm:pb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742018435/upscalemedia-transformed_woy6ow.png"
                  alt="ShareIt Logo"
                  className="h-12 sm:h-16 w-auto rounded-md my-2"
                />
              </div>
              <p className="text-teal-200 text-sm sm:text-base">
                The modern blogging platform for creators and businesses.
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Features</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Templates</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Documentation</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Guides</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">API</a></li>
                <li><a href="#faq" className="text-teal-200 hover:text-white transition text-sm sm:text-base">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">About</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Blog</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Careers</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-teal-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-teal-200 text-xs sm:text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ShareIt. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-teal-200 hover:text-white transition text-xs sm:text-sm">Terms</a>
              <a href="#" className="text-teal-200 hover:text-white transition text-xs sm:text-sm">Privacy</a>
              <a href="#" className="text-teal-200 hover:text-white transition text-xs sm:text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;