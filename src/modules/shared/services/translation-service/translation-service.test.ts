import { ApiService } from '@shared/services/api-service';
import { TranslationService } from '@shared/services/translation-service/translation-service';

describe('TranslationService', () => {
	const mockTranslationsJson = (mockTranslations: Record<string, string>) => {
		ApiService.getApi = jest.fn().mockReturnValue({
			get: () => {
				return {
					json: async () => {
						return mockTranslations;
					},
				};
			},
		});
	};

	it('Should get a translation without params', async () => {
		mockTranslationsJson({
			key1: 'value1',
			key2: 'test with {{param1}} and {{param2}} and {{param3}} and {{param1}}.',
		});

		await TranslationService.initTranslations();

		const translation = TranslationService.getTranslation('key1');

		expect(translation).toEqual('value1');
	});

	it('Should get a translation with params', async () => {
		mockTranslationsJson({
			key2: 'test with {{param1}} and {{param2}} and {{param3}} and {{param1}}.',
		});

		await TranslationService.initTranslations();

		const translation = TranslationService.getTranslation('key2', {
			param1: 'p1',
			param2: 'p2',
		});

		expect(translation).toEqual('test with p1 and p2 and {{param3}} and p1.');
	});

	it('Should get a fallback for a translation that does not exist', async () => {
		mockTranslationsJson({});

		await TranslationService.initTranslations();

		const translation = TranslationService.getTranslation(
			'path-to-file___key3-with-some-words',
			{
				param1: 'p1',
				param2: 'p2',
			}
		);

		expect(translation).toEqual('key3 with some words ***');
	});
});
