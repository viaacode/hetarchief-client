import { ToastProps } from '../Toast.types';

export const toastMock: ToastProps = {
	title: 'Je annulering voor bezoekersruimte 4 is succesvol verstuurd',
	description:
		'Een annuleringsbevestiging van de bezoekersruimtebeheerder kan je verwachten in je mail inxox',
	buttonLabel: 'Ok',
	maxLines: 1,
	visible: true,
	onClose: () => console.log('close'),
};
