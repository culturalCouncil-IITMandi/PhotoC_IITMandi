import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json" with { type: "json" };
// const serviceAccount = require("./serviceAccountKey.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
