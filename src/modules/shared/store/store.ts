import * as toolkitRaw from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { userSlice } from '@auth/store/user';
import { IeObjectsSlice } from '@shared/store/ie-objects';
import { tosSlice } from '@shared/store/tos';

import { type AppStore } from './store.types';
import { uiSlice } from './ui';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const makeStore = (): toolkitRaw.Store =>
	toolkitRaw.configureStore({
		reducer: {
			[uiSlice.name]: uiSlice.reducer,
			[userSlice.name]: userSlice.reducer,
			[tosSlice.name]: tosSlice.reducer,
			[IeObjectsSlice.name]: IeObjectsSlice.reducer,
		},
		devTools: process.env.DEBUG_TOOLS === 'true',
	});

export const wrapper = createWrapper<AppStore>(makeStore);
