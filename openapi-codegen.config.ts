import { defineConfig } from '@openapi-codegen/cli';
import { generateReactQueryComponents, generateSchemaTypes } from '@openapi-codegen/typescript';

export default defineConfig({
	server: {
		from: {
			source: 'url',
			url: 'http://localhost:3100/docs-json',
		},
		outputDir: './src/modules/generated',
		to: async (context) => {
			const filenamePrefix = 'server';
			const { schemasFiles } = await generateSchemaTypes(context, {
				filenamePrefix,
			});
			await generateReactQueryComponents(context, {
				filenamePrefix,
				schemasFiles,
			});
		},
	},
});
