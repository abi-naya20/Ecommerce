const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const UserModel = require('./models/User');
const Product = require('./models/Product')
const CartModel = require('./models/Cart')
const multer = require('multer');
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    optionsSuccessStatus: 204
}))
app.use(cookieParser())

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
app.post('/register', (req, res) => {
    const { username, email, password, mobile, role } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            UserModel.create({ username, email, password: hash, mobile, role })
                .then(user => res.json("Success"))
                .catch(err => res.json(err))
        }).catch(err => res.json(err))
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json("No record exists");
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (passwordMatch) {
            const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, "jwt-secret-key", { expiresIn: '1d' })
            res.cookie('token', token);
            return res.json({ status: "Success", role: user.role, token })
        }
        else {
            return res.json("Password incorrect")
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

app.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/src/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
app.post('/api/Product', upload.single('image'), async (req, res) => {
    try {
        const { productName, brandName, price, ratings, category, image, gram } = req.body; // Added gram here
        const images = req.file.originalname;
        const newItem = new Product({ productName, brandName, price, ratings, category, images, gram }); // Added gram here
        await newItem.save();
        res.status(201).json({ status: 400, message: 'Item created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/Product/:productName/:brandName', async (req, res) => {
    const { productName, brandName } = req.params;
    try {
        const response = await Product.findOne({
            productName: productName,
            brandName: brandName
        });
        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/Product/:id', async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { price: price },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/Product/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingItem = await Product.findById(id);
        if (!existingItem) {
            return res.status(404).json({ message: "Product not found" });
        }
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product removed" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/items/:brand/:category', async (req, res) => {
    const { brand, category } = req.params;
    try {
        let query = {};
        if (brand !== 'undefined' && category !== 'undefined') {
            query = { brandName: brand, category: category };
        } else if (brand !== 'undefined') {
            query = { brandName: brand };
        } else if (category !== 'undefined') {
            query = { category: category };
        }

        const items = await Product.find(query);
        res.json(items);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
})


// Add to Cart
app.post('/api/add', async (req, res) => {
    try {
        const { userEmail, productId } = req.body;
        if (!userEmail || !productId) {
            return res.status(400).json({ message: "User email and product Id are required" });
        }
        const existingCartItem = await CartModel.findOne({ userEmail: userEmail });
        if (existingCartItem) {
            return res.status(400).json({ message: "Item already exists in cart" });
        }
        const newCartItem = new CartModel({
            userEmail: userEmail,
            productId: productId
        })
        await newCartItem.save();
        return res.status(400).json({ message: "Item added to cart successfully" });
    }
    catch (error) {
        console.log("Error adding product", error);
        return res.status(400).json({ message: "Internal server error" });
    }
});


app.delete('/api/cart/remove/:productId/:userEmail', async (req, res) => {
    const { productId, userEmail } = req.params;
    try {
        const existingCartItem = await CartModel.findOne({ userEmail, productId });
        if (!existingCartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        await CartModel.findOneAndDelete({ userEmail, productId });
        res.status(200).json({ message: 'Product removed from cart successfully' });
    }
    catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Get Cart Items
app.get('/api/cart/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const items = await CartModel.find({ userEmail: email });
        res.json(items);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error" });
    }
});

app.post('/wishlist', async (req, res) => {
    try {
        const { userEmail, productId } = req.body;
        if (!userEmail || !productId) {
            return res.status(400).json({ message: 'User email and product ID are required' });
        }
        const existingWishListItem = await WishListModel.findOne({ userEmail, productId });
        if (existingWishListItem) {
            return res.status(400).json({ message: 'Item already exists in the wishlist' });
        }
        const newWishListItem = new WishListModel({
            userEmail: userEmail,
            productId: productId
        });
        await newWishListItem.save();
        return res.status(200).json({ message: 'Item added to wishlist successfully' });
    } catch (error) {
        console.error('Error adding item to wishlist:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/userWishlist/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const items = await WishListModel.find({ userEmail: email });
        res.json(items);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/wishlist/:productId/:userEmail', async (req, res) => {
    const { productId,userEmail } = req.params;
    try {
        const existingWishListItem = await WishListModel.findOne({ userEmail, productId });
        if (!existingWishListItem) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }
        await WishListModel.findOneAndDelete({ userEmail, productId });
        res.status(200).json({ message: 'Product removed from wishlist successfully' });
    } 
    catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(3001, () => {
    console.log("Server is Running");
})
