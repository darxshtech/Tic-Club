<div align="center">
  <h1>Technical Innovation Club (TIC) Website</h1>
  <p>A modern, responsive website for the Technical Innovation Club at SRTTC, featuring event management, membership registration, and interactive features.</p>
  
  [![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_DEPLOY_ID/deploy-status)](https://ticlub.netlify.app)
  ![GitHub last commit](https://img.shields.io/github/last-commit/darxshtech/Project-1---TIC-club)
  ![GitHub repo size](https://img.shields.io/github/repo-size/darxshtech/Project-1---TIC-club)
  
  [Live Demo](https://ticlub.netlify.app) | [Report Bug](https://github.com/darxshtech/Project-1---TIC-club/issues) | [Request Feature](https://github.com/darxshtech/Project-1---TIC-club/issues)
</div>

## 🚀 Features

### 🌐 Modern UI/UX
- Fully responsive design that works on all devices
- Smooth animations and transitions
- Dark/Light mode support
- Interactive components with hover effects

### 📅 Event Management
- Upcoming events showcase
- Interactive calendar view
- Event registration system
- Past events gallery with filtering

### 👥 Membership System
- Online membership registration
- Form validation with instant feedback
- reCAPTCHA integration for security
- Email notifications for successful registration

### 🖼️ Media Gallery
- Photo and video gallery
- Achievement showcase
- Team member profiles
- Event highlights

### 🤖 Interactive Features
- AI-powered chatbot for assistance
- Dynamic content loading
- Real-time form validation
- Smooth page transitions

## 🖥️ Screenshots

| Home Page | Events | Membership |
|-----------|--------|------------|
| ![Home Page](https://via.placeholder.com/300x200.png?text=Home+Page) | ![Events](https://via.placeholder.com/300x200.png?text=Events) | ![Membership](https://via.placeholder.com/300x200.png?text=Membership) |

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Styling with Flexbox and Grid
- **JavaScript** - Interactive features
- **Swiper.js** - Touch slider
- **Font Awesome** - Icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Nodemailer** - Email services

### Security
- **reCAPTCHA** - Bot protection
- **Helmet.js** - Security headers
- **Express Rate Limit** - Prevent abuse
- **Input Validation** - Data sanitization

## 🚀 Deployment

### Netlify Deployment
1. Fork this repository
2. Connect your Netlify account to GitHub
3. Select this repository for deployment
4. Configure build settings:
   - Build command: (leave empty for static sites)
   - Publish directory: `pages`
5. Deploy site

### Local Development
```bash
# Clone the repository
git clone https://github.com/darxshtech/Project-1---TIC-club.git
cd Project-1---TIC-club

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) for icons
- [Swiper.js](https://swiperjs.com/) for sliders
- [Netlify](https://www.netlify.com/) for hosting

---

<div align="center">
  Made with ❤️ by [Your Name]
</div>
- Secure headers with Helmet

## 📁 Project Structure

```
ticlub/
├── components/          # Reusable HTML components
├── config/             # Configuration files
├── css/               # Stylesheets
├── images/            # Media assets
│   ├── achievements/
│   ├── events/
│   ├── gallery/
│   ├── members/
│   └── icons/
├── js/                # JavaScript files
├── pages/             # HTML pages
└── server/            # Backend server
    └── index.js       # Main server file
```

## ⚙️ Environment Variables

Required environment variables:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_uri
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
SESSION_SECRET=your_session_secret
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Darxsh/ticlub.git
   cd ticlub
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the required environment variables

4. Start the server:
   ```bash
   npm start
   ```

## 🔒 Security Features

- **Input Validation**: Express-validator for form inputs
- **Data Sanitization**: MongoDB query sanitization
- **Rate Limiting**: API request rate limiting
- **Security Headers**: Helmet for secure HTTP headers
- **Session Security**: Secure session management
- **CORS**: Configured Cross-Origin Resource Sharing

## 📱 Responsive Design

The website is fully responsive and tested on:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project Lead**: [Chaitanya Patil]
- **Frontend Development**: [Chaitanya Patil]
- **Backend Development**: [Chaitanya Patil]
- **UI/UX Design**: [Product Development & Technical Support and Infrastructure]

## 📞 Contact

For any queries regarding the project, please contact:
- Email: [darshcode7@gmail.com]
