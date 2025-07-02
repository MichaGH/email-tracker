import { NextResponse } from "next/server";
import path from "path";
import { getDb } from "../../../lib/mongodb";
import { getGeoLocation } from "../../../lib/getGeoLocation";
import fs from 'fs/promises';

const pixelBase64 = "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const pixelBuffer = Buffer.from(pixelBase64, "base64");

export async function GET(request) {
	const url = new URL(request.url);
	const trackerId = url.searchParams.get("id");

	//! Check if has id search param
	if (!trackerId) {
		return NextResponse.json({ error: "missing id param" }, { status: 400 });
	}

	try {
		//! Connect to DB and collection with entries
		const db = await getDb();

		//! Check if there is tracker with this id
		const trackersCollection = db.collection("trackers");
		const existingTracker = await trackersCollection.findOne({
			_id: trackerId,
		});
		if (!existingTracker) {
			return NextResponse.json(
				{ error: "no tracker with this id exists" },
				{ status: 404 }
			);
		}

		//* Tracker active?
        // NO
		if (!existingTracker.active) {
			return NextResponse.json({ status: "Inactive tracker" }, { status: 503 });
		}

		//* Track Entry?
        // YES
		if (existingTracker.track) {
			//! Get IP adress from the header
			const xForwardedFor = request.headers.get("x-forwarded-for");
			const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "0.0.0.0";

			//! Check if there is already entry with this ip
			const entriesCollection = db.collection("trackerEntries");
			const existingEntry = await entriesCollection.findOne({ ip });

			let location;

			if (existingEntry) {
				location = existingEntry.location;
			} else {
				location = await getGeoLocation(ip);
			}

            const timestamp = new Date()

			//! Insert new entry into trackerEntries
			await entriesCollection.insertOne({
				trackerId,
				timestamp,
				ip,
				location
			});
		}

        //* Respond with image?
        // NO
        if(!existingTracker.respond) {
            return NextResponse.json({ status: 200 });
        }

        //YES
		//! What image to respond with | default: source: 'trackingPixel'
		let responseImage;
        let contentType = "image/gif";
        const source = existingTracker.source;

		if (source === "trackingPixel") {
			responseImage = pixelBuffer;
		} else {
			const imagePath = path.join(process.cwd(), "public", "tracker", "images", source);

            try {
                responseImage = await fs.readFile(imagePath)

                // Detect content type from extension
                if (source.endsWith(".png")){
                    contentType = "image/png"
                } else if (source.endsWith(".jpg") || source.endsWith(".jpeg")){
                    contentType = "image/jpeg"
                } else if (source.endsWith(".gif")){
                    contentType = "image/gif"
                } else {
                    contentType = "application/octet-stream"
                }
            } catch (e) {

            }
		}

		return new Response(responseImage, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: 0,
			},
		});
	} catch (err) {
		console.error("MongoDB Error: ", err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
