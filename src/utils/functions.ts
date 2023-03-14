export const deleteEmptyFields = function (obj: AllModels) {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      // TODO: HERE ONLY ARRAY EXISTS BUT THIS ERROR.... had to make a assertion.
      const sameObj = <ArrayInObject>obj;
      sameObj[key] = sameObj[key].filter((el: string) => el !== '');
    }
    if (obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
};

// get /THISPART/of/url
const regex = /\//;
/** split the url by "/"  then get index 1 */

// export const getEntity = (url: string) => url.split(regex)[1];
// export const cutQuery = (url: string) => url.split(/\?/)[0];

export const pipe =
  <T>(...fns: Array<(fns: T) => T>) =>
  (value: T) =>
    fns.reduce((v, f) => f(v), value);

export const getFirstPath = (url: string) => url.split(regex)[1];
export const cutQuery = (url: string) => url.split(/\?/)[0];
export const getEntity = pipe(getFirstPath, cutQuery);
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

//  Returns necessary date object
const NEXT_WEEK = 7;
const TWO_WEEKS = 14;
export const getDatesObjects = (days = 0) => {
  // Se lo chiama con arg number, getFuterDate(2.custom ti da Date di 2 giorni dopo.
  const today = new Date();
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + NEXT_WEEK
  );
  const twoWeeksAhead = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + TWO_WEEKS
  );
  const custom = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + days
  );
  const todayFormatted = formatDate(today);
  return {
    nextWeek,
    twoWeeksAhead,
    custom,
    today,
    todayFormatted
  };
};
type TolocaleOptions = {
  weekToDay: Intl.DateTimeFormatOptions;
  detailedDate: Intl.DateTimeFormatOptions;
};

const options: TolocaleOptions = {
  weekToDay: {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  detailedDate: {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
};

export const formatDate = (date: Date): string =>
  date.toLocaleString('it-IT', options.weekToDay);
export const detailedDate = (date: Date): string =>
  date.toLocaleString('it-IT', options.detailedDate);

export const formatDateASCII = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric' }) +
  date.toLocaleDateString('en-US', { month: 'numeric' }) +
  date.toLocaleDateString('en-US', { day: 'numeric' }) +
  date.getHours(); /*  + date.getMinutes() + date.getSeconds() */

/**
 *
 * @param str - string to be replaced
 * @param replacer - default is empty string
 * @returns
 */
export const replaceSpaces = (str: string, replacer = '') =>
  str.trim().replace(/\s+/g, replacer);

export const replaceHyphens = (str: string, replacer = '_') =>
  str.replace(/-/g, replacer);

export const replaceSlash = (str: string, replacer = '_') =>
  str.replace(/\//g, replacer);

export const replaceSpecialChars = (str: string) =>
  str.replace(/[^\w\s]/gi, '_').replace(/\s+/g, '_');
