export const checkFileSize = (file?: File): boolean => {
	let valid = true;

	if (file) {
		const size = file.size / 1024;
		if (size > 500) {
			valid = false;
		}
	}

	return valid;
};

export const checkFileType = (file?: File): boolean => {
	let valid = true;

	if (file) {
		if (!['image/jpeg', 'image/png'].includes(file.type)) {
			valid = false;
		}
	}
	return valid;
};
