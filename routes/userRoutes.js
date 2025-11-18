const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

// ------------------ SIGNUP ------------------
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        const newUser = new User(data);
        const response = await newUser.save();

        const payload = { id: response._id };
        const token = generateToken(payload);

        res.status(201).json({ user: response, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// ------------------ LOGIN ------------------
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;

        const user = await User.findOne({ aadharCardNumber });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid aadharCardNumber or password' });
        }

        const payload = { id: user._id };
        const token = generateToken(payload);

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ------------------ PROFILE ------------------
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password"); // remove password

        res.status(200).json({ user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ------------------ UPDATE PASSWORD ------------------
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect current password" });
        }

        user.password = newPassword;  // will auto-hash due to pre-save hook
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
