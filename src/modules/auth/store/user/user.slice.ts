import { createSlice } from '@reduxjs/toolkit';

import { UserState } from './user.types';

const initialState: UserState = {
	user: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// TODO: replace this once login is added
		setMockUser(state, action) {
			state.user = action.payload;
		},
	},
});

export const { setMockUser } = userSlice.actions;
