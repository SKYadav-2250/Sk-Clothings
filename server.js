
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { connectDB, insertCartItem, removeItem,disconnectDB,insertItem, fetchItems , fetchCartItems ,removeCartItem ,addUser, getUserByEmail } = require('./mongo');

 // Import functions from mongo.js
const session = require('express-session');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'login.html'));

});




app.use(session({
    secret: 'hero-hu-mai',
    resave: false,
    saveUninitialized: false, // Do not save empty sessions
    cookie: {
        httpOnly: true, // Prevent client-side JavaScript from accessing cookies
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // Session expiration time (1 day)
    },
}));


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}); 




// Gracefully handle application shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT received. Closing server...');
    await disconnectDB(); // Close the MongoDB connection
    process.exit(0); 
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing server...');
    await disconnectDB(); 
    process.exit(0); 
});





// API endpoint to handle user signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = { name, email, password: hashedPassword };
        await addUser(user); // Save the user in the database
        res.redirect('/login.html');
    } catch (error) {
        res.status(500).send('Error registering user: ' + error.message);
    }
});

// API endpoint to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        if (email === 'admin@gmail.com' && password === '0987654321') {
            return res.redirect('/admin.html'); // Redirect to admin page
        }
        
        const user = await getUserByEmail(email); // Retrieve user data by email
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userEmail = user.email;
            res.redirect('/index.html');
        } else {
            res.status(401).send('Invalid email or password.');
        }
    } catch (error) {
        res.status(500).send('Error logging in: ' + error.message);
    }
});

// Set up Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send the order email
function sendOrderEmail(userEmail, orderDetails) {
    // console.log("user email "  , userEmail)

   

   

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail, // Receiver's email (user's email)
        subject: 'Your Order Details',
        text:`
         Hello,

        Thank you for placing an order with us. Here are your order details:

        ${orderDetails.map(item => `${item.name} - ₹${item.price}`).join('\n')}

        Total Items: ${orderDetails.length}
        Total Price: ₹${orderDetails.reduce((total, item) => total + item.price, 0)}

        Best regards,
        Your E-commerce Team
    `,
    };
  
    



    
    
    return new Promise((resolve, reject) => {



transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
        console.error('Error sending email:', error); // Log the error
        console.log('Mail options:', mailOptions); // Log mail options for debugging
        return reject(error);
    }
    console.log('Email sent successfully:', info.response); // Log success message
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
}

// Order Route
app.post('/place-order', async (req, res) => {
    if (!req.session.userEmail) {
        return res.status(401).json({ 
            success: false,
            message: 'Please log in to place an order' 
        });
    }

    const userEmail = req.session.userEmail;
    const orderItems = req.body.items;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Your cart is empty'
        });
    }

    try {
        // Send email with order details
        await sendOrderEmail(userEmail, orderItems);
        
      //clear the cart
        await removeCartItem('all'); 

        res.status(200).json({ 
            success: true,
            message: 'Order placed successfully!',
            redirectUrl: 'conpayment.html'
        });
    } catch (error) {
        console.error('Order placement error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order. Please try again.'
        });
    }
});



app.post('/api/cart', (req, res) => {
    console.log("Received item:", req.body); // Log the incoming data
    const newItem = {
        name: req.body.name,
        price: req.body.price,
        picture: req.body.picture, // Include picture URL
    };

    insertCartItem(newItem) // Use the insert function from mongo.js
        .then(() => res.status(201).send('Item added to cart'))
        .catch(err => res.status(400).send('Error adding item to cart: ' + err));
});

app.get('/api/cart', async (req, res) => {
    try {
        const items = await fetchCartItems(); // Fetch items from the database
        res.status(200).json(items); // Send items as JSON response
    } catch (error) {
        res.status(500).send('Error fetching cart items: ' + error);
    }
});




// API to add an item
app.post('/api/items', async (req, res) => {
    const { section, name, price, image } = req.body;
    
    if (!section || !name || !price || !image) {
        return res.status(400).send('All fields are required.');
    }
    
    try {
        await insertItem({ section, name, price, image });
        res.status(201).send('Item added successfully.');
    } catch (error) {
        res.status(500).send('Error adding item: ' + error.message);
    }
});


// API to fetch items
app.get('/api/items', async (req, res) => {
    try {
        const items = await fetchItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).send('Error fetching items: ' + error.message);
    }
});

app.delete('/api/cart/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    
    console.log("deleting the item : " ,itemId)
    try {
        const success = await removeCartItem(itemId); // Call the removeCartItem function from mongo.js
        if (success) {
            res.status(200).json({ success: true, message: 'Item removed successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove item', error });
    }
});

app.delete('/api/items/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    
    
    console.log("Deleting item in list with ID:", itemId);
    try {
        const success = await removeItem(itemId); // Call the function to remove the item from the database
        if (success) {
            res.status(200).json({ success: true, message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete item', error });
    }
});



