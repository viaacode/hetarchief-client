import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { userSlice } from '@auth/store/user';
import { mediaSlice } from '@shared/store/media';
import { tosSlice } from '@shared/store/tos';

import { historySlice } from './history';
import { AppStore } from './store.types';
import { uiSlice } from './ui';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const makeStore = () =>
	configureStore({
		reducer: {
			[uiSlice.name]: uiSlice.reducer,
			[userSlice.name]: userSlice.reducer,
			[tosSlice.name]: tosSlice.reducer,
			[mediaSlice.name]: mediaSlice.reducer,
			[historySlice.name]: historySlice.reducer,
		},
		devTools: process.env.DEBUG_TOOLS === 'true',
	});

export const wrapper = createWrapper<AppStore>(makeStore);
