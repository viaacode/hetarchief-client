import type { Avo } from '@viaa/avo2-types';
import React, { type FunctionComponent, type ReactNode } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { selectCheckLoginLoading, selectCommonUser, selectUser } from '@auth/store/user';
import type { AppState } from '@shared/store';

const withUser = (WrappedComponent: FunctionComponent) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return React.memo(function withUser(props: any) {
		return <WrappedComponent {...props} />;
	});
};

const mapStateToProps = (state: AppState) => ({
	user: selectUser(state),
	commonUser: selectCommonUser(state),
	isLoadingUserStatus: selectCheckLoginLoading(state),
});

export default compose(connect(mapStateToProps), withUser);

export interface UserProps {
	children?: ReactNode;
	user: Avo.User.User | undefined;
	commonUser: Avo.User.CommonUser | undefined;
	isLoadingUserStatus: boolean;
}
