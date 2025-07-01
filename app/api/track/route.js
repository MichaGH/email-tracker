import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "tracking.json");

const pixelBase64 = "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const pixelBuffer = Buffer.from(pixelBase64, "base64");

export async function GET(request) {
	const url = new URL(request.url);
	const id = url.searchParams.get("id");

	if (!id) {
		return NextResponse.json({ error: "Missing id param" }, { status: 400 });
	}

	let data = [];
	try {
		const file = await fs.readFile(DATA_FILE, "utf-8");
		data = JSON.parse(file);
	} catch (e) {
		console.error("Failed to read the file :", e);
	}

	data.push({ id, opened: true, time: new Date().toISOString() });

    try {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    } catch (e) {
		console.error("Failed mkdir :", e);
	}
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
		console.error("Failed writefile :", e);
	}

	return new NextResponse(pixelBuffer, {
		status: 200,
		headers: {
			"Content-Type": "image/gif",
			"Cache-Control": "no-cache, no-store, must-revalidate",
			Pragma: "no-cache",
			Expires: "0",
		},
	});
}
