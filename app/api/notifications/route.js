import { NextResponse } from 'next/server';
import { sendPushNotification } from '../../../lib/fcm';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await sendPushNotification(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
