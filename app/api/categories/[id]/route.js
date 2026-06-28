import { NextResponse } from 'next/server';
import { deleteCategory, updateCategory } from '../../../../lib/db';

export async function DELETE(request, { params }) {
  try {
    await deleteCategory(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const updates = await request.json();
    await updateCategory(params.id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
