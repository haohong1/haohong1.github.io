# Digital literacy research showcase

A public-facing exploration of Haohong Lai’s doctoral research on digital literacy from a translation perspective, with insights from language teaching.

Website: https://haohong1.github.io/literacidad-digital/

This is a **working version for discussion**, based on the research snapshot of 26 October 2026. Framework organization, wording and translated labels remain open to review. The publications section is intentionally empty.

## Languages and content

Spanish is the default language. English and Chinese share the same records and identifiers. The site includes three opening questions, concept exploration, a task directory, a searchable framework, contextual development relations, and an explanation of the research process. Spanish analysis wording is retained for comparison with translated CHA labels.

The concept section is an embedded, paginated book with six chapter bookmarks: literacy, its four dimensions, competence, the relation between literacy and competence, digital literacy, and the bridge model. The complete reading is adapted from thesis section 2.1, including its theoretical distinctions, tables, models and footnotes. The two models are interactive HTML/SVG representations, not screenshots of the thesis. Citations show full reference information on hover or keyboard focus, link to the reference list at the end, and provide a return to the exact reading position. The book follows Chicago 18 author-date conventions with a user-requested colon before pinpoint pages. The book contains 28 third-party references. Eight source citations attached to the five literacy concepts were checked against the thesis and original publications, including their pinpoint pages. The working thesis is not cited as a source. The task directory is the default framework entry point: choose one of 44 tasks to see its competency combination, then open a competency to inspect only the CHA linked to that task. Counts on each competency card use task-specific realization records; the total CHA count deduplicates shared items. Task stages are shown at task level.

Language links use `?lang=es`, `?lang=en` or `?lang=zh`. A CHA record can be opened directly with, for example, `?lang=en&cha=CI0149`. A task can be opened with `?lang=zh&task=T25#framework`. The book opens at `?lang=zh#concepts`; a chapter can be opened with its stable anchor, for example `?lang=zh#literacy-dimensions`.

## Data and interpretation

- **34 interview texts**: 22 authorized LT-LiDER texts and 12 collected by the researcher. The corpus includes a joint interview and a written response; 34 is not a count of participants.
- **Analysis-text languages**: 22 English, 8 Chinese and 4 Spanish. This distribution includes original texts and translations and does not identify participants’ nationality or all original interview languages.
- Professional-background counts are **overlapping labels on interview records**: language services 11, professional translation 8, translation teaching 16 and language teaching 8.
- **44 tasks; 535 integrated CHA**: 226 knowledge, 249 skill and 60 attitude statements.
- **31 development relations**: 20 between knowledge statements, 6 between skills and 5 between attitudes. Every relation retains a task and stage. These are analytical relations, not observed individual learning sequences or universal proficiency levels.
- **15 competencies and 615 nonexclusive memberships**. A CHA can contribute to several competencies, and a task can call upon only some of a competency’s members.
- The methods section distinguishes **809 unique source CHA** from **843 source/ task/ context records**. Counts describe the corpus and analysis; they do not measure importance or support statistical generalization.

The country view is withheld: four participants could not be reliably assigned to a work or institution country at the time of interview. The roster audit confirms 34 interview texts and 35 participants, including one two-person interview. The public site does not publish participant identities or an incomplete country distribution.

The public data contain research labels, identifiers, task and stage mappings, competency memberships, development relations and aggregate sample information. They do not include participant names, interview transcripts, raw quotations, the original workbook or the thesis manuscript.

## Files

- `index.html`: page structure and metadata.
- `styles.css`: responsive layout, typography and motion settings.
- `content.js`: Spanish, English and Chinese interface and explanatory text.
- `task-content.js`: trilingual task-directory interface text.
- `data.js`: public research snapshot and translated record labels.
- `app.js`: language switching, filtering, relationship views and detail dialogs.
- `concept-story.js`: the complete trilingual book and its bibliography.
- `concept-book.js` / `concept-book.css`: pagination, paper-turn animation, bookmarks, citations and reading-position return.
- `concept-models.js` / `concept-models.css`: accessible interactive models of the four dimensions and the two-way, asymmetric bridges. The bridge model is explicitly framed from translation studies. Its two-sided layout connects digital literacy for translation with five literacy concepts discussed in the reviewed literature and leaves room for new concepts to emerge; animated paired paths show recontextualisation and reflective feedback. Direction controls, pause, reduced-motion support and responsive connections accompany the domain explorer. Domain, direction and manual pause choices survive book reflow and language changes.
- `research-interaction.css`: connected task/competency nodes and the interactive research path.
- `favicon.svg`: site icon.

## Local use and deployment

This is a static HTML, CSS and JavaScript site with no build step, package installation, database or server API. Open `index.html` directly, or run a local static server from this directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173/`. JavaScript enables the framework explorer and language switching. The font stack is shared across all languages: Latin characters and numbers use Times New Roman (with local serif fallbacks), while Chinese glyphs use available Song-style system fonts. No external webfont is loaded.

Deploy this directory as `literacidad-digital/` within the `haohong1.github.io` GitHub Pages repository. All site asset paths are relative to that directory.

## Thesis identity

- **ES**: Construcción de un marco de literacidad digital para la traducción y la enseñanza de lenguas: un estudio cualitativo basado en entrevistas a expertos

- **EN**: Towards a digital literacy framework for translation and language teaching: A qualitative study based on expert interviews

- **ZH**: 面向翻译与语言教学的数字素养框架构建：基于专家访谈的质性研究

Author ORCID: https://orcid.org/0009-0009-6157-6242

The Chinese interface identifies the author as 赖豪鸿; English and Spanish use Haohong Lai. The LT-LiDER source label links to the Spanish project homepage in Spanish, and to the English homepage in English or Chinese.


## Corpus length

The research section shows counts for the 34 analysis texts: 134,863 non-Han word/number tokens and 50,905 Han characters, reported separately. Counts include interviewer questions and participant answers, excluding turn-position markers, speaker labels and a transcription editing marker. The word total includes 753 tokens within Chinese texts.

The corpus-size panel displays one selectable bar per text, grouped by predominant analysis language: 22 English, 8 Chinese and 4 Spanish texts. It provides each group's total, median and range, with a common word-count scale for English and Spanish and a separate character-count scale for Chinese. Anonymous text IDs and the written-response marker are shown with lengths; transcripts, names and source paths are not published. Text length is not converted into recording duration. Open the panel directly with `?lang=zh&sample=volume#research`.

- `corpus-volume-data.js`: anonymous counts, independently recomputed from all 34 source texts.
- `corpus-volume.js` / `corpus-volume.css`: trilingual summary, interactive distributions and counting explanation.
