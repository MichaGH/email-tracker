import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import cookieSignature from "cookie-signature";

import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "tracking.json");

async function Page() {
	const cookieStore = await cookies();
	const authCookie = cookieStore.get("auth")?.value;

	if (!verifyCookie(authCookie)) redirect("/login");

	function verifyCookie(cookie) {
		if (!cookie) return false;
		const val = cookieSignature.unsign(cookie, process.env.COOKIE_SECRET);
		return val === "yes";
	}

	let data = [];
	try {
		const file = await fs.readFile(DATA_FILE, "utf-8");
		data = JSON.parse(file);
	} catch (err) {}

	const agg = data.reduce((acc, { id, time }) => {
		if (!acc[id]) {
			acc[id] = { id, count: 0, lastOpened: null };
		}
		acc[id].count += 1;
		if (!acc[id].lastOpened || new Date(time) > new Date(acc[id].lastOpened)) {
			acc[id].lastOpened = time;
		}
		return acc;
	}, {});

    const aggregatedData = Object.values(agg);

	return (
		<div className="flex flex-col justify-center items-center">
      <h1>Email Opens Tracking</h1>
      <table className="w-full border-collapse text-gray-200 font-sans">
  <thead>
    <tr className="bg-gray-800">
      <th className="p-3 text-left border-b border-gray-700">ID</th>
      <th className="p-3 text-right border-b border-gray-700">Times Opened</th>
      <th className="p-3 text-left border-b border-gray-700">Last Opened</th>
    </tr>
  </thead>
  <tbody>
    {aggregatedData.length === 0 && (
      <tr>
        <td colSpan={3} className="p-4 text-center text-gray-400">
          No data yet
        </td>
      </tr>
    )}
    {aggregatedData.map(({ id, count, lastOpened }, i) => (
      <tr
        key={i}
        className={i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
      >
        <td className="p-3 border-b border-gray-700">{id}</td>
        <td className="p-3 border-b border-gray-700 text-right font-semibold">{count}</td>
        <td className="p-3 border-b border-gray-700">{new Date(lastOpened).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
	);
}

export default Page;
