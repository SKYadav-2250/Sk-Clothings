# SKClothings - A Shopping Website

SKClothings is a fully functional shopping website built with modern web technologies. It allows users to browse and shop for clothing items. Upon placing an order, users receive an email confirmation with their order details.

## Technologies Used

### Frontend
- **HTML**
- **CSS**
- **Tailwind CSS**
- **JavaScript**

### Backend
- **Node.js**
- **Express.js**

### Database
- **MongoDB**

### Additional Tools
- **CORS**: Middleware to handle cross-origin requests
- **Dotenv**: To manage environment variables
- **Nodemailer**: To send email notifications
- **Body-Parser**: Middleware to parse incoming request bodies
- **Bcrypt**: To hash user passwords for secure storage

---

## Features

- User-friendly shopping interface
- Secure authentication system
- Integration with MongoDB for storing and retrieving data
- Sends order confirmation emails using Nodemailer
- Responsive design using Tailwind CSS

---

## Installation and Setup

Follow these steps to set up the project on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skclothings.git
   cd skclothings
    ```




npm install express mongodb cors dotenv nodemailer body-parser bcrypt




MONGODB_URL=your_mongodb_connection_string
EMAIL=your_email_address
PASSWORD=your_email_password
PORT=3000


node server.js


http://localhost:3000
