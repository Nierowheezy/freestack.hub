#!/usr/bin/env node
/**
 * Script to automatically update CHANGELOG.md
 * Based on package.json version and conventional commits format
 */

const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve('package.json');
const changelogPath = path.resolve('CHANGELOG.md');

if (!fs.existsSync(pkgPath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

if (!fs.existsSync(changelogPath)) {
  console.error('❌ CHANGELOG.md not found');
  process.exit(1);
}

// Read package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Read current CHANGELOG
let changelog = fs.readFileSync(changelogPath, 'utf-8');

// Extract current version
const versionMatch = pkg.version || '0.0.0';
const versionParts = versionMatch.split('.').map(Number);

// Determine current section header
const currentDate = new Date().toISOString().split('T')[0];
const newSection = `## [${versionMatch}] - ${currentDate}`;

// Check if version already has a section
const versionSectionRegex = new RegExp(`## \\[${versionMatch}\\]`, 'm');
if (versionSectionRegex.test(changelog)) {
  console.log(`✅ Version ${versionMatch} already has a CHANGELOG section`);
  process.exit(0);
}

// Prepend new version section (keep existing content)
const updatedChangelog = `${newSection}\n\n### Added\n- ...\n\n### Changed\n- ...\n\n### Deprecated\n- ...\n\n### Removed\n- ...\n\n### Fixed\n- ...\n\n---\n\n${changelog}`;

fs.writeFileSync(changelogPath, updatedChangelog);
console.log(`✅ CHANGELOG.md updated with version ${versionMatch}`);
process.exit(0);