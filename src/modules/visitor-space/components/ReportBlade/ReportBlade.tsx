import { BladeManager } from '@shared/components/BladeManager';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { isOwnOrganisation } from '@visitor-space/components/ReportBlade/ReportBlade.helpers';
import { type FC, useState } from 'react';
import type { ReportBladeProps } from './ReportBlade.types';
import ReportIssuesBlade from './ReportIssuesBlade/ReportIssuesBlade';
import ReportMetadataIssueBlade from './ReportMetadataIssueBlade/ReportMetadataIssueBlade';

const ROOT_BLADE_LAYER = 1;
const METADATA_ISSUE_BLADE_LAYER = 2;

/**
 * Thin wrapper: coordinates which of the two report blades (root issue selection vs. the
 * metadata-issue follow-up) is showing, and closes/resets both of them together.
 */
const ReportBlade: FC<ReportBladeProps> = (props) => {
	const { user, mediaInfo } = props;
	const locale = useLocale();
	const isKeyUser = useIsKeyUser();
	const isOwnOrg = isOwnOrganisation(user, mediaInfo?.maintainerId);

	const [isMetadataIssueBladeOpen, setIsMetadataIssueBladeOpen] = useState(false);

	const onCloseBlade = () => {
		props.onClose?.();
		// Wait for the blade to close before resetting back to the root step
		setTimeout(() => setIsMetadataIssueBladeOpen(false), 500);
	};

	const getBladeLayerIndex = (): number => {
		if (!props.isOpen) {
			return 0;
		}
		if (isMetadataIssueBladeOpen) {
			return METADATA_ISSUE_BLADE_LAYER;
		}
		return ROOT_BLADE_LAYER;
	};

	return (
		<BladeManager currentLayer={getBladeLayerIndex()} onCloseBlade={onCloseBlade}>
			<ReportIssuesBlade
				id={props.id}
				className={props.className}
				ariaLabel={props.ariaLabel}
				isOpen={props.isOpen}
				layer={ROOT_BLADE_LAYER}
				currentLayer={getBladeLayerIndex()}
				user={user}
				isKeyUser={isKeyUser}
				isOwnOrganisation={isOwnOrg}
				locale={locale}
				onClose={onCloseBlade}
				onAdvanceToMetadataIssue={() => setIsMetadataIssueBladeOpen(true)}
			/>
			<ReportMetadataIssueBlade
				id={`${props.id}__metadata-issue-blade`}
				className={props.className}
				ariaLabel={`${props.ariaLabel} - metadata`}
				isOpen={props.isOpen && isMetadataIssueBladeOpen}
				layer={METADATA_ISSUE_BLADE_LAYER}
				currentLayer={getBladeLayerIndex()}
				user={user}
				mediaInfo={mediaInfo}
				isOwnOrganisation={isOwnOrg}
				locale={locale}
				onClose={onCloseBlade}
			/>
		</BladeManager>
	);
};

export default ReportBlade;
