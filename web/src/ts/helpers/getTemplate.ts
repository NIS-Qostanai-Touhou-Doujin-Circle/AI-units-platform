export default function getTemplate(templateId: string): DocumentFragment {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if (!template) {
        throw new Error(`Template with ID '${templateId}' not found.`);
    }
    return template.content;
}
