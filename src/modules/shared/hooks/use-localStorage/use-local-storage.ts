import { useState } from 'react';

export function useLocalStorage(
	keyName: string,
	defaultValue: string
): [string, (newValue: string) => void] {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const value = window.localStorage.getItem(keyName);

			if (value) {
				return JSON.parse(value);
			} else {
				window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
				return defaultValue;
			}
		} catch (err) {
			return defaultValue;
		}
	});

	const setValue = (newValue: string) => {
		try {
			window.localStorage.setItem(keyName, JSON.stringify(newValue));
		} catch (err) {
			// Ignore localstorage errors
		}
		setStoredValue(newValue);
	};

	return [storedValue, setValue];
}
