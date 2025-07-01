import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

const pixelBase64 = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const pixelBuffer = Buffer.from(pixelBase64, 'base64');

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id param' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // Use default DB from URI or specify like client.db('yourDBname')

    const collection = db.collection('tracking');

    // Insert new tracking record
    await collection.insertOne({
      id,
      opened: true,
      time: new Date(),
    });

    // Return 1x1 transparent pixel
    return new Response(pixelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }}