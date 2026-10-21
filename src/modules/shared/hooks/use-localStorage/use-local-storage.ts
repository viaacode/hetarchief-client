import { useCallback, useState } from 'react';

export function useLocalStorage(
	keyName: string,
	defaultValue: string
): [string, (newValue: string) => void] {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const value = window.localStorage.getItem(keyName);

			if (value) {
				return JSON.parse(value);
			}
			window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
			return defaultValue;
		} catch (_err) {
			return defaultValue;
		}
	});

	// Stable, so it can be a dependency of an effect or a callback
	const setValue = useCallback(
		(newValue: string) => {
			try {
				window.localStorage.setItem(keyName, JSON.stringify(newValue));
			} catch (_err) {
				// Ignore localstorage errors
			}
			setStoredValue(newValue);
		},
		[keyName]
	);

	return [storedValue, setValue];
}
