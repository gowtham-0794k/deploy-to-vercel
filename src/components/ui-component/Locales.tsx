"use client";

import React, { useState, useEffect } from "react";

// third-party
import { IntlProvider, MessageFormatElement } from "react-intl";

// project import
import useConfig from "hooks/useConfig";

// types
import { I18n } from "types/config";

// load locales files
const loadLocaleData = (i18n: I18n) => {
  switch (i18n) {
    case "fr":
      return import("../../utils/locales/fr.json");
    case "hi":
      return import("../../utils/locales/hi.json");
    case "kn":
      return import("../../utils/locales/kn.json");
    case "te":
      return import("../../utils/locales/te.json");
    default:
      return import("../../utils/locales/en.json");
  }
};

// ==============================|| LOCALIZATION ||============================== //
interface LocalsProps {
  children: React.ReactNode;
}

const Locales = ({ children }: LocalsProps) => {
  const { i18n } = useConfig();
  const [messages, setMessages] = useState<
    Record<string, string> | Record<string, MessageFormatElement[]> | undefined
  >();

  useEffect(() => {
    loadLocaleData(i18n).then(
      (d: {
        default:
          | Record<string, string>
          | Record<string, MessageFormatElement[]>
          | undefined;
      }) => {
        setMessages(d.default);
      }
    );
  }, [i18n]);

  return (
    <>
      {messages && (
        <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
};

export default Locales;
