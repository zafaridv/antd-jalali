import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalaliday";
import { noteOnce } from "rc-util/lib/warning";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { GenerateConfig } from "rc-picker/lib/generate";
import { default as faLocale } from "./locale";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(weekYear);
dayjs.extend(jalaliday);

dayjs.locale(faLocale, undefined, true);

type IlocaleMapObject = { [key: string]: string };
const localeMap: IlocaleMapObject = {
  en_GB: "en-gb",
  en_US: "en",
  zh_CN: "zh-cn",
  zh_TW: "zh-tw",
  fa_IR: "fa"
};

const parseLocale = (locale: string) => {
  const mapLocale = localeMap[locale];
  return mapLocale || locale.split("_")[0];
};

const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  noteOnce(
    false,
    "Not match any format. Please help to fire a issue about this."
  );
};

const generateJalaliConfig: GenerateConfig<Dayjs> = {
  // get
  getNow: () => dayjs().calendar("jalali"),
  getWeekDay: date => date.weekday(),
  getYear: date => date.year(),
  getMonth: date => date.month(),
  getDate: date => date.date(),
  getHour: date => date.hour(),
  getMinute: date => date.minute(),
  getSecond: date => date.second(),

  // set
  addYear: (date, diff) => date.add(diff, "year"),
  addMonth: (date, diff) => date.add(diff, "month"),
  addDate: (date, diff) => date.add(diff, "day"),
  setYear: (date, year) => date.year(year),
  setMonth: (date, month) => date.month(month),
  setDate: (date, num) => date.date(num),
  setHour: (date, hour) => date.hour(hour),
  setMinute: (date, minute) => date.minute(minute),
  setSecond: (date, second) => date.second(second),

  // Compare
  isAfter: (date1, date2) => date1.isAfter(date2),
  isValidate: date => date.isValid(),

  locale: {
    getWeekFirstDay: locale =>
      dayjs()
        .locale(parseLocale(locale))
        .localeData()
        .firstDayOfWeek(),
    getWeek: (locale, date) => date.locale(parseLocale(locale)).week(),
    getShortWeekDays: locale =>
      dayjs()
        .locale(parseLocale(locale))
        .localeData()
        .weekdaysMin(),
    getShortMonths: locale =>
      dayjs()
        .locale(parseLocale(locale))
        .localeData()
        .monthsShort(),
    format: (locale, date, format) =>
      date.locale(parseLocale(locale)).format(format),
    parse: (locale, text, formats) => {
      const localeStr = parseLocale(locale);
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const formatText = text;
        if (format.includes("wo") || format.includes("Wo")) {
          // parse Wo
          const year = formatText.split("-")[0];
          const weekStr = formatText.split("-")[1];
          const firstWeek = dayjs(year, "YYYY")
            .startOf("year")
            .locale(localeStr);
          for (let j = 0; j <= 52; j += 1) {
            const nextWeek = firstWeek.add(j, "week");
            if (nextWeek.format("Wo") === weekStr) {
              return nextWeek;
            }
          }
          parseNoMatchNotice();
          return null;
        }
        const date = dayjs(formatText, format).locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }

      parseNoMatchNotice();
      return null;
    }
  }
};

export default generateJalaliConfig;