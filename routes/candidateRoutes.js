const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const Candidate = require("../model/candidateModel");
const { jwtAuthMiddleware } = require("../jwt");

// ------------ CHECK ADMIN ROLE ------------
const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        if (!user) return false;

        return user.role === "admin";  // ✅ Correct role check
    } catch (error) {
        return false;
    }
};

// ------------ CREATE CANDIDATE (ADMIN ONLY) ------------
router.post("/", jwtAuthMiddleware, async (req, res) => {
    try {
        const userID = req.user.id || req.user._id;

        if (!await checkAdminRole(userID))
            return res.status(403).json({ message: "user has not admin role" });

        const newCandidate = new Candidate(req.body);
        const response = await newCandidate.save();

        res.status(201).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ------------ UPDATE CANDIDATE (ADMIN ONLY) ------------
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
    try {
        const userID = req.user.id || req.user._id;

        if (!await checkAdminRole(userID))
            return res.status(403).json({ message: "user has not admin role" });

        const candidateID = req.params.candidateID;

        const response = await Candidate.findByIdAndUpdate(
            candidateID,
            req.body,
            { new: true, runValidators: true }
        );

        if (!response)
            return res.status(404).json({ error: "Candidate not found" });

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ------------ DELETE CANDIDATE (ADMIN ONLY) ------------
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
    try {
        const userID = req.user.id || req.user._id;

        if (!await checkAdminRole(userID))
            return res.status(403).json({ message: "user has not admin role" });

        const response = await Candidate.findByIdAndDelete(req.params.candidateID);

        if (!response)
            return res.status(404).json({ error: "Candidate not found" });

        res.status(200).json({ message: "Candidate deleted", response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
