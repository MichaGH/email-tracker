"use client";
import React, { useState } from "react";
import Image from "next/image";

function DeleteEntry({ entryId, fetchEntries }) {
  const [loading, setLoading] = useState(false);

  async function handleClick(e) {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/deleteEntry", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryId }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Refresh entries only after successful delete
      fetchEntries();
    } catch (err) {
      console.error("Error: ", err);
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} 
        className=" w-4 h-4 relative inline-flex justify-center items-center cursor-pointer align-middle"
    >
      <Image src="/icons/x.svg" fill alt="delete" />
    </button>
  );
}

export default DeleteEntry;
