import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authService } from '@auth/services/auth-service';

import { UserSchema, UserState } from './user.types';

const initialState: UserState = {
	user: null,
};

export const loginAction = createAsyncThunk('users/login', async () => {
	const response = await authService.login();
	return response;
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(loginAction.fulfilled, (state, action) => {
			state.user = action.payload as UserSchema;
		});
	},
});
