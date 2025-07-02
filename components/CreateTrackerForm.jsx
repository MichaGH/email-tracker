'use client';

import { useState } from 'react';

export default function CreateTrackerForm({ createTracker }) {

  const [formState, setFormState] = useState({
    id: '',
    description: '',
    active: true,
    track: true,
    respond: true,
    source: 'trackingPixel',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form action={createTracker} className="space-y-4 p-4 bg-gray-900 rounded-xl border border-gray-700 max-w-md">
      <div>
        <label className="block mb-1 text-sm">Tracker ID</label>
        <input name="id" value={formState.id} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block mb-1 text-sm">Description</label>
        <input name="description" value={formState.description} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded" />
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" name="active" checked={formState.active} onChange={handleChange} />
        <label className="text-sm">Active</label>
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" name="track" checked={formState.track} onChange={handleChange} />
        <label className="text-sm">Track Requests</label>
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" name="respond" checked={formState.respond} onChange={handleChange} />
        <label className="text-sm">Respond with Image</label>
      </div>
      <div>
        <label className="block mb-1 text-sm">Source (optional)</label>
        <input name="source" value={formState.source} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded" />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Create Tracker
      </button>
    </form>
  );
}
