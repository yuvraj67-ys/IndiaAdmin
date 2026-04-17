import { NextResponse } from 'next/server';
import { uploadToImgBB } from '../../../lib/imgbb';

export async function POST(request) {
  try {
    // Client se JSON receive kar rahe hain
    const body = await request.json();
    const base64Image = body.image;

    if (!base64Image) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // ImgBB par upload
    const imageUrl = await uploadToImgBB(base64Image);
    
    return NextResponse.json({ success: true, url: imageUrl });
    
  } catch (error) {
    console.error("Upload API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
