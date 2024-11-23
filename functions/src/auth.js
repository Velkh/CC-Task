import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "",
    authDomain: "test-auth-api-3fc0c.firebaseapp.com",
    projectId: "test-auth-api-3fc0c",
    storageBucket: "test-auth-api-3fc0c.firebasestorage.app",
    messagingSenderId: "860136921652",
    appId: "1:860136921652:web:68ae84f4e508164cdf4861",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function loginAndGetIdToken(email, password) {
    try {
        // Login pengguna menggunakan email dan password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const idToken = await user.getIdToken();
        console.log("ID Token:", idToken);
        
        sendIdTokenToServer(idToken);

        return idToken;
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
}

async function sendIdTokenToServer(idToken) {
    try {
        const response = await fetch('http://127.0.0.1:5001/test-auth-api-3fc0c/us-central1/verifyToken', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken })
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log("Token Verified:", data);
        } else {
            console.error("Token verification failed:", data.error);
        }
    } catch (error) {
        console.error("Error sending ID Token to server:", error);
    }
}

// Export fungsi login untuk digunakan di tempat lain (misalnya dalam form login)
export { loginAndGetIdToken };
