import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

export const getFileNameIcon = (fileName: string): IconNamesLight => {
	const extension = fileName.split('.').pop()?.toLowerCase();

	switch (extension) {
		case 'pdf':
			return IconNamesLight.FilePdf;
		case 'doc':
		case 'docx':
			return IconNamesLight.FileDoc;
		case 'xls':
		case 'xlsx':
			return IconNamesLight.FileXls;
		case 'jpg':
		case 'jpeg':
			return IconNamesLight.FileJpg;
		case 'png':
			return IconNamesLight.FilePng;
		case 'csv':
			return IconNamesLight.FileCsv;
		default:
			return IconNamesLight.File;
	}
};
