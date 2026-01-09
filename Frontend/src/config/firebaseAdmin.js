import admin  from "firebase-admin";
import serviceAccount  from "./firebase-admin-key.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;