let hasStorage: boolean | undefined;

const isReady = (): boolean => {
	if (hasStorage !== undefined) return hasStorage;

	try {
		const storage = window.localStorage;
		const x = "__storage_test__";
		storage.setItem(x, x);
		storage.removeItem(x);
		hasStorage = true;
	} catch (e) {
		hasStorage = false;
	}
	return hasStorage;
};

const remove = (key: string): void => {
	if (!isReady()) return;
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.error(err);
	}
};

const set = <T>(key: string, value: T): void => {
	if (!isReady()) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.error(err);
	}
};

const get = <T>(key: string): T | undefined => {
	if (!isReady()) return undefined;
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) as T : undefined;
	} catch (err) {
		console.error(err);
		return undefined;
	}
};

interface LocalStorage {
	set: <T>(key: string, value: T) => void;
	get: <T>(key: string) => T | undefined;
	remove: (key: string) => void;
}

const localStorage: LocalStorage = {
	set,
	get,
	remove
};

export default localStorage; 