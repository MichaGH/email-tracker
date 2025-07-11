"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DeleteEntry from "./UI/DeleteEntry";

export default function EntriesTable({ selectedTrackerId }) {
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchEntries = () => {
		if (!selectedTrackerId) return;

		setLoading(true);
		setError(null);

		fetch(`/api/trackerEntries?trackerId=${selectedTrackerId}`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch entries");
				return res.json();
			})
			.then((data) => {
				setEntries(data.entries || []);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
		if (loading) return <p>Loading entries...</p>;
		if (error) return <p>Error loading entries: {error}</p>;
		if (entries.length === 0) return <p>No entries found for this tracker.</p>;
	};

	useEffect(() => {
        fetchEntries()
    }, [selectedTrackerId]);

	return (
		<div>
			<div className="flex justify-between">
				<h2 className="text-xl font-bold mb-4">Entries</h2>
                <button onClick={fetchEntries} className="hover:opacity-50 hover:animate-spin">
                    <Image src="/icons/refresh-cw.svg" height={20} width={20} alt="refresh"/>
                </button>
			</div>
			<table className="min-w-full border-collapse border border-gray-600">
				<thead>
					<tr className="bg-gray-800 text-white">
						<th className="border border-gray-600 px-4 py-2 text-left">
							Timestamp
						</th>
						<th className="border border-gray-600 px-4 py-2 text-left">IP</th>
						<th className="border border-gray-600 px-4 py-2 text-left">City</th>
						<th className="border border-gray-600 px-4 py-2 text-left">
							Region
						</th>
						<th className="border border-gray-600 px-4 py-2 text-left">
							Country
						</th>
						<th className="border border-gray-600 px-4 py-2 text-center">
							Delete
						</th>
					</tr>
				</thead>
				<tbody>
					{entries.map(({ _id, timestamp, ip, location }) => (
						<tr key={_id} className="even:bg-gray-700 even:hover:bg-gray-600 hover:bg-gray-600">
							<td className="border border-gray-600 px-4 py-2">
								{new Date(timestamp).toLocaleString()}
							</td>
							<td className="border border-gray-600 px-4 py-2">
								{ip || "N/A"}
							</td>
							<td className="border border-gray-600 px-4 py-2">
								{location?.city || "N/A"}
							</td>
							<td className="border border-gray-600 px-4 py-2">
								{location?.region || "N/A"}
							</td>
							<td className="border border-gray-600 px-4 py-2">
								{location?.country || "N/A"} 
							</td>
							<td className="border border-gray-600 text-center">
								<DeleteEntry entryId={_id} fetchEntries={fetchEntries}/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
