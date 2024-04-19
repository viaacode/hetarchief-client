export interface AltoFormatV2 {
	alto: AltoRoot;
}

interface AltoRoot {
	Description: AltoDescription;
	Layout: AltoLayout;
	_xmlns: string;
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
	preProcessingStep: AltoPreProcessingStep;
	ocrProcessingStep: AltoOcrProcessingStep;
	_ID: string;
}

interface AltoPreProcessingStep {
	processingDateTime: string;
	processingAgency: string;
	processingSoftware: AltoProcessingSoftware;
}

interface AltoProcessingSoftware {
	softwareCreator: string;
	softwareName: string;
	softwareVersion: string;
}

interface AltoOcrProcessingStep {
	processingSoftware: AltoProcessingSoftware2;
}

interface AltoProcessingSoftware2 {
	softwareCreator: string;
	softwareName: string;
	softwareVersion: string;
}

interface AltoLayout {
	Page: AltoPage;
}

interface AltoPage {
	PrintSpace: AltoPrintSpace;
	_ID: string;
	_HEIGHT: string;
	_WIDTH: string;
	_PHYSICAL_IMG_NR: string;
}

interface AltoPrintSpace {
	TextBlock: AltoTextBlock[];
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_HEIGHT: string;
	_WIDTH: string;
}

interface AltoTextBlock {
	TextLine: AltoTextLine | AltoTextLine[];
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_HEIGHT: string;
	_WIDTH: string;
}

export interface AltoTextLine {
	String: AltoString | AltoString[];
	_ID: string;
	_HPOS: string;
	_VPOS: string;
	_HEIGHT: string;
	_WIDTH: string;
}

export interface AltoString {
	_ID: string;
	_CONTENT: string;
	_HPOS: string;
	_VPOS: string;
	_HEIGHT: string;
	_WIDTH: string;
}
