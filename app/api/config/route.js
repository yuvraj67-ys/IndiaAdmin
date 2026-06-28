import { NextResponse } from 'next/server';
import admin from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const db = admin.database();
    const snapshot = await db.ref('app_config').once('value');
    return NextResponse.json({ success: true, data: snapshot.val() || {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const db = admin.database();
    await db.ref('app_config').update(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
