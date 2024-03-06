import { toast, ToastOptions } from 'react-toastify';

import { Toast, ToastProps } from '@shared/components';
import { tText } from '@shared/helpers/translate';
import { Optional } from '@shared/types';

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
