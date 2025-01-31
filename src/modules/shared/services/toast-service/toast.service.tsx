import { toast, type ToastOptions } from 'react-toastify';

import { Toast, type ToastProps } from '@shared/components/Toast';
import { tText } from '@shared/helpers/translate';
import type { Optional } from '@shared/types/utils';

class ToastService {
	public notify(
		{
			buttonLabel = tText('modules/shared/services/toast-service/toast___ok'),
			onClose,
			maxLines = 5,
			...toastProps
		}: Optional<ToastProps, 'maxLines' | 'buttonLabel' | 'onClose'>,
		toastOptions?: ToastOptions
	): string {
		const onToastClose = (closeToast?: () => void) => {
			onClose?.();
			closeToast?.();
		};

		return toast(
			({ closeToast }) => (
				<Toast
					{...toastProps}
					maxLines={maxLines}
					buttonLabel={buttonLabel}
					visible
					onClose={() => onToastClose(closeToast)}
				/>
			),
			{ autoClose: 10000, ...toastOptions }
		) as string;
	}

	public dismiss = toast.dismiss;
}

export const toastService = new ToastService();
