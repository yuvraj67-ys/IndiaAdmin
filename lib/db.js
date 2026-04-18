import admin from './firebase-admin';

export async function getAllVehicles() {
  const db = admin.database();
  const snapshot = await db.ref('vehicles').once('value');
  const data = snapshot.val() || {};
  return Object.entries(data).map(([id, vehicle]) => ({ id, ...vehicle }));
}

export async function addVehicle(vehicleData) {
  const db = admin.database();
  const newRef = db.ref('vehicles').push();
  const vehicle = {
    id: newRef.key,
    ...vehicleData,
    order: Date.now(),
  };
  await newRef.set(vehicle);
  return vehicle;
}

export async function deleteVehicle(id) {
  const db = admin.database();
  await db.ref(`vehicles/${id}`).remove();
  return { success: true };
}

export async function updateAppConfig(configData) {
  const db = admin.database();
  await db.ref('app_config').update(configData);
  return { success: true };
}

export async function getAppConfig() {
  const db = admin.database();
  const snapshot = await db.ref('app_config').once('value');
  return snapshot.val() || { versionCode: 1, versionName: "1.0", forceUpdate: false };
}

export async function saveNotificationHistory(notifData) {
  const db = admin.database();
  const newRef = db.ref('notification_history').push();
  await newRef.set({
    id: newRef.key,
    ...notifData,
    timestamp: Date.now()
  });
  return true;
}

export async function getNotificationHistory() {
  const db = admin.database();
  const snapshot = await db.ref('notification_history').orderByChild('timestamp').limitToLast(50).once('value');
  const data = snapshot.val() || {};
  return Object.values(data).sort((a, b) => b.timestamp - a.timestamp); // Latest first
}
