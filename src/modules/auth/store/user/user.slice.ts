import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AuthService, CheckLoginResponse } from '../../services/auth-service';

import { UserState } from './user.types';

const initialState: UserState = {
	user: null,
	commonUser: null,
	loading: false,
	hasCheckedLogin: false,
	error: null,
};

export const checkLoginAction = createAsyncThunk<
	CheckLoginResponse,
	undefined,
	{ rejectValue: string }
>('users/login', async (_, thunkApi) => {
	try {
		return AuthService.checkLogin();
	} catch (error) {
		return thunkApi.rejectWithValue(error as string);
	}
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Check login
		builder
			.addCase(checkLoginAction.pending, (state) => {
				state.hasCheckedLogin = false;
				state.loading = true;
			})
			.addCase(checkLoginAction.fulfilled, (state, action) => {
				state.user = action.payload?.userInfo || null;
				state.commonUser = action.payload?.commonUserInfo || null;
				state.hasCheckedLogin = true;
				state.loading = false;
			})
			.addCase(checkLoginAction.rejected, (state, action) => {
				state.user = null;
				state.hasCheckedLogin = true;
				state.loading = false;
				state.error = action.payload;
			});
	},
});
