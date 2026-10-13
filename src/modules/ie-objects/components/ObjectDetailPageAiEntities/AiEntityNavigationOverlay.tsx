import { AiEntityPortrait } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityPortrait';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './AiEntityNavigationOverlay.module.scss';

export interface AiEntityNavigationOverlayProps {
	/** The entity whose interval was selected last */
	entity: AiEntity;
	intervalIndex: number;
	onSelectInterval: (intervalIndex: number) => void;
	/** Clears the selection */
	onClose: () => void;
	/** Sits above the player's controls; without them the bar moves down to the bottom edge */
	isRaised?: boolean;
}

// Mobile only: the cards sit on the metadata tab, so this bar over the player is how a user
// steps through the moments of the selected entity while watching
export const AiEntityNavigationOverlay: FC<AiEntityNavigationOverlayProps> = ({
	entity,
	intervalIndex,
	onSelectInterval,
	onClose,
	isRaised = true,
}) => {
	const total = entity.intervals.length;

	return (
		<div
			className={clsx(styles['c-ai-entity-navigation-overlay'], {
				[styles['c-ai-entity-navigation-overlay--raised']]: isRaised,
			})}
		>
			<div className={styles['c-ai-entity-navigation-overlay__bar']}>
				<AiEntityPortrait
					className={styles['c-ai-entity-navigation-overlay__portrait']}
					entity={entity}
					size="xs"
				/>
				<span className={styles['c-ai-entity-navigation-overlay__name']}>{entity.name}</span>

				<div className={styles['c-ai-entity-navigation-overlay__controls']}>
					<Button
						icon={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
						ariaLabel={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___vorig-moment'
						)}
						className={styles['c-ai-entity-navigation-overlay__button']}
						disabled={intervalIndex <= 0}
						variants={['sm', 'text', 'white']}
						onClick={() => onSelectInterval(intervalIndex - 1)}
					/>
					{/* Live, so a screen reader hears the new position after previous / next */}
					<span
						className={styles['c-ai-entity-navigation-overlay__count']}
						aria-live="polite"
						aria-atomic="true"
					>
						{tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___index-van-total',
							{ index: intervalIndex + 1, total }
						)}
					</span>
					<Button
						icon={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
						ariaLabel={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___volgend-moment'
						)}
						className={styles['c-ai-entity-navigation-overlay__button']}
						disabled={intervalIndex >= total - 1}
						variants={['sm', 'text', 'white']}
						onClick={() => onSelectInterval(intervalIndex + 1)}
					/>
					<span className={styles['c-ai-entity-navigation-overlay__divider']} aria-hidden />
					<Button
						icon={<Icon name={IconNamesLight.Times} aria-hidden />}
						ariaLabel={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___sluiten'
						)}
						className={styles['c-ai-entity-navigation-overlay__button']}
						variants={['sm', 'text', 'white']}
						onClick={onClose}
					/>
				</div>
			</div>
		</div>
	);
};
