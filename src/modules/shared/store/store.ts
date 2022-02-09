import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { userSlice } from '@auth/store/user';

import { AppStore } from './store.types';
import { uiSlice } from './ui';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const makeStore = () =>
	configureStore({
		reducer: {
			[uiSlice.name]: uiSlice.reducer,
			[userSlice.name]: userSlice.reducer,
		},
		devTools: process.env.NODE_ENV !== 'production',
	});

export const wrapper = createWrapper<AppStore>(makeStore);
