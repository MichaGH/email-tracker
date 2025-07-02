'use client'
import React from "react";
import { useState } from "react";
import CreateTrackerForm from "./CreateTrackerForm";
import EntriesTable from "./EntriesTable";
import TrackingTable from "./TrackingTable";

function DashboardClient({aggregatedData, createTracker}) {
    const [selectedTrackerId, setSelectedTrackerId] = useState(null);

	return (
		<div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
			<div className="mb-10 flex justify-between ">
				<div>
					<h2 className="text-xl font-bold mb-4">Create Tracker</h2>
					<CreateTrackerForm createTracker={createTracker} />
				</div>
                <div className="flex-1 flex justify-center">
                    <EntriesTable selectedTrackerId={selectedTrackerId} />
                </div>
			</div>

			<div >
				<h2 className="text-xl font-bold mb-4">Tracking Table</h2>
				<TrackingTable aggregatedData={aggregatedData} selectedTrackerId={selectedTrackerId}  setSelectedTrackerId={setSelectedTrackerId} />
			</div>
		</div>
	);
}

export default DashboardClient;
