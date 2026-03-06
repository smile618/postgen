import type { TemplateName } from '../types.js';
import type { TemplateDefinition } from './types.js';
import { cover01Template } from './cover-01.js';
import { xhsNoteTemplate } from './xhs-note.js';
import { xhsNoteGreenTemplate } from './xhs-note-green.js';
import { xhsQuoteBlueTemplate } from './xhs-quote-blue.js';

export const templateList = [cover01Template, xhsNoteTemplate, xhsNoteGreenTemplate, xhsQuoteBlueTemplate] as const;

export const templateRegistry: Record<TemplateName, TemplateDefinition> = Object.fromEntries(
  templateList.map((item) => [item.name, item])
) as Record<TemplateName, TemplateDefinition>;

export function getTemplate(name: TemplateName) {
  return templateRegistry[name];
}
