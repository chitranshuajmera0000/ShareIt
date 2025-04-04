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
                  className="h-12 sm:h-16 w-auto rounded-md my-2"
                />
              </Link>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="w-6 h-6 text-teal-600" />
              </button>
            </div>
            <nav
              className={`${isMenuOpen ? "block" : "hidden"
                } md:flex md:ml-10 md:space-x-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0`}
            >
              <a
                href="#features"
                className="block md:inline text-teal-600 hover:text-teal-800 font-medium mb-2 md:mb-0"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block md:inline text-teal-600 hover:text-teal-800 font-medium mb-2 md:mb-0"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="block md:inline text-teal-600 hover:text-teal-800 font-medium"
              >
                FAQ
              </a>
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
                className="border-1  mx-24 shadow-gray-300 group text-green-400 bg-coral-500 hover:bg-coral-600 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Rich Text Editor
            </h2>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              ShareIt comes packed with all the tools you need to create, publish, and grow your blog.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Edit3 size={20} />}
              title="Rich Text Editor"
              description="Create beautiful posts with our intuitive editor supporting images, videos, and formatting."
            />
            <FeatureCard
              icon={<Layout size={20} />}
              title="Responsive Design"
              description="Your blog looks great on any device, from desktop to mobile, with no extra work."
            />
            <FeatureCard
              icon={<Zap size={20} />}
              title="Fast Performance"
              description="Lightning-fast page loads and optimized images keep your readers engaged."
            />
            <FeatureCard
              icon={<Share2 size={20} />}
              title="Social Sharing"
              description="Integrated social sharing tools help spread your content across platforms."
            />
            <FeatureCard
              icon={<Users size={20} />}
              title="Community Building"
              description="Comments, reactions, and subscriber tools to build your audience."
            />
            <FeatureCard
              icon={<Play size={20} />}
              title="Media Integration"
              description="Easily embed videos, podcasts, and interactive content in your posts."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-purple-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of content creators who have chosen ShareIt for their publishing needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Testimonial
              content="ShareIt changed my writing experience. The editor is intuitive and the SEO tools helped me grow my audience by 200% in just 3 months."
              author="Sarah Johnson"
              role="Travel Blogger"
              avatar="data:image/jpeg;base64,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"
            />
            <Testimonial
              content="The responsive design and fast performance have made my blog a hit with my readers. I couldn’t ask for more!"
              author="John Doe"
              role="Tech Writer"
              avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMt0ZBJLBA8kZDvhMjBkQlDDpr55lFcXO5cg&s"
            />
            <Testimonial
              content="The community-building tools are fantastic. My readers are more engaged than ever before."
              author="Emily Carter"
              role="Lifestyle Blogger"
              avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38aoeKhpX4ixCnOaOIXPu1e5unG-44S0PIQ&s"
            />
          </div>
        </div>
      </section>

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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">Have questions? We've got answers.</p>
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
      <div className="">
        <footer className="bg-teal-900 text-white py-6 sm:py-12 md:h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="mb-4">
                  <div className="flex justify-center md:justify-start">

                    <img
                      src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742018435/upscalemedia-transformed_woy6ow.png"
                      alt="ShareIt Logo"
                      className="h-12 sm:h-16 w-auto content-center rounded-md mb-2"
                    />
                  </div>
                  <p className="text-teal-200 text-sm sm:text-base">
                    The modern blogging platform for creators and businesses.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product</h3>
                <ul className="flex space-x-6 sm:space-x-0 sm:space-y-2 sm:flex-col">
                  <li>
                    <a href="#features" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Templates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Integrations
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Resources</h3>
                <ul className="flex space-x-6 sm:space-x-0 sm:space-y-2 sm:flex-col">
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Guides
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
                <ul className="flex space-x-6 sm:space-x-0 sm:space-y-2 sm:flex-col">
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-teal-200 hover:text-white transition text-sm sm:text-base">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-teal-800 mt-6 sm:mt-12 pt-4 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-teal-200 text-xs sm:text-sm mb-3 md:mb-0">
                © {new Date().getFullYear()} ShareIt. All rights reserved.
              </p>
              <div className="flex space-x-6 sm:space-x-6">
                <a href="#" className="text-teal-200 hover:text-white transition text-xs sm:text-sm">
                  Terms
                </a>
                <a href="#" className="text-teal-200 hover:text-white transition text-xs sm:text-sm">
                  Privacy
                </a>
                <a href="#" className="text-teal-200 hover:text-white transition text-xs sm:text-sm">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;