export const SUBTITLES_TEASER_COOKIE = 'hetarchief_ai_subtitles_teaser_dismissed';
export const SUBTITLES_TEASER_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const SUBTITLES_TEASER_DURATION_MS = 10_000;

// react-components gives the subtitles button no hook, only an aria-controls id ending in "__subtitles"
export const SUBTITLES_BUTTON_SELECTOR = 'button[aria-controls$="__subtitles"]';
