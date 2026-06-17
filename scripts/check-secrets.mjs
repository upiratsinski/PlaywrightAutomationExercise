import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ignoredDirectories = new Set(['.git', 'node_modules', 'playwright-report', 'test-results', '.pw-tmp']);
const ignoredFiles = new Set(['.env', 'package-lock.json', 'check-secrets.mjs']);
const allowedFiles = new Set(['.env.example']);
const searchedExtensions = new Set(['.ts', '.js', '.mjs', '.json', '.md', '.yml', '.yaml']);
const blockedValues = ['PlaywrightTest1234', 'Password123', 'wrong-password', '4111111111111111'];

function getExtension(filePath) {
  const lastDotIndex = filePath.lastIndexOf('.');

  return lastDotIndex === -1 ? '' : filePath.slice(lastDotIndex);
}

function collectFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const entryPath = join(directory, entry);
    const entryStat = statSync(entryPath);

    if (entryStat.isDirectory()) {
      return ignoredDirectories.has(entry) ? [] : collectFiles(entryPath);
    }

    if (ignoredFiles.has(entry) || allowedFiles.has(entry)) {
      return [];
    }

    return searchedExtensions.has(getExtension(entryPath)) ? [entryPath] : [];
  });
}

const findings = collectFiles(process.cwd()).flatMap((filePath) => {
  const content = readFileSync(filePath, 'utf8');

  return blockedValues.filter((value) => content.includes(value)).map((value) => `${filePath}: contains ${value}`);
});

if (findings.length > 0) {
  console.error('Potential hardcoded secrets found:');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('No blocked hardcoded secret values found.');
