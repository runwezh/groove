/* USAGE:
locate(test = false).then(data => {

}).catch(err => {

});
*/

interface LocationData {
	testing?: string;
	city: string;
	country: string;
	hostname: string;
	ip: string;
	loc: string;
	org: string;
	postal: string;
	region: string;
	timezone: string;
}

const TEST_DATA: LocationData = {
	testing: "This is localhost testing data",
	city: "Lee",
	country: "US",
	hostname: "cpe-74-76-154-164.nycap.res.rr.com",
	ip: "74.76.154.164",
	loc: "42.3043,-73.2482",
	org: "AS11351 Charter Communications Inc",
	postal: "01238",
	region: "Massachusetts",
	timezone: "America/New_York"
};

const MAX_TIME = 4000;

async function lookup(test: boolean): Promise<LocationData> {
	if (test) return Promise.resolve(TEST_DATA);
	try {
		const request = await fetch("https://ipinfo.io/json?token=6f0f9c88db028a");
		const json = await request.json();
		return json as LocationData;
	} catch (err) {
		throw new Error(err instanceof Error ? err.message : String(err));
	}
}

function init(test: boolean = false): Promise<LocationData> {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => reject(new Error("timeout")), MAX_TIME);
		lookup(test)
			.then((data) => {
				clearTimeout(timeout);
				resolve(data);
			})
			.catch(reject);
	});
}

export default init; 