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

// ─── CATEGORIES CRUD ────────────────────────────────────────────────

export async function getAllCategories() {
  const db = admin.database();
  const snapshot = await db.ref('categories').once('value');
  const data = snapshot.val() || {};
  return Object.entries(data)
    .map(([id, cat]) => ({ id, ...cat }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function addCategory(categoryData) {
  const db = admin.database();
  const newRef = db.ref('categories').push();
  const category = {
    id: newRef.key,
    name: categoryData.name,
    value: categoryData.value,
    order: categoryData.order || Date.now(),
    isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
  };
  await newRef.set(category);
  return category;
}

export async function updateCategory(id, updates) {
  const db = admin.database();
  await db.ref(`categories/${id}`).update(updates);
  return { success: true };
}

export async function deleteCategory(id) {
  const db = admin.database();
  await db.ref(`categories/${id}`).remove();
  return { success: true };
}
