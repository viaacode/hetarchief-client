import { toast, ToastOptions } from 'react-toastify';

import { Toast, ToastProps } from '@shared/components';
import { TranslationService } from '@shared/services/translation-service/translation-service';
import { Optional } from '@shared/types';

class ToastService {
	public notify(
		{
			buttonLabel = TranslationService.t('modules/shared/services/toast-service/toast___ok'),
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
