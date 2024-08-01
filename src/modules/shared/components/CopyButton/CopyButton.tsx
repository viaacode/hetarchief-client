import { Button, type ButtonProps } from '@meemoo/react-components';
import copy from 'copy-to-clipboard';
import { type FC, type MouseEvent, useCallback } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';

const CopyButton: FC<ButtonProps & { text: string; enableToast?: boolean }> = (props) => {
	const { onClick, text, enableToast = true } = props;

	const clickHandler = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();

			const copied = copy(text);

			if (copied && enableToast) {
				toastService.notify({
					title: tHtml('modules/shared/components/copy-button/copy-button___success'),
					description: tHtml(
						'modules/shared/components/copy-button/copy-button___text-was-copied-to-your-clipboard',
						{
							text,
						}
					),
				});
			}

			onClick?.(e);
		},
		[onClick, text, enableToast]
	);

	return (
		<Button
			iconStart={props.iconStart}
			icon={!props.iconStart && <Icon name={IconNamesLight.Copy} aria-hidden />}
			aria-label={
				props['aria-label'] ||
				tText('modules/shared/components/copy-button/copy-button___kopieer-naar-klembord')
			}
			variants={props.variants || 'sm'}
			{...props}
			onClick={clickHandler}
		/>
	);
};

export default CopyButton;
