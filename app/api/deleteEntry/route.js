import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    const { entryId } = await req.json();

    if (!entryId) {
      return NextResponse.json({ error: 'Missing entryId' }, { status: 400 });
    }

    const db = await getDb();
    const _id = ObjectId.createFromHexString(entryId);
    const collection = db.collection('trackerEntries')
    const doc = await collection.findOne({ _id })

    if(!doc) {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    await collection.deleteOne({ _id }, {returnDocument: 'before'});
    return NextResponse.json({ message: 'Entry deleted' }, { status: 200 });

  } catch (error) {
    console.error('Delete entry error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
