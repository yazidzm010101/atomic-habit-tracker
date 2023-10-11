import locale from "@/configs/locale";
import { usePreferences } from "./usePreferences";

export function getLocalizedString(key) {
  const {
    preferences: { locale: localeSetting },
  } = usePreferences();
  const localizedStrings = locale[localeSetting] || {};
  return localizedStrings[key] || "";
}
