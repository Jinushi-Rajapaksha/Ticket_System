const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');


// Load environment variables
dotenv.config();




const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));

// // Root Route
// app.get('/', (req, res) => {
//   res.send('Ticketing System Backend');
// });

// After other routes
app.use('/api/users', require('./routes/users'));
app.use('/api/configuration', require('./routes/configuration'));
app.use('/api/vendor', require('./routes/vendor'));
app.use('/api/customer', require('./routes/customer'));
app.use('/api/ticketPool', require('./routes/ticketPool'));


// Connect to MongoDB
const uri = 'mongodb+srv://rwjinushi:Jinushi2001@cluster0.rzl5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('MongoDB Error:', error);
    }
};
connect();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
