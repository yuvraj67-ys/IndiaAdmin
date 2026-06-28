import { NextResponse } from 'next/server';
import { deleteVehicle } from '../../../../lib/db';
import admin from '../../../../lib/firebase-admin';

export async function DELETE(request, { params }) {
  try {
    await deleteVehicle(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const updates = await request.json();
    await admin.database().ref(`vehicles/${params.id}`).update(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
