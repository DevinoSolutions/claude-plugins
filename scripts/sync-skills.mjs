#!/usr/bin/env node
// Mirrors every plugins/<plugin>/skills/<skill>/ folder into the top-level skills/<skill>/ folder,
// so `npx skills add DevinoSolutions/claude-plugins --skill <skill>` works and the repo lists on skills.sh.
// The plugin copy is the source of truth; never edit skills/ by hand.
//
//   node scripts/sync-skills.mjs          rewrite skills/ from plugins/
//   node scripts/sync-skills.mjs --check  exit 1 if skills/ has drifted or a skill breaks the rules below
//
// Rules enforced on every plugin skill (Agent Skills spec + Anthropic authoring guidance):
//   name equals the folder name, lowercase letters, digits and hyphens, at most 64 characters,
//   no "claude" or "anthropic" in it, unique across all plugins; description present and at most
//   1024 characters; SKILL.md under 500 lines.
// No dependencies: Node 18+ only.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLUGINS = path.join(ROOT, 'plugins');
const OUT = path.join(ROOT, 'skills');
const CHECK = process.argv.includes('--check');

const errors = [];

function frontmatter(text, file) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) {
    errors.push(`${file}: missing YAML frontmatter`);
    return {};
  }
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = JSON.parse(v);
    else if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
    out[kv[1]] = v;
  }
  return { fields: out, end: m[0].length };
}

function listFiles(dir, base = dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(full, base));
    else files.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return files.sort();
}

// The mirrored SKILL.md gets a one-line provenance comment after the frontmatter.
function mirrorSkillMd(text, plugin, skill) {
  const norm = text.replace(/\r\n/g, '\n');
  const { end } = frontmatter(norm, `${plugin}/${skill}`);
  const note = `<!-- Generated from plugins/${plugin}/skills/${skill}/SKILL.md by scripts/sync-skills.mjs. Edit the plugin copy, then run the script. -->\n`;
  return norm.slice(0, end) + note + norm.slice(end);
}

// Build the expected mirror: { "<skill>/<relative file>": contents }
const expected = new Map();
const owners = new Map();
for (const plugin of fs.readdirSync(PLUGINS).sort()) {
  const skillsDir = path.join(PLUGINS, plugin, 'skills');
  if (!fs.existsSync(skillsDir)) continue;
  for (const skill of fs.readdirSync(skillsDir).sort()) {
    const dir = path.join(skillsDir, skill);
    if (!fs.statSync(dir).isDirectory()) continue;
    const where = `plugins/${plugin}/skills/${skill}`;
    const mdPath = path.join(dir, 'SKILL.md');
    if (!fs.existsSync(mdPath)) {
      errors.push(`${where}: no SKILL.md`);
      continue;
    }
    const md = fs.readFileSync(mdPath, 'utf8');
    const { fields = {} } = frontmatter(md, where);
    if (fields.name !== skill) errors.push(`${where}: name "${fields.name}" must equal the folder name`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(skill) || skill.length > 64) errors.push(`${where}: name must be lowercase letters, digits and single hyphens, at most 64 characters`);
    if (/claude|anthropic/.test(skill)) errors.push(`${where}: name must not contain "claude" or "anthropic"`);
    if (!fields.description) errors.push(`${where}: description is missing`);
    else if (fields.description.length > 1024) errors.push(`${where}: description is ${fields.description.length} characters (max 1024)`);
    if (md.split('\n').length >= 500) errors.push(`${where}: SKILL.md must stay under 500 lines`);
    if (owners.has(skill)) errors.push(`${where}: skill name also used by ${owners.get(skill)}; names must be unique across plugins`);
    owners.set(skill, where);
    for (const rel of listFiles(dir)) {
      const src = fs.readFileSync(path.join(dir, rel));
      expected.set(`${skill}/${rel}`, rel === 'SKILL.md' ? Buffer.from(mirrorSkillMd(md, plugin, skill)) : src);
    }
  }
}

const actual = fs.existsSync(OUT) ? listFiles(OUT) : [];

if (CHECK) {
  for (const [rel, buf] of expected) {
    const file = path.join(OUT, rel);
    if (!fs.existsSync(file)) errors.push(`skills/${rel}: missing; run node scripts/sync-skills.mjs`);
    else if (!fs.readFileSync(file).equals(buf)) errors.push(`skills/${rel}: differs from its plugin source; run node scripts/sync-skills.mjs`);
  }
  for (const rel of actual) if (!expected.has(rel)) errors.push(`skills/${rel}: has no plugin source; run node scripts/sync-skills.mjs`);
  if (errors.length) {
    console.error(errors.join('\n'));
    console.error(`\nsync-skills --check failed with ${errors.length} problem(s).`);
    process.exit(1);
  }
  console.log(`sync-skills --check passed: ${owners.size} skills mirrored, no drift.`);
} else {
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  for (const [rel, buf] of expected) {
    const file = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buf);
  }
  console.log(`Mirrored ${owners.size} skills into skills/.`);
}
