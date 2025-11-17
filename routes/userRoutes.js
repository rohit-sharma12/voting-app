const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        const newUser = new User(data);
        const response = await newUser.save();

        const payload = {
            id: response.id,
        };
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is :', token);

        res.status(200).json({ response: response, token: token })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//Login Route

router.post('/login', async (req, res) => {
    try {
        //extract aadharCardNumber and password from request body
        const { aadharCardNumber, password } = req.body;

        //find user by aadharCardNumber
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid aadharCardNumber or password' });
        }

        //generate token
        const payload = {
            id: user.id,
        }
        const token = generateToken(token);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Server Error' })
    }
})

//profile Route

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status.apply(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        res.status.apply(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router