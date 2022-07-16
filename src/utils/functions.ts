import { AllModels, ArrayInObject } from 'model';

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
export const getEntity = (url: string) => url.split(regex)[1];

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
