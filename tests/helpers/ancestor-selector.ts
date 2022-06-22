import { selectors } from '@playwright/test';

const ancestorEngine = () => ({
	query(root, selector) {
		return root.closest(selector);
	},
	queryAll(root, selector) {
		const closest = root.closest(selector);
		return closest ? [closest] : [];
	},
});
selectors
	.register('ancestor', ancestorEngine, { contentScript: true })
	.catch((err) => console.error('Failed to register custom selector: ancestor', err));
