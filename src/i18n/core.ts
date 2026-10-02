// React-free i18n core so it can be unit-tested with plain node.
import strings from './strings.json' with { type: 'json' };

export type Lang = 'en' | 'bn';

const STORAGE_KEY = 'abnf_lang';
const dict = strings as Record<Lang, Record<string, string>>;

function readInitial(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'bn' ? 'bn' : 'en';
  } catch {
    return 'en';
  }
}

let current: Lang = readInitial();
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return current;
}

export function setLang(next: Lang) {
  if (next === current) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage may be unavailable; the choice then lasts for this visit only */
  }
  listeners.forEach((l) => l());
}

export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

const warned = new Set<string>();
function todoReview(key: string, why: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`TODO_REVIEW i18n: ${why} "${key}"`);
}

export interface Resolved {
  text: string;
  /** True when Bangla was requested but English is being shown. */
  fellBack: boolean;
}

/** Look up a key. Bangla is never guessed: a missing bn key falls back to English and is logged. */
export function resolve(key: string, lang: Lang = current): Resolved {
  if (lang === 'bn') {
    const v = dict.bn[key];
    if (typeof v === 'string' && v.trim() !== '') return { text: v, fellBack: false };
    todoReview(key, 'missing bn translation for');
  }
  const en = dict.en[key];
  if (typeof en === 'string') return { text: en, fellBack: lang === 'bn' };
  todoReview(key, 'missing en string for');
  return { text: key, fellBack: lang === 'bn' };
}
