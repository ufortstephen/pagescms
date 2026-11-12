import { z } from "zod";
import type { TFunction } from "i18next";
import i18n from "@/i18n";
import { Field } from "@/types/field";
import { EditComponent } from "./edit-component";

const defaultValue = (): string => {
  return crypto.randomUUID();
};

const schema = (field: Field, configObject?: Record<string, any>, t: TFunction = i18n.t) => {
  let zodSchema: z.ZodTypeAny = z.string().uuid(t('fields.uuid.invalid'));

  if (!field.required) zodSchema = zodSchema.optional().nullable();

  return zodSchema;
};

const label = "UUID";

export { label, EditComponent, defaultValue, schema };