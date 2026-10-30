# Digital literacy research showcase

A public exploration of Haohong Lai’s doctoral research on digital literacy from a translation perspective, with contributions from language teaching.

Website: https://haohong1.github.io/literacidad-digital/

## Reading and exploring

Spanish, English and Chinese use the same research records. The site opens the framework through a task directory. Selecting a task shows its definition, the interview excerpts that support it, its contexts and its competency combination. Opening a competency from that task shows the CHA associated with that particular combination.

Task labels throughout the explorer open a definition and interview excerpts. CHA cards, lists and development-graph nodes open a shared detail view. When a CHA is opened within a task, competency or development context, its excerpts come from that context. The global CHA view brings together all its linked excerpts. Readers can expand the interview section and then open all remaining excerpts. Each excerpt retains the original wording and appears in double quotes.

Research identifiers remain in the data and direct links. The visible task and CHA views use names, definitions and interview wording. Development views show the connected CHA within their task and stage.

Language links use `?lang=es`, `?lang=en` or `?lang=zh`. A CHA can be opened with `?lang=en&cha=CI0149`; a task with `?lang=zh&task=T18&taskv=20261030#framework`. Combining CHA and task parameters, including `taskv`, opens the CHA with its task-specific evidence.

## Research data

The public snapshot is generated from the revised local analysis workbook. Its source links connect tasks and integrated CHA to original interview excerpts. Counts in the framework and methods views are calculated from the loaded data, so they follow the same snapshot as the displayed records.

The corpus contains 34 interview texts: 22 authorised LT-LiDER texts and 12 collected by the researcher. It includes a joint interview and a written response, with 35 participants in total. The analysis texts comprise 22 English, 8 Chinese and 4 Spanish texts, including originals and translations. Professional-background labels can overlap: language services 11, professional translation 8, translation teaching 16 and language teaching 8.

The analysis organises tasks by purpose. It distinguishes the generation and composition of translations, the revision of existing content, and the assessment of product quality. Shared CHA can contribute to several competencies. Development relationships are interpretations proposed within specific task and stage contexts.

### Evidence contract

- `tasks` contains multilingual names, a multilingual `definition` and `evidence` indices.
- `quotes` contains the original excerpt strings.
- `evidenceContexts` links each CHA, task and stage to excerpt indices.
- `competencyEvidence` adds the competency context to those links.
- `contexts`, `competencyContexts` and `edgeContexts` organise the corresponding views.
- `edges` contains the identifiers of each relationship and its two CHA endpoints.
- Active tasks use consecutive identifiers `T01`–`T33`. `taskIdVersion` identifies this scheme, `legacyTaskIds` preserves the fixed earlier-to-current mapping, and `defaultTask` selects the initial directory task.

New task links include `taskv=20261030`. Earlier links without `taskv` resolve through `legacyTaskIds` and are normalised to the current URL. For example, the earlier `?task=T29` opens translation generation at `?task=T22&taskv=20261030`; `?task=T29&taskv=20261030` opens teaching-material creation. The same resolution applies to links containing both `cha` and `task`. Generated task links carry the version marker so copied links preserve their meaning.

The interface escapes excerpts as text and preserves their complete wording. Equal excerpt strings are displayed once within a view. A context-specific view uses the source links for that context.

## Concept book and corpus view

The concept section is a paginated book adapted from thesis section 2.1. Six chapter bookmarks cover literacy, its four dimensions, competence, the relationship between literacy and competence, digital literacy, and the bridge model. Its interactive HTML/SVG models, bibliography, citation links and reading-position return form part of the book. Citations follow Chicago 18 author-date conventions with a colon before pinpoint pages.

Open the book at `?lang=zh#concepts`, or a chapter at a stable anchor such as `?lang=zh#literacy-dimensions`.

The corpus-size panel reports 134,863 non-Han word/number tokens and 50,905 Han characters separately across the 34 analysis texts. The word total includes 753 tokens within Chinese texts. Counts include interviewer questions and participant answers; the counting procedure removes turn markers, speaker labels and the transcription editing marker. Bars are grouped by analysis language and show each group's total, median and range. Open this panel at `?lang=zh&sample=volume#research`.

## Files

- `index.html`: page structure and metadata.
- `styles.css`: responsive layout, typography and motion settings.
- `content.js`: interface and explanatory text in three languages.
- `task-content.js`: task-directory and interview-excerpt interface text.
- `data.js`: generated research snapshot, translated labels, definitions and excerpt links.
- `app.js`: language switching, filtering, relationship views and detail dialogs.
- `concept-story.js`: the concept book and bibliography.
- `concept-book.js` / `concept-book.css`: pagination, bookmarks, citations and reading position.
- `concept-models.js` / `concept-models.css`: interactive conceptual models.
- `research-interaction.css`: task/competency connections and the research path.
- `corpus-volume-data.js`: anonymous text counts recomputed from the source corpus.
- `corpus-volume.js` / `corpus-volume.css`: corpus distributions and counting explanation.

## Updating the site

1. Revise and validate the local analysis workbook, including its source, task, integration and competency links.
2. Generate `data.js` from that validated snapshot and supply all three task names and definitions. Preserve `taskIdVersion`, `legacyTaskIds` and `defaultTask` when regenerating the data.
3. Check that every excerpt index resolves and each scoped evidence link matches its task, stage and competency. Review changes to task definitions and CHA wording in all three languages.
4. Preview the task directory, task-to-competency path, CHA list and development graph. Expand their excerpts, check the exact original wording, and test language switching, keyboard use and a narrow screen.
5. Update the asset version references and publish the verified directory.

## Local preview and deployment

This is a static HTML, CSS and JavaScript site. Start a local server in this directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4173/`. JavaScript enables the explorer and language switching. Latin characters and numbers use Times New Roman with local serif fallbacks; Chinese uses available Song-style fonts.

Deploy this directory as `literacidad-digital/` in the `haohong1.github.io` GitHub Pages repository. Asset paths are relative to the directory.

## Thesis identity

- **ES**: Construcción de un marco de literacidad digital para la traducción y la enseñanza de lenguas: un estudio cualitativo basado en entrevistas a expertos
- **EN**: Towards a digital literacy framework for translation and language teaching: A qualitative study based on expert interviews
- **ZH**: 面向翻译与语言教学的数字素养框架构建：基于专家访谈的质性研究

Author: Haohong Lai / 赖豪鸿. ORCID: https://orcid.org/0009-0009-6157-6242
