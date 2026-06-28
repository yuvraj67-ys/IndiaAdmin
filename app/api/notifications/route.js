import { NextResponse } from 'next/server';
import { sendPushNotification } from '../../../lib/fcm';
import { saveNotificationHistory, getNotificationHistory } from '../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await sendPushNotification(body);
    
    if(result.success) {
      // ✅ Bhejte hi database mein history save karo
      await saveNotificationHistory({
        title: body.title,
        body: body.body,
        status: 'Sent Successfully'
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const history = await getNotificationHistory();
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
