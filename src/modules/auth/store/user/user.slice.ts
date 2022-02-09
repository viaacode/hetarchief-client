import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authService } from '../../services/auth-service';
import { UserSchema } from '../../types';

import { UserState } from './user.types';

const initialState: UserState = {
	user: null,
	loading: false,
	error: null,
};

export const checkLoginAction = createAsyncThunk<UserSchema, undefined, { rejectValue: string }>(
	'users/login',
	async (_, thunkApi) => {
		try {
			const response = await authService.checkLogin();
			return response?.userInfo as UserSchema;
		} catch (error) {
			return thunkApi.rejectWithValue(error as string);
		}
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Check login
		builder
			.addCase(checkLoginAction.pending, (state) => {
				state.loading = true;
			})
			.addCase(checkLoginAction.fulfilled, (state, action) => {
				state.user = action.payload;
				state.loading = false;
			})
			.addCase(checkLoginAction.rejected, (state, action) => {
				state.user = null;
				state.loading = false;
				state.error = action.payload;
			});
	},
});
