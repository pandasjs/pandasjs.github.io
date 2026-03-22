// SSR script — generates standalone manual.html from YAML sections + template
// usage: node docs/manual-ssr.js
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { renderSidebar, renderContent } from './manual-render.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sectionsDir = join(__dirname, 'sections')

// read all yaml files in order
const files = readdirSync(sectionsDir).filter(f => f.endsWith('.yaml')).sort()
const sections = files.map(f => yaml.load(readFileSync(join(sectionsDir, f), 'utf8')))

const sidebarHtml = renderSidebar(sections)
const contentHtml = renderContent(sections)

const output = `<!DOCTYPE html>
<html lang="en">

<head>
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t<title>PandasJS Manual</title>
\t<link rel="stylesheet" href="style.css">
</head>

<body>

\t<nav>
\t\t<a href="index.html" class="logo"><img src="logo.svg" alt="pandasjs" class="logo-icon">pandas<span>js</span></a>
\t\t<div class="links">
\t\t\t<a href="index.html">Home</a>
\t\t\t<a href="https://github.com/pandasjs/pandasjs">GitHub</a>
\t\t\t<a href="https://www.npmjs.com/package/@rockiey/pandasjs">npm</a>
\t\t</div>
\t</nav>

\t<div class="manual-layout">
\t\t<div class="sidebar">
${sidebarHtml}
\t\t</div>
\t\t<div class="sidebar-placeholder"></div>
\t\t<div class="manual-content">
${contentHtml}
\t\t</div>
\t</div>

\t<script src="/dist/pandasjs.min.js"></script>
\t<script src="manual.js"></script>

</body>

</html>
`

const outPath = join(__dirname, 'manual.html')
writeFileSync(outPath, output)
console.log('wrote', outPath)
