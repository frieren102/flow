// app/api/latest_state/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://192.168.221.97:8000/latest_state/');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch latest state' }, { status: 500 });
  }
}
