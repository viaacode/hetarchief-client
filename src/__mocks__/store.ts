import * as toolkitRaw from '@reduxjs/toolkit';

export const mockStore = toolkitRaw.configureStore({
	preloadedState: {
		ui: { isStickyLayout: false },
		user: { user: { firstName: 'Tom', lastName: 'Testerom' } },
	},
	reducer: (state) => state,
});
