import { LoaderContext } from 'webpack';
import { getHashForFile } from './utils';

export default function(this: LoaderContext<any>, source: string) {
  // Enable source map support
  this.cacheable && this.cacheable();

  const filePath = this.resourcePath;
  
  const hash = getHashForFile(filePath);
  
  const lines = source.split('\n');
  
  const newLines = lines.filter(line => !line.includes('export default'));
  newLines.push(`export const scopeClass = "scoped-${hash}";`);
  newLines.push(`export default scopeClass;`);

  return `${newLines.join('\n')}`.trim();
}