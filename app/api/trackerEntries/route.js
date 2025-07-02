import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const trackerId = url.searchParams.get("trackerId");

    if (!trackerId) {
      return new Response(JSON.stringify({ error: "Missing trackerId" }), { status: 400 });
    }

    const db = await getDb();
    const entries = await db
      .collection("trackerEntries")
      .find({ trackerId })
      .sort({ timestamp: -1 })
      .toArray();

      console.log(entries)
    return new Response(JSON.stringify({ entries }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
