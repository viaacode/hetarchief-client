import { i18n } from 'next-i18next';
import { toast, ToastOptions } from 'react-toastify';

import { Toast, ToastProps } from '@shared/components';
import { Optional } from '@shared/types';

class ToastService {
	public notify(
		{
			buttonLabel = i18n?.t('modules/shared/services/toast-service/toast___ok') ?? 'OK',
			onClose,
			maxLines = 5,
			...toastProps
		}: Optional<ToastProps, 'maxLines' | 'buttonLabel' | 'onClose'>,
		toastOptions?: ToastOptions
	) {
		const onToastClose = (closeToast?: () => void) => {
			onClose?.();
			closeToast?.();
		};

		toast(
			({ closeToast }) => (
				<Toast
					{...toastProps}
					maxLines={maxLines}
					buttonLabel={buttonLabel}
					visible
					onClose={() => onToastClose(closeToast)}
				/>
			),
			toastOptions
		);
	}

	public dismiss = toast.dismiss;
}

export const toastService = new ToastService();
