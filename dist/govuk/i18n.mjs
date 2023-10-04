class I18n {
  constructor(translations, config) {
    this.translations = void 0;
    this.locale = void 0;
    this.translations = translations || {};
    this.locale = config && config.locale || document.documentElement.lang || 'en';
  }
  t(lookupKey, options) {
    if (!lookupKey) {
      throw new Error('i18n: lookup key missing');
    }
    if (options && typeof options.count === 'number') {
      lookupKey = `${lookupKey}.${this.getPluralSuffix(lookupKey, options.count)}`;
    }
    const translationString = this.translations[lookupKey];
    if (typeof translationString === 'string') {
      if (translationString.match(/%{(.\S+)}/)) {
        if (!options) {
          throw new Error('i18n: cannot replace placeholders in string if no option data provided');
        }
        return this.replacePlaceholders(translationString, options);
      } else {
        return translationString;
      }
    } else {
      return lookupKey;
    }
  }
  replacePlaceholders(translationString, options) {
    let formatter;
    if (this.hasIntlNumberFormatSupport()) {
      formatter = new Intl.NumberFormat(this.locale);
    }
    return translationString.replace(/%{(.\S+)}/g, function (placeholderWithBraces, placeholderKey) {
      if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
        const placeholderValue = options[placeholderKey];
        if (placeholderValue === false || typeof placeholderValue !== 'number' && typeof placeholderValue !== 'string') {
          return '';
        }
        if (typeof placeholderValue === 'number') {
          return formatter ? formatter.format(placeholderValue) : `${placeholderValue}`;
        }
        return placeholderValue;
      } else {
        throw new Error(`i18n: no data found to replace ${placeholderWithBraces} placeholder in string`);
      }
    });
  }
  hasIntlPluralRulesSupport() {
    return Boolean(window.Intl && 'PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length);
  }
  hasIntlNumberFormatSupport() {
    return Boolean(window.Intl && 'NumberFormat' in window.Intl && Intl.NumberFormat.supportedLocalesOf(this.locale).length);
  }
  getPluralSuffix(lookupKey, count) {
    count = Number(count);
    if (!isFinite(count)) {
      return 'other';
    }
    let preferredForm;
    if (this.hasIntlPluralRulesSupport()) {
      preferredForm = new Intl.PluralRules(this.locale).select(count);
    } else {
      preferredForm = this.selectPluralFormUsingFallbackRules(count);
    }
    if (`${lookupKey}.${preferredForm}` in this.translations) {
      return preferredForm;
    } else if (`${lookupKey}.other` in this.translations) {
      if (console && 'warn' in console) {
        console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
      }
      return 'other';
    } else {
      throw new Error(`i18n: Plural form ".other" is required for "${this.locale}" locale`);
    }
  }
  selectPluralFormUsingFallbackRules(count) {
    count = Math.abs(Math.floor(count));
    const ruleset = this.getPluralRulesForLocale();
    if (ruleset) {
      return I18n.pluralRules[ruleset](count);
    }
    return 'other';
  }
  getPluralRulesForLocale() {
    const locale = this.locale;
    const localeShort = locale.split('-')[0];
    for (const pluralRule in I18n.pluralRulesMap) {
      if (Object.prototype.hasOwnProperty.call(I18n.pluralRulesMap, pluralRule)) {
        const languages = I18n.pluralRulesMap[pluralRule];
        for (let i = 0; i < languages.length; i++) {
          if (languages[i] === locale || languages[i] === localeShort) {
            return pluralRule;
          }
        }
      }
    }
  }
}
I18n.pluralRulesMap = {
  arabic: ['ar'],
  chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
  french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
  german: ['af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka', 'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'],
  irish: ['ga'],
  russian: ['ru', 'uk'],
  scottish: ['gd'],
  spanish: ['pt-PT', 'it', 'es'],
  welsh: ['cy']
};
I18n.pluralRules = {
  arabic(n) {
    if (n === 0) {
      return 'zero';
    }
    if (n === 1) {
      return 'one';
    }
    if (n === 2) {
      return 'two';
    }
    if (n % 100 >= 3 && n % 100 <= 10) {
      return 'few';
    }
    if (n % 100 >= 11 && n % 100 <= 99) {
      return 'many';
    }
    return 'other';
  },
  chinese() {
    return 'other';
  },
  french(n) {
    return n === 0 || n === 1 ? 'one' : 'other';
  },
  german(n) {
    return n === 1 ? 'one' : 'other';
  },
  irish(n) {
    if (n === 1) {
      return 'one';
    }
    if (n === 2) {
      return 'two';
    }
    if (n >= 3 && n <= 6) {
      return 'few';
    }
    if (n >= 7 && n <= 10) {
      return 'many';
    }
    return 'other';
  },
  russian(n) {
    const lastTwo = n % 100;
    const last = lastTwo % 10;
    if (last === 1 && lastTwo !== 11) {
      return 'one';
    }
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
      return 'few';
    }
    if (last === 0 || last >= 5 && last <= 9 || lastTwo >= 11 && lastTwo <= 14) {
      return 'many';
    }
    return 'other';
  },
  scottish(n) {
    if (n === 1 || n === 11) {
      return 'one';
    }
    if (n === 2 || n === 12) {
      return 'two';
    }
    if (n >= 3 && n <= 10 || n >= 13 && n <= 19) {
      return 'few';
    }
    return 'other';
  },
  spanish(n) {
    if (n === 1) {
      return 'one';
    }
    if (n % 1000000 === 0 && n !== 0) {
      return 'many';
    }
    return 'other';
  },
  welsh(n) {
    if (n === 0) {
      return 'zero';
    }
    if (n === 1) {
      return 'one';
    }
    if (n === 2) {
      return 'two';
    }
    if (n === 3) {
      return 'few';
    }
    if (n === 6) {
      return 'many';
    }
    return 'other';
  }
};

export { I18n };
//# sourceMappingURL=i18n.mjs.map
