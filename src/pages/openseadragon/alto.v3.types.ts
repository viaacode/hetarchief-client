export interface AltoFormatV3 {
	alto: AltoRoot;
}

interface AltoRoot {
	Description: AltoDescription;
	Layout: AltoLayout;
	_xmlns: string;
	'_xmlns:xlink': string;
	'_xmlns:xsi': string;
	'_xsi:schemaLocation': string;
}

interface AltoDescription {
	MeasurementUnit: string;
	sourceImageInformation: AltoSourceImageInformation;
	OCRProcessing: AltoOcrprocessing;
}

interface AltoSourceImageInformation {
	fileName: string;
}

interface AltoOcrprocessing {
	ocrProcessingStep: AltoOcrProcessingStep;
	_ID: string;
}

interface AltoOcrProcessingStep {
	processingSoftware: AltoProcessingSoftware;
}

interface AltoProcessingSoftware {
	softwareName: string;
}

interface AltoLayout {
	Page: AltoPage;
}

interface AltoPage {
	PrintSpace: AltoPrintSpace;
	_WIDTH: string;
	_HEIGHT: string;
	_PHYSICAL_IMG_NR: string;
	_ID: string;
}

interface AltoPrintSpace {
	Illustration: AltoIllustration[];
	ComposedBlock: AltoComposedBlock[];
	GraphicalElement: AltoGraphicalElement[];
	_HPOS: string;
	_VPOS: string;
	_WIDTH: string;
	_HEIGHT: string;
}

interface AltoIllustration {
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_WIDTH: string;
	_HEIGHT: string;
}

interface AltoComposedBlock {
	TextBlock: AltoTextBlock;
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_WIDTH: string;
	_HEIGHT: string;
}

interface AltoTextBlock {
	TextLine: AltoTextLine;
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_WIDTH: string;
	_HEIGHT: string;
}

interface AltoTextLine {
	String: AltoString;
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_WIDTH: string;
	_HEIGHT: string;
}

interface AltoString {
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_WIDTH: string;
	_HEIGHT: string;
	_WC: string;
	_CONTENT: string;
}

interface AltoGraphicalElement {
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_WIDTH: string;
	_HEIGHT: string;
}
