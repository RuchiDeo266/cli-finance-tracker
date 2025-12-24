import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Handlebars from "handlebars";

const fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileName);
const template_path = path.join(
  __dirname,
  "../pdf",
  "template",
  "monthly-digest-pdf.hbs"
);

let compiledTemplate: Handlebars.TemplateDelegate | null = null;

export const loadTemplate = () => {
  if (compiledTemplate) return compiledTemplate;
  const source = fs.readFileSync(template_path, "utf8");
  compiledTemplate = Handlebars.compile(source);
  return compiledTemplate;
};

/**
 * Renders data into HTML string using Handlebars.
 */
export function renderHtml(data: any): string {
  const template = loadTemplate();
  return template(data);
}

Handlebars.registerHelper("formatCurrency", (value: any) => {
  if (value === undefined || value === null || Number.isNaN(Number(value)))
    return "—";
  // convert to number and format indian separators
  const n = Math.round(Number(value));
  return n.toLocaleString("en-IN");
});

// safeJoin: joins array or returns fallback
Handlebars.registerHelper("safeJoin", (arr: any, sep = ", ") => {
  if (!Array.isArray(arr) || arr.length === 0) return "None";
  return arr.join(sep);
});

Handlebars.registerHelper("formatDate", (date: Date) => {
  return new Date(date).toLocaleDateString();
});
