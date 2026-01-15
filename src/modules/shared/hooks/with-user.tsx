import { selectCommonUser, selectUser } from '@auth/store/user';
import type { AppState } from '@shared/store';
import type { AvoUserCommonUser, AvoUserUser } from '@viaa/avo2-types';
import React, { type FunctionComponent, type ReactNode } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

const withUser = (WrappedComponent: FunctionComponent) => {
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	return React.memo(function withUser(props: any) {
		return <WrappedComponent {...props} />;
	});
};

const mapStateToProps = (state: AppState) => ({
	user: selectUser(state),
	commonUser: selectCommonUser(state),
});

export default compose(connect(mapStateToProps), withUser);

export interface UserProps {
	children?: ReactNode;
	user: AvoUserUser | undefined;
	commonUser: AvoUserCommonUser | undefined;
}
