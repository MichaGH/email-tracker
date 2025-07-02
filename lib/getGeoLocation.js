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

        const res = await fetch(`https://ipapi.co/${ip}/json/`, {
  headers: {
    'User-Agent': 'MyCoolApp/1.0',
    Accept: 'application/json',
  },
});
const rawText = await res.text();
console.log('ipapi raw response:', rawText);

if (!res.ok) {
  console.error('ipapi.co error:', await res.text());
  return null;
}



const data = JSON.parse(rawText);

if (!data || data.error) {
  console.log('ipapi returned error or empty data:', data);
  return null;
}

        return data

	} catch (err) {

        return null
    }
}
