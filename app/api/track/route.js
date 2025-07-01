import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file where we'll store tracking data
const DATA_FILE = path.join(process.cwd(), 'data', 'tracking.json');

// 1x1 transparent GIF base64
const pixelBase64 =
  'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const pixelBuffer = Buffer.from(pixelBase64, 'base64');

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id param' }, { status: 400 });
  }

  // Load existing data or empty array
  let data = [];
  try {
    const file = await fs.readFile(DATA_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch {
    // File might not exist yet, ignore error
  }

  // Append new open event with id and timestamp
  data.push({ id, opened: true, time: new Date().toISOString() });

  // Save updated data back to file
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

  // Return the transparent pixel GIF with correct headers
  return new Response(pixelBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}