import React, { useSyncExternalStore } from 'react';
import { getLang, setLang, subscribe, resolve } from './core';
import type { Lang } from './core';

export { getLang, setLang, resolve };
export type { Lang };

export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(subscribe, getLang, () => 'en' as Lang);
  return [lang, setLang];
}

/** Returns t(key) -> string. English fallback text is plain here; use <T> where a visible marker is needed. */
export function useT(): (key: string) => string {
  const lang = useSyncExternalStore(subscribe, getLang, () => 'en' as Lang);
  return (key: string) => resolve(key, lang).text;
}

/**
 * Renders a string. When Bangla is selected but this key has no reviewed Bangla text,
 * the English text is shown with a dotted underline, lang="en", and a tooltip.
 */
export const T: React.FC<{ k: string }> = ({ k }) => {
  const lang = useSyncExternalStore(subscribe, getLang, () => 'en' as Lang);
  const { text, fellBack } = resolve(k, lang);
  if (!fellBack) return <>{text}</>;
  return (
    <span lang="en" className="sb-i18n-fallback" title="English shown: Bangla translation pending review">
      {text}
    </span>
  );
};