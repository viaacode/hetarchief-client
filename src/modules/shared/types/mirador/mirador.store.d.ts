import { MiradorState } from '@shared/types/mirador/mirador.state';

export interface MiradorStore {
	dispatch(action): void;
	getState(): MiradorState;
	replaceReducer(nextReducer): any;
	subscribe(listener): any;
}
