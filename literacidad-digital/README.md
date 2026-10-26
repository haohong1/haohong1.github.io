# Digital literacy research showcase

A public-facing exploration of Haohong Lai’s doctoral research on digital literacy from a translation perspective, with insights from language teaching.

Website: https://haohong1.github.io/literacidad-digital/

This is a **working version for discussion**, based on the research snapshot of 26 October 2026. Framework organization, wording and translated labels remain open to review. The publications section is intentionally empty.

## Languages and content

Spanish is the default language. English and Chinese share the same records and identifiers. The site includes three opening questions, concept exploration, a searchable framework with task filters, contextual development relations, and an explanation of the research process. Spanish analysis wording is retained for comparison with translated CHA labels.

Language links use `?lang=es`, `?lang=en` or `?lang=zh`. A CHA record can be opened directly with, for example, `?lang=en&cha=CI0149`.

## Data and interpretation

- **34 interview texts**: 22 authorized LT-LiDER texts and 12 collected by the researcher. The corpus includes a joint interview and a written response; 34 is not a count of participants.
- **Analysis-text languages**: 22 English, 8 Chinese and 4 Spanish. This distribution includes original texts and translations and does not identify participants’ nationality or all original interview languages.
- Professional-background counts are **overlapping labels on interview records**: language services 11, professional translation 8, translation teaching 16 and language teaching 8.
- **44 tasks; 535 integrated CHA**: 226 knowledge, 249 skill and 60 attitude statements.
- **31 development relations**: 20 between knowledge statements, 6 between skills and 5 between attitudes. Every relation retains a task and stage. These are analytical relations, not observed individual learning sequences or universal proficiency levels.
- **15 competencies and 615 nonexclusive memberships**. A CHA can contribute to several competencies, and a task can call upon only some of a competency’s members.
- The methods section distinguishes **809 unique source CHA** from **843 source/ task/ context records**. Counts describe the corpus and analysis; they do not measure importance or support statistical generalization.

Country distribution is deferred until the relevant information and geographical counting rule are confirmed.

The public data contain research labels, identifiers, task and stage mappings, competency memberships, development relations and aggregate sample information. They do not include participant names, interview transcripts, raw quotations, the original workbook or the thesis manuscript.

## Files

- `index.html`: page structure and metadata.
- `styles.css`: responsive layout, typography and motion settings.
- `content.js`: Spanish, English and Chinese interface and explanatory text.
- `data.js`: public research snapshot and translated record labels.
- `app.js`: language switching, filtering, relationship views and detail dialogs.
- `favicon.svg`: site icon.

## Local use and deployment

This is a static HTML, CSS and JavaScript site with no build step, package installation, database or server API. Open `index.html` directly, or run a local static server from this directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173/`. JavaScript enables the framework explorer and language switching. Newsreader is requested from Google Fonts; local serif fallbacks remain available when it cannot load. Chinese text uses available Song-style system fonts.

Deploy this directory as `literacidad-digital/` within the `haohong1.github.io` GitHub Pages repository. All site asset paths are relative to that directory.
