import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";
import sanitize from "sanitize-html";

yup.addMethod<yup.StringSchema>(yup.string, "sanitizeHtml", function () {
  return this.transform((value: string) =>
    sanitize(value, {
      disallowedTagsMode: "discard",
      allowedTags: sanitize.defaults.allowedTags.concat(["font", "strike"]),
      allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        font: ["size"],
        div: ["align"],
      },
    })
  );
});

declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    sanitizeHtml(): StringSchema<TType, TContext>;
  }
}

export default yup;
