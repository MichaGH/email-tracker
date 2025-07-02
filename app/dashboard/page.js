export const revalidate = 0;

import React from "react";
import { redirect, RedirectType } from "next/navigation";

import { getDb } from "../../lib/mongodb";
import { validateAuth } from "@/lib/auth";

import TrackingTable from "@/components/TrackingTable";
import CreateTrackerForm from "@/components/CreateTrackerForm";
import EntriesTable from "@/components/EntriesTable";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
	//! Validate Auth Cookie
	if (!validateAuth()) {
		redirect("/login", RedirectType.push);
	}

	//! Get both: aggregated tracking data & prepare DB insert
	let aggregatedData = [];
	try {
		const db = await getDb();

		// Get tracking activity counts
		aggregatedData = await db
			.collection("trackers")
			.aggregate([
				{
					$lookup: {
						from: "trackerEntries",
						localField: "_id",
						foreignField: "trackerId",
						as: "entries",
					},
				},
				{
					$addFields: {
						count: { $size: "$entries" },
						lastEntry: { $max: "$entries.timestamp" },
					},
				},
				{
					$project: {
						entries: 0, // exclude raw entries array
					},
				},
				{
					$sort: { lastEntry: -1 },
				},
			])
			.toArray();
	} catch (error) {
		console.error("Failed to load tracking data:", error);
	}

	//! Server Action: Create a new tracker
	async function createTracker(formData) {
		"use server";

		const _id = formData.get("id")?.trim();
		const description = formData.get("description") || "";
		const active = formData.get("active") === "on";
		const track = formData.get("track") === "on";
		const respond = formData.get("respond") === "on";
		const source = formData.get("source") || "";

		const doc = {
			_id,
			description,
			active,
			track,
			respond,
			source,
			createdAt: new Date(),
		};

		try {
			const db = await getDb();
			await db.collection("trackers").insertOne(doc);
			console.log("Created tracker:", _id);
		} catch (err) {
			console.error("Error creating tracker:", err);
		}
	}

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Dashboard</h1>

			<DashboardClient aggregatedData={aggregatedData} createTracker={createTracker} />
		</div>
	);
}
