import en from "./messages.en.js";
import fr from "./messages.fr.js";
import de from "./messages.de.js";
import es from "./messages.es.js";
import pl from "./messages.pl.js";

export type SupportedLanguage = "en" | "fr" | "de" | "es" | "pl";

export type MessagesIn = typeof en.en_in;
export type MessagesOut = typeof en.en_out;
export type MessagesServer = typeof en.en_server;
export type MessagesInternal = typeof en.en_internal;

export const messagesIn: Record<SupportedLanguage, MessagesIn> = {
  en: en.en_in,
  fr: fr.fr_in,
  de: de.de_in,
  es: es.es_in,
  pl: pl.pl_in,
};

export const messagesOut: Record<SupportedLanguage, MessagesOut> = {
  en: en.en_out,
  fr: fr.fr_out,
  de: de.de_out,
  es: es.es_out,
  pl: pl.pl_out,
};

export const messagesServer: Record<SupportedLanguage, MessagesServer> = {
  en: en.en_server,
  fr: fr.fr_server,
  de: de.de_server,
  es: es.es_server,
  pl: pl.pl_server,
};

export const messagesInternal: Record<SupportedLanguage, MessagesInternal> = {
  en: en.en_internal,
  fr: fr.fr_internal,
  de: de.de_internal,
  es: es.es_internal,
  pl: pl.pl_internal,
};

export function getUserLanguage(locale?: string): SupportedLanguage {
  if (!locale) return "en";

  if (locale.startsWith("fr")) return "fr";
  if (locale.startsWith("de")) return "de";
  if (locale.startsWith("es")) return "es";
  if (locale.startsWith("pl")) return "pl";

  return "en";
}

export function getMessagesUser(interaction: { locale?: string }): MessagesIn {
  const lang = getUserLanguage(interaction.locale);
  return messagesIn[lang];
}

export function getMessagesOut(locale?: string): MessagesOut {
  const lang = getUserLanguage(locale);
  return messagesOut[lang];
}

export function getMessagesServer(locale?: string): MessagesServer {
  const lang = getUserLanguage(locale);
  return messagesServer[lang];
}

export function getMessagesInternal(locale?: string): MessagesInternal {
  const lang = getUserLanguage(locale);
  return messagesInternal[lang];
}