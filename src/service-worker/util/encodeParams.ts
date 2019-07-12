export default function encodeParams(
  template: TemplateStringsArray,
  ...expressions: string[]
) {
  return template.reduce((accumulator, part, i) => {
    return accumulator + encodeURIComponent(expressions[i - 1]) + part;
  });
}
