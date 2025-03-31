// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import { Signup } from './pages/Signup'
// import { Signin } from './pages/Signin'
// import { Blog } from './pages/Blog'
// import { Blogs } from './pages/Blogs'
// import { Publish } from './pages/Publish'
// import Profile from './pages/Profile'
// import MyBlogs from './pages/MyBlogs'
// import { EditBlog } from './pages/EditBlog'
// import Info from './pages/Info'
// import AuthorProfile from './pages/AuthorProfile'
// import HomePage from './pages/HomePage'


// function App() {

//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path='/' element={<HomePage></HomePage>}></Route>
//           <Route path='/signup' element={<Signup />}></Route>
//           <Route path='/signin' element={<Signin />}></Route>
//           <Route path='/blog/:id' element={<Blog />}></Route>
//           <Route path='/blogs' element={<Blogs />}></Route>
//           {/* <Route path='/' element={<Blogs />}></Route> */}
//           <Route path='/publish' element={<Publish />}></Route>
//           <Route path='/profile' element={<Profile />}></Route>
//           <Route path='/myblogs' element={<MyBlogs></MyBlogs>}></Route>
//           <Route path='/editblog/:id' element={<EditBlog></EditBlog>}></Route>
//           <Route path='/info' element={<Info></Info>}></Route>
//           <Route path='/:author/:id' element={<AuthorProfile></AuthorProfile>}></Route>

//         </Routes>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App















import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import Profile from "./pages/Profile";
import MyBlogs from "./pages/MyBlogs";
import { EditBlog } from "./pages/EditBlog";
import Info from "./pages/Info";
import AuthorProfile from "./pages/AuthorProfile";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AlertProvider } from "./components/AlertContext"; // Import AlertProvider

function App() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/info" element={<Info />} />
            <Route path="/:author/:id" element={<AuthorProfile />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myblogs" element={<MyBlogs />} />
            <Route path="/editblog/:id" element={<EditBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
