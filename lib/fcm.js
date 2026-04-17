import admin from './firebase-admin';

export async function sendPushNotification({ title, body, imageUrl }) {
  try {
    const message = {
      topic: 'all_users', // App me sabhi users ko is topic pe subscribe karwana hoga
      notification: {
        title,
        body,
        ...(imageUrl && { image: imageUrl }),
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
        },
      },
    };

    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('FCM Error:', error);
    return { success: false, error: error.message };
  }
}
