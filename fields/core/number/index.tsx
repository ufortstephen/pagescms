import { z } from "zod";
import type { TFunction } from "i18next";
import i18n from "@/i18n";
import { Field } from "@/types/field";
import { EditComponent } from "./edit-component";

const schema = (field: Field, configObject?: Record<string, any>, t: TFunction = i18n.t) => {
  let zodSchema = z.coerce.number();

  if (field.options?.min !== undefined) zodSchema = zodSchema.min(field.options.min as number, { message: t('fields.number.min', { min: field.options.min }) });
  if (field.options?.max !== undefined) zodSchema = zodSchema.max(field.options.max as number, { message: t('fields.number.max', { max: field.options.max }) });

  return z.literal("").refine(() => !field.required, { message: t('fields.required') }).or(zodSchema);
};

const label = "Number";

export { label, schema, EditComponent };