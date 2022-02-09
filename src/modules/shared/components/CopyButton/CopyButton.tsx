import { Button, ButtonProps } from '@meemoo/react-components';
import copy from 'copy-to-clipboard';
import { useTranslation } from 'next-i18next';
import { FC, useCallback } from 'react';

import { toastService } from '@shared/services/toast-service';

import { Icon } from '../Icon';

const CopyButton: FC<ButtonProps & { text: string; enableToast?: boolean }> = (props) => {
	const { t } = useTranslation();
	const { onClick, text, enableToast = true } = props;

	const clickHandler = useCallback(
		(e) => {
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

	return <Button icon={<Icon name="copy" />} variants="sm" {...props} onClick={clickHandler} />;
};

export default CopyButton;
