import * as toolkitRaw from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { userSlice } from '@auth/store/user/user.slice';
import { IeObjectsSlice } from '@shared/store/ie-objects/ie-objects.slice';
import { tosSlice } from '@shared/store/tos/tos.slice';
import { uiSlice } from '@shared/store/ui/ui.slice';

import { AppStore } from './store.types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const makeStore = () =>
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
