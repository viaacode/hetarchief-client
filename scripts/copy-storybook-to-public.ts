import path from 'path';

import fs from 'fs-extra';

const srcPath = path.resolve(__dirname, '../storybook-static');
const destPath = path.resolve(__dirname, '../public/storybook');

const copyStorybookToPublic = async () => {
	// Cleanup previous public storybook
	try {
		await fs.remove(destPath);
		console.info('Cleaned up previous public Storybook folder');
	} catch (err) {
		return console.error(`Failed to remove public Storybook folder`, err);
	}

	// Copy built storybook files to public
	try {
		await fs.copy(srcPath, destPath);
		console.info('Copied Storybook build to public folder');
	} catch (err) {
		return console.error(`Failed to copy Storybook build to public folder`, err);
	}
};

copyStorybookToPublic();
