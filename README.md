# ShareIt - A Modern Blogging Platform ✨

<p align="center">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742018435/upscalemedia-transformed_woy6ow.png" width="800">
</p>

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-blue?style=for-the-badge&logo=vercel)](https://share-it-nine.vercel.app/)
[![License](https://img.shields.io/github/license/chitranshuajmera0000/ShareIt?style=for-the-badge)](LICENSE)

## 🌟 Introduction
ShareIt is a modern and minimalistic **blogging platform** that allows users to create, share, and explore articles. Built with **React (Vite) + Hono + Prisma + NeonDB**, it offers seamless performance and an intuitive UI.

## ✨ Features
✅ **User Authentication (JWT-based with bcrypt password hashing)** 🔒
✅ **Create, Edit & Delete Blogs** ✍️  
✅ **Rich Text Editor for Writing** 📝  
✅ **Optimized Performance with Prisma Accelerate** 🚀  
✅ **Cloudinary for Image Storage** 🖼️  
✅ **Blog Categories (Organize blogs by topics)** 🗂️
✅ **Responsive Design (Mobile & Desktop)** 📱💻  
✅ **SEO Optimized** 🔍  
✅ **Rate Limiting & Security Measures** 🔒  

---
## 📸 Screenshots
### **Homepage**
<p align="center">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1743455500/Screenshot_2025-04-01_014656_sn6ped.png" width="500">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1743455501/Screenshot_2025-04-01_014708_gfd90z.png" width="500">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1743455501/Screenshot_2025-04-01_014715_nwqpvg.png" width="500">
</p>

### **Blog Page**
<p align="center">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1743455502/Screenshot_2025-04-01_023903_mnhrbn.png" width="500">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1743455502/Screenshot_2025-04-01_023851_edvzqz.png" width="500">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1744778785/Screenshot_2025-04-16_101025_id13yl.png" width="500">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1743455501/Screenshot_2025-04-01_023829_i46nwb.png" width="500">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1744778878/Screenshot_2025-04-16_100831_mjtiuw.png" width="500">
  <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1744778785/Screenshot_2025-04-16_101033_h5pvn0.png" width="500">
</p>

---
## 🛠️ Tech Stack
- **Frontend**: React (Vite) + TailwindCSS  
- **Backend**: Hono (Cloudflare Workers)  
- **Database**: Prisma + NeonDB  
- **Authentication**: JWT-based auth  
- **Storage**: Cloudinary (for images)  
- **Deployment**: Vercel  

---
## 🚀 Live Demo
[🔗 Live Demo](https://share-it-nine.vercel.app/)  

---
## 🛠️ Installation & Setup
### **1⃣ Clone the Repository**
```sh
 git clone https://github.com/chitranshuajmera0000/ShareIt.git
 cd ShareIt
```
### **2⃣ Install Dependencies**
```sh
 npm install
```
### **3⃣ Setup Environment Variables**
Create a `.env` file and add:
```
DATABASE_URL=your_neondb_url
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_url
```
For **Prisma Accelerate**, add the accelerated URL in `wrangler.toml`.

### **4⃣ Run Locally**
```sh
 npm run dev
```
App runs on **http://localhost:5173/**.

### **5⃣ Deploy to Vercel**
```sh
 vercel --prod
```

---
## 🎯 API Endpoints
### **Auth Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/user/register` | Register a new user |
| `POST` | `/api/v1/user/login` | Authenticate user |

### **Blog Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/blog` | Fetch all blogs |
| `POST` | `/api/v1/blog` | Create a new blog |
| `GET`  | `/api/v1/blog/:id` | Fetch a single blog |
| `PUT`  | `/api/v1/blog/:id` | Update a blog |
| `DELETE` | `/api/v1/blog/:id` | Delete a blog |

---
## 🤝 Contributing
We welcome contributions! To get started:
1. Fork the repo 🍽️
2. Create a new branch (`git checkout -b feature-branch`) ✨
3. Commit your changes (`git commit -m "Added a cool feature"`) 📌
4. Push to the branch (`git push origin feature-branch`) 🚀
5. Open a **Pull Request** 🛠️

---
## 📝 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---
## 💌 Contact
For any queries, feel free to reach out:
📧 Email: 1ms23ai014@msrit.edu  
🌐 GitHub: [@chitranshuajmera0000](https://github.com/chitranshuajmera0000)  
🚀 LinkedIn: [Profile](https://www.linkedin.com/in/chitranshu-ajmera-b72878297/)

---
**Star ⭐ this repo if you found it useful!** 🎉
