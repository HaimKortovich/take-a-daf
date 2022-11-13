import admin, { ServiceAccount } from "firebase-admin";

try {
  const config = {
    type: "service_account",
    project_id: process.env.FIREBASE_ADMIN_project_id,
    private_key_id: process.env.FIREBASE_ADMIN_private_key_id,
    private_key: Buffer.from(
      process.env.FIREBASE_ADMIN_private_key as string,
      "base64"
    ).toString("ascii"),
    client_email: process.env.FIREBASE_ADMIN_client_email,
    client_id: process.env.FIREBASE_ADMIN_client_id,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-t282b%40pick-a-daf.iam.gserviceaccount.com",
  };

  console.dir(config);
  admin.initializeApp({
    credential: admin.credential.cert(config as ServiceAccount),
  });
  console.log("Initialized.");
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test((error as any).message as any)) {
    console.error("Firebase admin initialization error", (error as any).stack);
  }
}

export default admin;
