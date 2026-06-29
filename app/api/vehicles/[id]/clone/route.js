import { NextResponse } from 'next/server';
import { addVehicle } from '../../../../lib/db';
import admin from '../../../../lib/firebase-admin';

export async function POST(request, { params }) {
  try {
    const db = admin.database();
    const snapshot = await db.ref(`vehicles/${params.id}`).once('value');
    const vehicle = snapshot.val();
    if (!vehicle) {
      return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    }
    const { id, ...data } = vehicle;
    const clone = await addVehicle({
      ...data,
      name: `${data.name} (Copy)`,
    });
    return NextResponse.json({ success: true, data: clone });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
