export async function getGeoLocation(ip) {
	try {
		if (
			ip === "127.0.0.1" ||
			ip === "0.0.0.0" ||
            ip === "::1" ||
			ip.startsWith("192.168.") ||
			ip.startsWith("10.") ||
			ip.startsWith("172.")
		) {
			return {
				ip: "local",
				network: "local",
				version: "local",
				city: "local",
				region: "local",
				region_code: "local",
				country: "local",
				country_name: "local",
				country_code: "local",
				country_code_iso3: "local",
				country_capital: "local",
				country_tld: "local",
				continent_code: "local",
				in_eu: true,
				postal: "local",
				latitude: 0,
				longitude: 0,
				timezone: "local",
				utc_offset: "local",
				country_calling_code: "local",
				currency: "local",
				currency_name: "local",
				languages: "local",
				country_area: 0,
				country_population: 0,
				asn: "local",
				org: "local",
			};
		}

        const res = await fetch(`https://ipapi.co/${ip}/`);
        if(!res.ok) throw new Error(`Failed to fetch geo data for IP: ${ip}`);
        const data = await res.json();

        return data

	} catch (err) {

        return null
    }
}
