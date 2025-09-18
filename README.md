


# MERN Authentication System 🚀

A modern full-stack **MERN (MongoDB, Express, React, Node.js)** authentication system with **JWT-based secure login**, **email & phone OTP verification**, and seamless frontend-backend integration. Perfect for real-world applications and deployment.

---

## 🌐 Live Demo

- **Frontend:** [https://mern-authentication-frontend-beta.vercel.app](https://mern-authentication-frontend-beta.vercel.app)  
- **Backend API:** [https://mern-authentication-backend-01mj.onrender.com/](https://mern-authentication-backend-01mj.onrender.com/)

---

## 📂 Project Structure

```

Login\_Signup/
├─ backend/
│   ├─ server.js
│   ├─ app.js
│   └─ config.env
├─ frontend/
│   ├─ src/
│   │   ├─ pages/
│   │   ├─ components/
│   │   └─ config.js
│   └─ package.json

````

## ⚡ Features

- **Secure Authentication:** JWT-based login with httpOnly cookies  
- **Email & Phone OTP Verification:** Twilio & Nodemailer integration  
- **Protected Routes:** Frontend routes secured based on login status  
- **Responsive UI:** Smooth React-based user experience  
- **RESTful API:** Express.js backend with MongoDB Atlas  
- **Deployment Ready:** Frontend on Vercel, Backend on Render  
- **Extensible & Modular:** Clean, scalable code structure for future features

---

## 🛠 Tech Stack

**Frontend:** React.js, Vite, Axios, React Router  
**Backend:** Node.js, Express.js, JWT, bcrypt, dotenv, Twilio, Nodemailer  
**Database:** MongoDB Atlas, Mongoose  
**Security & Auth:** httpOnly cookies, CORS, input validation  
**Deployment:** Render (Backend), Vercel (Frontend)  
**Other Tools:** Git, GitHub, Postman, ESLint & Prettier

---

## 💻 Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/divya-gupta2004/MERN-Authentication-System.git
cd Login_Signup
````

### 2. Backend Setup

```bash
cd backend
npm install
```

* Create `.env` file (based on `config.env`):

```env
PORT=4001
MONGODB_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone
SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=gmail
SMTP_PORT=465
SMTP_MAIL=your_email
SMTP_PASSWORD=your_email_app_password
JWT_EXPIRE=7d
JWT_SECRET_KEY=your_jwt_secret
COOKIE_EXPIRE=7
```

* Start backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

* Create `.env` file:

```env
VITE_API_URL=http://localhost:4001/api/v1
```

* Start frontend:

```bash
npm run dev
```

* Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔒 Security Notes

* JWT stored in **httpOnly cookies** for secure authentication
* CORS configured for deployed frontend domain
* Sensitive credentials are never committed to GitHub

---

## 📫 Contact

**Divya Gupta**
GitHub: [https://github.com/divya-gupta2004](https://github.com/divya-gupta2004)
Email: [divyagupta20042004@gmail.com](mailto:divyagupta20042004@gmail.com)

```




