import { object, type Schema, string } from 'yup';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { type NewsletterFormState } from '@shared/types/newsletter';

export const NEWSLETTER_FORM_SCHEMA = (): Schema<NewsletterFormState> => {
	const { tText } = useTranslation();

	return object({
		firstName: string().required(
			tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-voornaam-moet-ingevuld-zijn')
		),
		lastName: string().required(
			tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-achternaam-moet-ingevuld-zijn')
		),
		mail: string()
			.email(
				tText(
					'pages/nieuwsbrief/index___nieuwsbrief-formulier-dit-is-geen-geldig-emailadres'
				)
			)
			.required(
				tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-email-moet-ingevuld-zijn')
			),
	});
};

export const labelKeys: Record<keyof NewsletterFormState, string> = {
	firstName: 'NewsletterForm__firstName',
	lastName: 'NewsletterForm__lastName',
	mail: 'NewsletterForm__email',
};
