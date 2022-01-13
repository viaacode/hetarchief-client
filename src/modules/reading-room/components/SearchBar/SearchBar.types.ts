import { ChangeEvent, KeyboardEvent } from 'react';

export interface SearchBarProps {
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
}
