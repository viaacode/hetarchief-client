/**
 * Validates a time duration. example: 00:30:15
 * max value: 23:59:59
 * also valid: 0:5:0
 * Parsed as: uu:mm:ss
 */
export const durationRegex = '([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])';
