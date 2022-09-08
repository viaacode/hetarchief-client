import { Button, ButtonProps } from '@meemoo/react-components';
import copy from 'copy-to-clipboard';
import { FC, MouseEvent, useCallback } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';

import { Icon } from '../Icon';

const CopyButton: FC<ButtonProps & { text: string; enableToast?: boolean }> = (props) => {
	const { t, tText } = useTranslation();
	const { onClick, text, enableToast = true } = props;

	const clickHandler = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();

			const copied = copy(text);

			if (copied && enableToast) {
				toastService.notify({
					title: t('modules/shared/components/copy-button/copy-button___success'),
					description: t(
						'modules/shared/components/copy-button/copy-button___text-was-copied-to-your-clipboard',
						{
							text,
						}
					),
				});
			}

			onClick?.(e);
		},
		[onClick, text, enableToast, t]
	);

	return (
		<Button
			icon={<Icon name="copy" aria-hidden />}
			aria-label={tText(
				'modules/shared/components/copy-button/copy-button___kopieer-naar-klembord'
			)}
			variants="sm"
			{...props}
			onClick={clickHandler}
		/>
	);
};

export default CopyButton;
