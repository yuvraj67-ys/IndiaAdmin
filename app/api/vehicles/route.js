import { NextResponse } from 'next/server';
import { getAllVehicles, addVehicle } from '../../../lib/db';

export async function GET() {
  try {
    const vehicles = await getAllVehicles();
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const vehicle = await addVehicle(body);
    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
