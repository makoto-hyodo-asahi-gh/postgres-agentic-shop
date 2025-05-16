// sample output for the isSomething function
// isSomething(0):true
// isSomething(1):true
// isSomething(""):false
// isSomething("abc"):true
// isSomething(-1):true
// isSomething([1,2,3]):true
// isSomething([]):false
// isSomething(null):false
// isSomething(undefined):false
// isSomething({a:10}):true
// isSomething({}):false

import { COLOR_MAP } from 'constants/constants';

const isSomething = (data: unknown) => {
  if (data === null || data === undefined) return false;

  if (typeof data === 'number') return true;

  if (typeof data === 'string' && data.length === 0) return false;

  if (typeof data === 'object' && Object.keys(data).length === 0) return false;

  if (Array.isArray(data) && data.length === 0) return false;

  return true;
};

export default isSomething;

export const getUserIdFromSession = (): string | null => sessionStorage.getItem('userId');

// Function to get color value from the color name
type ColorName = keyof typeof COLOR_MAP;

export const getColorValue = (colorName: string) => COLOR_MAP[colorName as ColorName] || COLOR_MAP.default;
