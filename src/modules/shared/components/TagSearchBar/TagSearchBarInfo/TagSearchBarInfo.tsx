import {
	autoUpdate,
	offset,
	safePolygon,
	useClick,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
} from '@floating-ui/react';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import styles from './TagSearchBarInfo.module.scss';

export const TagSearchBarInfo: FC = () => {
	const [showContent, setShowContent] = useState(false);
	const { refs, floatingStyles, context } = useFloating({
		placement: 'bottom-end',
		open: showContent,
		onOpenChange: setShowContent,
		whileElementsMounted: autoUpdate,
		middleware: [offset(8)],
	});

	const click = useClick(context);
	const focus = useFocus(context);
	const dismiss = useDismiss(context);
	const hover = useHover(context, { handleClose: safePolygon() });
	const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, focus, hover]);

	return (
		<div
			className={clsx(
				styles['c-tag-search-bar-info'],
				showContent && styles['c-tag-search-bar-info--open']
			)}
		>
			<Button
				className={styles['c-tag-search-bar-info__button']}
				variants={['black', 'sm']}
				icon={<Icon name={IconNamesLight.Info} />}
				{...getReferenceProps()}
				ref={refs.setReference}
			></Button>

			{showContent && (
				<div
					className={styles['c-tag-search-bar-info__content']}
					style={{ ...floatingStyles }}
					{...getFloatingProps()}
					ref={refs.setFloating}
				>
					{tHtml(
						'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___pages-bezoekersruimte-zoeken-zoek-info'
					)}
				</div>
			)}
		</div>
	);
};
