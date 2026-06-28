import { NextResponse } from 'next/server';
import { addCategory } from '../../../lib/db';

const DEFAULT_CATEGORIES = [
  { name: 'Bikes', value: 'bike', order: 1, icon: '🏍️' },
  { name: 'Cars', value: 'car', order: 2, icon: '🚗' },
  { name: 'Trucks', value: 'truck', order: 3, icon: '🚛' },
  { name: 'Secret', value: 'secret', order: 4, icon: '🔒' },
  { name: 'Human', value: 'human', order: 5, icon: '🧑' },
  { name: 'Other', value: 'other', order: 6, icon: '📦' },
  { name: 'Police Car', value: 'police_car', order: 7, icon: '🚔' },
  { name: 'Monster Car', value: 'monster_car', order: 8, icon: '👹' },
  { name: 'Flying Machines', value: 'flying_machines', order: 9, icon: '✈️' },
  { name: 'Modes', value: 'modes', order: 10, icon: '🎮' },
  { name: 'Animal', value: 'animal', order: 11, icon: '🐾' },
];

export async function POST() {
  try {
    const created = [];
    for (const cat of DEFAULT_CATEGORIES) {
      const result = await addCategory({ ...cat, isActive: true });
      created.push(result);
    }
    return NextResponse.json({ success: true, data: created, count: created.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
