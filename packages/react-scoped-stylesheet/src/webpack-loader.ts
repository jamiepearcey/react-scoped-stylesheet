import { LoaderContext } from 'webpack';
import { getHashForFile } from './utils';

export default function(this: LoaderContext<any>, source: string) {
  const filePath = this.resourcePath;
  const hash = getHashForFile(filePath);

  return `
${source};
export const scopeClass = "scoped-${hash}";
  `.trim();
}