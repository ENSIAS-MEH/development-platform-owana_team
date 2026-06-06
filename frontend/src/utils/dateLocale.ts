// utils/dateLocale.ts
export const frLocale = {
  months: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
  monthsShort: [
    'jan',
    'fév',
    'mar',
    'avr',
    'mai',
    'juin',
    'juil',
    'août',
    'sep',
    'oct',
    'nov',
    'déc',
  ],
  weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  weekdaysShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
};

export function formatDateFr(date: Date | string | undefined | null): string {
  if (!date) return 'Non définie';

  const dateObj = date instanceof Date ? date : new Date(date);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(dateObj.getTime())) return 'Date invalide';

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = frLocale.monthsShort[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
}
