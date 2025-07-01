'use client'
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function page() {

    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ password })
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            alert('Wrong Password')
        }
    }


	return (
		<section className="w-screen h-screen flex justify-center items-center">
			<div>
				<form action="" onSubmit={handleSubmit} className="flex space-x-4">
					
					<input 
                        type="password" 
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 border-white rounded-sm"
                        />
					<button type="submit" className="bg-cyan-800 rounded-sm px-4 py-2">Log In</button>
				</form>
			</div>
		</section>
	);
}

export default page;
