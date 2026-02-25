// src/lib/firebase-admin.ts
import * as admin from "firebase-admin";

// Firebase Admin SDKの初期化
const initializeFirebaseAdmin = () => {
  // 既に初期化されている場合はスキップ
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // 環境変数からサービスアカウントJSONを取得
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    // 環境変数にJSON文字列として設定されている場合
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      console.log("✅ Firebase Admin SDK initialized with FIREBASE_SERVICE_ACCOUNT_JSON");
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", error);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON format");
    }
  }

  // サービスアカウントファイルのパスが指定されている場合
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (serviceAccountPath) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require(serviceAccountPath);
      console.log("✅ Firebase Admin SDK initialized with FIREBASE_SERVICE_ACCOUNT_PATH");
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error(`❌ Failed to load service account from ${serviceAccountPath}:`, error);
      throw new Error(`Failed to load service account from ${serviceAccountPath}`);
    }
  }

  // GOOGLE_APPLICATION_CREDENTIALS環境変数が設定されている場合
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("✅ Firebase Admin SDK initialized with GOOGLE_APPLICATION_CREDENTIALS");
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  // Firebase Project IDのみ指定されている場合（Cloud Run等のGoogle Cloud環境用）
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
  if (projectId) {
    console.log(`✅ Firebase Admin SDK initialized with projectId: ${projectId}`);
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: projectId,
    });
  }

  // 認証情報が見つからない場合はエラー
  console.error(`
❌ Firebase Admin SDK initialization failed!
   
   Please set one of the following environment variables:
   
   1. FIREBASE_SERVICE_ACCOUNT_JSON - JSON string of your service account key
      Example: FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...",...}'
   
   2. FIREBASE_SERVICE_ACCOUNT_PATH - Path to your service account key file
      Example: FIREBASE_SERVICE_ACCOUNT_PATH="./serviceAccountKey.json"
   
   3. GOOGLE_APPLICATION_CREDENTIALS - Path to your service account key file
      Example: GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
   
   4. FIREBASE_PROJECT_ID - Your Firebase project ID (for Google Cloud environments)
      Example: FIREBASE_PROJECT_ID="your-project-id"
   
   To get a service account key:
   1. Go to Firebase Console > Project Settings > Service Accounts
   2. Click "Generate new private key"
   3. Save the JSON file and set the environment variable
  `);
  
  throw new Error("Firebase Admin SDK credentials not configured. See console for details.");
};

// Firebase Admin SDKを初期化
const firebaseAdmin = initializeFirebaseAdmin();

// Firebase Authインスタンスをエクスポート
export const auth = admin.auth();
export default firebaseAdmin;
