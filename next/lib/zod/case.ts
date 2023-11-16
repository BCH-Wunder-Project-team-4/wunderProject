import { DrupalNode } from "next-drupal";
import { z } from "zod";

import { MetatagsSchema } from "@/lib/zod/metatag";
import {
  AccordionSchema,
  FileAttachmentsSchema,
  FormattedTextSchema,
  HeroSchema,
  ImageSchema,
  ImageShape,
  LinksSchema,
  VideoSchema,
} from "@/lib/zod/paragraph";

const CaseElementsSchema = z.discriminatedUnion("type", [
  FormattedTextSchema,
  ImageSchema,
  VideoSchema,
  LinksSchema,
  AccordionSchema,
  HeroSchema,
  FileAttachmentsSchema,
]);


export const CaseSchema = z.object({
  type: z.literal("node--case"),
  id: z.string(),
  title: z.string(),
  field_image: ImageShape.nullable().default(null),
  field_date: z.string(),
  field_industry: z.object({
    name: z.string(),
  }),
  field_solution: z.object({
    name: z.string(),
  }),
  field_technology: z.object({
    name: z.string(),
  }),
  field_content_elements: z.array(CaseElementsSchema),
  metatag: MetatagsSchema.optional(),
});

export function validateAndCleanupCase(caseNode: DrupalNode): Case | null {
  try {
    // Validate the top level fields first.
    const topLevelCaseData = CaseSchema.omit({
      field_content_elements: true,
    }).parse(caseNode);

    // Validate the field_content_elements separately, one by one.
    // This way, if one of them is invalid, we can still return the rest of the case contents.
    const validatedParagraphs = caseNode.field_content_elements
      .map((paragraph: any) => {
        const result = CaseElementsSchema.safeParse(paragraph);

        switch (result.success) {
          case true:
            return result.data;
          case false:
            console.log(
              `Error validating case paragraph ${paragraph.type}: `,
              JSON.stringify(result.error, null, 2),
            );
            return null;
        }
      })
      .filter(Boolean);

    return {
      ...topLevelCaseData,
      field_content_elements: validatedParagraphs,
    };
  } catch (error) {
    const { name = "ZodError", issues = [] } = error;
    console.log(JSON.stringify({ name, issues, caseNode }, null, 2));
    return null;
  }
}

export type Case = z.infer<typeof CaseSchema>;