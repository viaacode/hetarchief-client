import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { AppStore } from './store.types';
import { uiSlice } from './ui';

export const makeStore = (): EnhancedStore =>
	configureStore({
		reducer: {
			[uiSlice.name]: uiSlice.reducer,
		},
		devTools: process.env.NODE_ENV !== 'production',
	});

export const wrapper = createWrapper<AppStore>(makeStore);
