import type { Avo } from '@viaa/avo2-types';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { selectCommonUser, selectUser } from '@auth/store/user';
import { AppState } from '@shared/store';

const withUser = (WrappedComponent: FunctionComponent) => {
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
	user: Avo.User.User | undefined;
	commonUser: Avo.User.CommonUser | undefined;
}
