export interface MiradorConfig {
	id: string;
	state?: State;
	canvasNavigation?: CanvasNavigation;
	selectedTheme?: string;
	themes?: Themes;
	theme?: Theme;
	language?: string;
	availableLanguages?: AvailableLanguages;
	annotations?: Annotations2;
	createGenerateClassNameOptions?: CreateGenerateClassNameOptions;
	requests?: Requests;
	translations?: Translations;
	window?: MiradorWindow;
	windows: Windows[];
	thumbnails?: Thumbnails;
	thumbnailNavigation?: ThumbnailNavigation;
	workspace?: Workspace;
	workspaceControlPanel?: WorkspaceControlPanel;
	galleryView?: GalleryView;
	osdConfig?: OsdConfig;
	export?: Export;
	audioOptions?: AudioOptions;
	videoOptions?: VideoOptions;
	auth?: Auth;
}

interface State {
	slice: string;
}

interface CanvasNavigation {
	height: number;
	width: number;
}

interface Themes {
	dark: Dark;
	light: Light;
}

interface Dark {
	palette: Palette;
}

interface Palette {
	mode: string;
	primary: Primary;
	secondary: Secondary;
	shades: Shades;
}

interface Primary {
	main: string;
}

interface Secondary {
	main: string;
}

interface Shades {
	dark: string;
	main: string;
	light: string;
}

interface Light {
	palette: Palette2;
}

interface Palette2 {
	mode: string;
}

interface Theme {
	palette: Palette3;
	typography: Typography;
	components: Components;
}

interface Palette3 {
	mode: string;
	primary: Primary2;
	secondary: Secondary2;
	shades: Shades2;
	error: Error;
	notification: Notification;
	hitCounter: HitCounter;
	highlights: Highlights;
	section_divider: string;
	annotations: Annotations;
	search: Search;
}

interface Primary2 {
	main: string;
}

interface Secondary2 {
	main: string;
}

interface Shades2 {
	dark: string;
	main: string;
	light: string;
}

interface Error {
	main: string;
}

interface Notification {
	main: string;
}

interface HitCounter {
	default: string;
}

interface Highlights {
	primary: string;
	secondary: string;
}

interface Annotations {
	chipBackground: string;
	hidden: Hidden;
	default: Default;
	hovered: Hovered;
	selected: Selected;
}

interface Hidden {
	globalAlpha: number;
}

interface Default {
	strokeStyle: string;
	globalAlpha: number;
}

interface Hovered {
	strokeStyle: string;
	globalAlpha: number;
}

interface Selected {
	strokeStyle: string;
	globalAlpha: number;
}

interface Search {
	default: Default2;
	hovered: Hovered2;
	selected: Selected2;
}

interface Default2 {
	fillStyle: string;
	globalAlpha: number;
}

interface Hovered2 {
	fillStyle: string;
	globalAlpha: number;
}

interface Selected2 {
	fillStyle: string;
	globalAlpha: number;
}

interface Typography {
	body1: Body1;
	body2: Body2;
	button: Button;
	caption: Caption;
	body1Next: Body1Next;
	body2Next: Body2Next;
	buttonNext: ButtonNext;
	captionNext: CaptionNext;
	overline: Overline;
	h1: H1;
	h2: H2;
	h3: H3;
	h4: H4;
	h5: H5;
	h6: H6;
	subtitle1: Subtitle1;
	subtitle2: Subtitle2;
	useNextVariants: boolean;
}

interface Body1 {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface Body2 {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface Button {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
	textTransform: string;
}

interface Caption {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface Body1Next {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface Body2Next {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface ButtonNext {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface CaptionNext {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface Overline {
	fontSize: string;
	fontWeight: number;
	letterSpacing: string;
	lineHeight: string;
	textTransform: string;
}

interface H1 {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface H2 {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface H3 {
	fontSize: string;
	fontWeight: number;
	letterSpacing: string;
	lineHeight: string;
}

interface H4 {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface H5 {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
}

interface H6 {
	fontSize: string;
	fontWeight: number;
	letterSpacing: string;
	lineHeight: string;
}

interface Subtitle1 {
	fontSize: string;
	letterSpacing: string;
	lineHeight: string;
	fontWeight: number;
}

interface Subtitle2 {
	fontSize: string;
	fontWeight: number;
	letterSpacing: string;
	lineHeight: string;
}

interface Components {
	MuiMenuItem: MuiMenuItem;
	CompanionWindow: CompanionWindow;
	CompanionWindowSection: CompanionWindowSection;
	IIIFHtmlContent: IiifhtmlContent;
	IIIFThumbnail: Iiifthumbnail;
	ThemeIcon: ThemeIcon;
	MuiAccordion: MuiAccordion;
	MuiButton: MuiButton;
	MuiButtonBase: MuiButtonBase;
	MuiDialog: MuiDialog;
	MuiFab: MuiFab;
	MuiLink: MuiLink;
	MuiListSubheader: MuiListSubheader;
	MuiTooltip: MuiTooltip;
	MuiTouchRipple: MuiTouchRipple;
}

interface MuiMenuItem {
	variants: Variant[];
}

interface Variant {
	props: Props;
	style: Style;
}

interface Props {
	variant: string;
}

interface Style {
	whiteSpace: string;
}

interface CompanionWindow {
	styleOverrides: StyleOverrides;
}

interface StyleOverrides {
	closeButton: CloseButton;
	contents: Contents;
	controls: string;
	resize: string;
	root: string;
	title: string;
	toolbar: string;
}

interface CloseButton {
	order: number;
}

interface Contents {
	overflowY: string;
	wordBreak: string;
}

interface CompanionWindowSection {
	styleOverrides: StyleOverrides2;
}

interface StyleOverrides2 {
	root: Root2;
}

interface Root2 {
	borderBlockEnd: string;
}

interface IiifhtmlContent {
	styleOverrides: StyleOverrides3;
}

interface StyleOverrides3 {
	root: string;
}

interface Iiifthumbnail {
	styleOverrides: StyleOverrides4;
}

interface StyleOverrides4 {
	root: string;
	label: string;
	image: string;
}

interface ThemeIcon {
	styleOverrides: StyleOverrides5;
}

interface StyleOverrides5 {
	icon: string;
}

interface MuiAccordion {
	variants: Variant2[];
}

interface Variant2 {
	props: Props2;
	style: Style2;
}

interface Props2 {
	variant: string;
}

interface Style2 {
	'& .MuiAccordionSummary-root': MuiAccordionSummaryRoot;
	'& .MuiAccordionSummary-content': MuiAccordionSummaryContent;
	'& .MuiAccordionDetails-root': MuiAccordionDetailsRoot;
}

interface MuiAccordionSummaryRoot {
	minHeight: string;
	padding: number;
}

interface MuiAccordionSummaryContent {
	margin: number;
}

interface MuiAccordionDetailsRoot {
	padding: number;
}

interface MuiButton {
	styleOverrides: StyleOverrides6;
}

interface StyleOverrides6 {
	inlineText: InlineText;
	inlineTextSecondary: string;
}

interface InlineText {
	lineHeight: string;
	padding: number;
	textAlign: string;
	textTransform: string;
}

interface MuiButtonBase {
	defaultProps: DefaultProps;
}

interface DefaultProps {
	disableTouchRipple: boolean;
}

interface MuiDialog {
	variants: Variant3[];
}

interface Variant3 {
	props: Props3;
	style: Style3;
}

interface Props3 {
	variant: string;
}

interface Style3 {
	position: string;
	'& .MuiBackdrop-root': MuiBackdropRoot;
}

interface MuiBackdropRoot {
	position: string;
}

interface MuiFab {
	styleOverrides: StyleOverrides7;
}

interface StyleOverrides7 {
	root: Root3;
}

interface Root3 {
	transition: string;
}

interface MuiLink {
	defaultProps: DefaultProps2;
}

interface DefaultProps2 {
	underline: string;
}

interface MuiListSubheader {
	styleOverrides: StyleOverrides8;
}

interface StyleOverrides8 {
	root: string;
}

interface MuiTooltip {
	styleOverrides: StyleOverrides9;
}

interface StyleOverrides9 {
	tooltipPlacementLeft: TooltipPlacementLeft;
	tooltipPlacementRight: TooltipPlacementRight;
	tooltipPlacementTop: TooltipPlacementTop;
	tooltipPlacementBottom: TooltipPlacementBottom;
}

interface TooltipPlacementLeft {
	'@media (min-width:600px)': MediaMinWidth600px;
}

interface MediaMinWidth600px {
	margin: string;
}

interface TooltipPlacementRight {
	'@media (min-width:600px)': MediaMinWidth600px2;
}

interface MediaMinWidth600px2 {
	margin: string;
}

interface TooltipPlacementTop {
	'@media (min-width:600px)': MediaMinWidth600px3;
}

interface MediaMinWidth600px3 {
	margin: string;
}

interface TooltipPlacementBottom {
	'@media (min-width:600px)': MediaMinWidth600px4;
}

interface MediaMinWidth600px4 {
	margin: string;
}

interface MuiTouchRipple {
	styleOverrides: StyleOverrides10;
}

interface StyleOverrides10 {
	childPulsate: ChildPulsate;
	rippleVisible: RippleVisible;
}

interface ChildPulsate {
	animation: string;
}

interface RippleVisible {
	animation: string;
}

interface AvailableLanguages {
	ar: string;
	de: string;
	en: string;
	et: string;
	fa: string;
	fr: string;
	ja: string;
	kr: string;
	lt: string;
	nl: string;
	'nb-NO': string;
	pl: string;
	'pt-BR': string;
	vi: string;
	'zh-CN': string;
	'zh-TW': string;
	it: string;
	sr: string;
	sv: string;
	bg: string;
}

interface Annotations2 {
	htmlSanitizationRuleSet: string;
	filteredMotivations: string[];
}

interface CreateGenerateClassNameOptions {
	productionPrefix: string;
}

interface Requests {
	preprocessors: any[];
	postprocessors: any[];
}

interface Translations {}

interface MiradorWindow {
	allowClose?: boolean;
	allowFullscreen?: boolean;
	allowMaximize?: boolean;
	allowTopMenuButton?: boolean;
	allowWindowSideBar?: boolean;
	authNewWindowCenter?: string;
	sideBarPanel?: string;
	defaultSidebarPanelHeight?: number;
	defaultSidebarPanelWidth?: number;
	defaultView?: string;
	forceDrawAnnotations?: boolean;
	hideWindowTitle?: boolean;
	highlightAllAnnotations?: boolean;
	showLocalePicker?: boolean;
	sideBarOpen?: boolean;
	switchCanvasOnSearch?: boolean;
	panels?: Panels;
	views?: View[];
	elastic?: Elastic;
}

interface Panels {
	info: boolean;
	attribution: boolean;
	canvas: boolean;
	annotations: boolean;
	search: boolean;
	layers: boolean;
}

interface View {
	key: string;
	behaviors?: string[];
}

interface Elastic {
	height: number;
	width: number;
}

interface Windows {
	manifestId: string;
	canvasId?: string;
	thumbnailNavigationPosition?: string;
	maximized?: boolean;
}

interface Thumbnails {
	preferredFormats: string[];
}

interface ThumbnailNavigation {
	defaultPosition: 'off' | 'far-bottom' | 'far-right';
	displaySettings: boolean;
	height: number;
	width: number;
}

export interface Workspace {
	draggingEnabled?: boolean;
	allowNewWindows?: boolean;
	id?: string;
	isWorkspaceAddVisible?: boolean;
	exposeModeOn?: boolean;
	height?: number;
	showZoomControls?: boolean;
	type?: string;
	viewportPosition?: ViewportPosition;
	width?: number;
}

interface ViewportPosition {
	x: number;
	y: number;
}

interface WorkspaceControlPanel {
	enabled: boolean;
}

interface GalleryView {
	height: number;
	width: any;
}

interface OsdConfig {
	alwaysBlend: boolean;
	blendTime: number;
	preserveImageSizeOnResize: boolean;
	preserveViewport: boolean;
	showNavigationControl: boolean;
}

interface Export {
	catalog: boolean;
	companionWindows: boolean;
	config: boolean;
	elasticLayout: boolean;
	layers: boolean;
	manifests: Manifests;
	viewers: boolean;
	windows: boolean;
	workspace: boolean;
}

interface Manifests {
	filter: string;
}

interface AudioOptions {
	controls: boolean;
	crossOrigin: string;
}

interface VideoOptions {
	controls: boolean;
	crossOrigin: string;
}

interface Auth {
	serviceProfiles: ServiceProfile[];
}

interface ServiceProfile {
	profile: string;
}
