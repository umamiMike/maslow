import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

interface Notification {
  message: string;
  time: any;
}

const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello dudez!");
});

const createNotification = async (notification: Notification) => {
  const firestore = admin.firestore();
  const settings = { /* your settings... */ timestampsInSnapshots: true };
  firestore.settings(settings);

  const doc = firestore.collection("notifications").add(notification);
  console.log("notification added", doc);
  return doc;
};

export const signup = functions.auth.user().onCreate(async user => {
  const firestore = admin.firestore();
  const settings = { /* your settings... */ timestampsInSnapshots: true };
  firestore.settings(settings);

  const newUserDocument = await firestore
    .collection("users")
    .doc(user.uid)
    .get();
  const newUser = newUserDocument.data();
  const message = `a new user just signed up: ${newUser.firstName} ${
    newUser.lastName
  }`;
  const notification: Notification = {
    message,
    time: admin.firestore.FieldValue.serverTimestamp()
  };
  return createNotification(notification);
});

export const newDevice = functions.firestore
  .document("devices/{deviceId}")
  .onCreate(doc => {
    const device = doc.data;
    const notification: Notification = {
      message: `Added a new device ${device.name}`,
      time: admin.firestore.FieldValue.serverTimestamp()
    };
    return createNotification(notification);
  });

export default helloWorld;
