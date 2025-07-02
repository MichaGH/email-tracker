'use client';
import React from 'react';
import StatusCircle from './UI/StatusCircle';

function TrackingTable({ aggregatedData,selectedTrackerId, setSelectedTrackerId}) {
    
    function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    alert('Clipboard API not supported');
  }

}

  function handleCopyClick(e, url){
    copyToClipboard(url)
    e.stopPropagation()
  }

  return (
    <table className="min-w-full border-collapse border border-gray-600">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="border border-gray-600 px-4 py-2 text-left">ID</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Description</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Active</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Track</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Respond</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Source</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Created At</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Last Active</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Count</th>
          <th className="border border-gray-600 px-4 py-2 text-left">Copy</th>
        </tr>
      </thead>
      <tbody>
        {aggregatedData.length === 0 ? (
          <tr>
            <td
              colSpan={10}
              className="border border-gray-600 px-4 py-2 text-center"
            >
              No data yet
            </td>
          </tr>
        ) : (
          aggregatedData.map(
            ({
              _id,
              description,
              active,
              track,
              respond,
              source,
              createdAt,
              lastEntry,
              count
            }) => (
              <tr
                key={_id}
                className="even:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedTrackerId(_id)}
              >
                <td className="border border-gray-600 px-4 py-2">
                    {_id}
                </td>
                <td className="border border-gray-600 px-4 py-2">
                    {description}
                </td>
                <td className="border border-gray-600 px-4 py-2">
                    <StatusCircle trackerId={_id} field="active" initialValue={active}/>
                </td>
                <td className="border border-gray-600 px-4 py-2">
                     <StatusCircle trackerId={_id} field="track" initialValue={track}/>
                </td>
                <td className="border border-gray-600 px-4 py-2">
                     <StatusCircle trackerId={_id} field="respond" initialValue={respond}/>
                </td>
                <td className="border border-gray-600 px-4 py-2">
                    {source} 
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {createdAt ? createdAt.toLocaleString() : '-'}
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {lastEntry ? lastEntry.toLocaleString() : '-'}
                </td>
                <td className="border border-gray-600 px-4 py-2">{count}</td>
                <td className="border border-gray-600 px-4 py-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    onClick={(e) => handleCopyClick(e, `${window.location.origin}/api/tracker/?id=${_id}`)}
                  >
                    Copy
                  </button>
                </td>
              </tr>
            )
          )
        )}
      </tbody>
    </table>
  );
}

export default TrackingTable;
