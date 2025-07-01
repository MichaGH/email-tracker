import React from 'react';
import clientPromise from '../../lib/mongodb';

export default async function Dashboard() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const collection = db.collection('tracking');

    // Aggregate to get count and last opened per id
    const aggregatedData = await collection.aggregate([
      {
        $group: {
          _id: '$id',
          count: { $sum: 1 },
          lastOpened: { $max: '$time' },
        },
      },
      { $sort: { lastOpened: -1 } },
    ]).toArray();

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <table className="min-w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-600 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Times Opened</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Last Opened</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="border border-gray-600 px-4 py-2 text-center">No data yet</td>
              </tr>
            ) : (
              aggregatedData.map(({ _id, count, lastOpened }) => (
                <tr key={_id} className="even:bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">{_id}</td>
                  <td className="border border-gray-600 px-4 py-2">{count}</td>
                  <td className="border border-gray-600 px-4 py-2">{new Date(lastOpened).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Error loading dashboard</div>;
  }
}
