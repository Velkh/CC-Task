// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const app = express();

// Initialize Firebase Admin SDK
admin.initializeApp();

// Middleware to parse JSON bodies for requests
app.use(express.json());

// API to create a new user
exports.createUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    const { email, password, displayName } = req.body;

    try {
        const user = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
        });
        return res.status(201).send({ message: "User created", user });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

exports.loginUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    const { email, password } = req.body;
    try {
        return res.status(200).send({
            message: "Please use Firebase Auth SDK on the client-side for login",
        });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

// API to verify the Firebase ID token
exports.verifyToken = functions.https.onRequest(async (req, res) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) {
        return res.status(401).send({ error: "Unauthorized" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return res.status(200).send({ message: "Token verified", decodedToken });
    } catch (error) {
        return res.status(403).send({ error: "Invalid token" });
    }
});

// Export your Express app to Firebase Functions
exports.api = functions.https.onRequest(app);
