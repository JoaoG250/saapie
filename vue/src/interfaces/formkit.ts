export type FormKitCheckboxValue = string[] | boolean;
export type FormKitDateValue = string;
export type FormKitDateTimeValue = string;
export type FormKitEmailValue = string;
export type FormKitFileValue = { name: string; file?: File }[];
export type FormKitMonthValue = string;
export type FormKitNumberValue = number;
export type FormKitPasswordValue = string;
export type FormKitRadioValue = string;
export type FormKitRangeValue = number;
export type FormKitSearchValue = string;
export type FormKitSelectValue = string | string[];
export type FormKitTelephoneValue = string;
export type FormKitTextValue = string;
export type FormKitTextareaValue = string;
export type FormKitTimeValue = string;
export type FormKitUrlValue = string;
export type FormKitWeekValue = string;

export type FormKitValue =
  | string
  | number
  | boolean
  | string[]
  | { name: string; file?: File }[];

export interface FormKitData {
  [key: string]: FormKitValue;
}
