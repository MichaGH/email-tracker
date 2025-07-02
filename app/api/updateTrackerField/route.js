import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const { trackerId, field, value } = await req.json();
        const db = await getDb();
        await db.collection("trackers").updateOne({ _id: trackerId }, { $set: { [field]: value } });

        return NextResponse.json({ success: true}, {status: 200});

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update field"}, {status: 500});
    }
}