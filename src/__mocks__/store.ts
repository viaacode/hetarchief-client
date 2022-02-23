import { configureStore } from '@reduxjs/toolkit';

export const mockStore = configureStore({
	preloadedState: {
		ui: { isStickyLayout: false, showNavigationBorder: false },
		user: { user: { firstName: 'Tom', lastName: 'Testerom' } },
	},
	reducer: (state) => state,
});
