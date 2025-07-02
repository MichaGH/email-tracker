"use client";
import React, { useState } from "react";

function StatusCircle({ trackerId, field, initialValue }) {
	const [value, setValue] = useState(initialValue);
	const [loading, setLoading] = useState(false);

    function handleClick(e) {
        e.stopPropagation();
        toggleValue();
    }

	async function toggleValue() {
		if (loading) return;

		const newValue = !value;
        setLoading(true);
        
        try {
            const res = await fetch("/api/updateTrackerField", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trackerId, field, value: newValue }),
            });
            
            if (!res.ok) throw new Error("Update failed");
            setValue(newValue);
        } catch (err) {
            console.error(err);
            alert("Failed to update");
        } finally {
            setLoading(false);
        }
    }
        
	return (
		<div
			onClick={handleClick}
			className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-150 mx-auto ${
				value ? "bg-green-700 hover:bg-green-300" : "bg-red-700 hover:bg-green-300"
			} ${loading ? "opacity-50 animate-bounce pointer-events-none" : ""}`}
			title={value ? "Enabled" : "Disabled"}
		></div>
	);
}

export default StatusCircle;
