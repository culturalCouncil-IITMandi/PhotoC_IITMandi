import admin from 'firebase-admin';
import serviceAccount from '../serviceAccount.json' assert { type: "json" };

const ADMINS = process.env.ADMINS ? process.env.ADMINS.split(',') : [];

export const initFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const userLogin = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        if (!email.endsWith('@students.iitmandi.ac.in')) {
            console.warn(`Unauthorized login attempt: ${email}`);
            await admin.auth().deleteUser(uid);
            console.log(`Deleted user with UID: ${uid} and email: ${email}`);
            return res.status(403).json({ message: 'Access denied: Unauthorized email domain' });
        }

        console.log(`User authenticated: ${email} (UID: ${uid})`);

        // Check if email is in the admin list
        const admin1 = ADMINS.includes(email);

        res.json({
            message: 'Login successful',
            uid,
            email,
            name,
            picture,
            admin1,
        });
    } catch (error) {
        console.error('Error verifying ID token:', error);
        res.status(401).json({ message: 'Invalid or expired ID token' });
    }
}
