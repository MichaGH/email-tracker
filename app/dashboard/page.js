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
		<div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1>Email Opens Tracking</h1>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Times Opened</th>
            <th>Last Opened</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.length === 0 && (
            <tr>
              <td colSpan={3}>No data yet</td>
            </tr>
          )}
          {aggregatedData.map(({ id, count, lastOpened }, i) => (
            <tr key={i}>
              <td>{id}</td>
              <td>{count}</td>
              <td>{new Date(lastOpened).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
	);
}

export default Page;
