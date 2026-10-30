(() => {
 'use strict';
 const D = window.RESEARCH_DATA, C = window.COPY;
 if (!D || !C) return;
 const $ = (s, root=document) => root.querySelector(s);
 const $$ = (s, root=document) => [...root.querySelectorAll(s)];
 const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const unique = arr => [...new Set(arr)];
 const chaById = new Map(D.cha.map(x=>[x.id,x])), capById = new Map(D.competencies.map(x=>[x.id,x])), taskById = new Map(D.tasks.map(x=>[x.id,x]));
 const params = new URLSearchParams(location.search);
 const taskIdVersion=D.taskIdVersion;
 const requestedTask=params.get('task'),requestedVersion=params.get('taskv');
 const resolvedTask=requestedVersion===taskIdVersion?requestedTask:!requestedVersion?D.legacyTaskIds?.[requestedTask]:null;
 const linkedTask=taskById.has(resolvedTask)?resolvedTask:'';
 if(linkedTask){
  params.set('task',linkedTask);params.set('taskv',taskIdVersion);
  try{const url=new URL(location.href);url.search=params.toString();history.replaceState(null,'',url);}catch{}
 }
 const state = {lang:['es','en','zh'].includes(params.get('lang'))?params.get('lang'):'es', concept:0,lens:0,primer:'C',view:'tasks',query:'',taskQuery:'',selectedTask:linkedTask||(taskById.has(D.defaultTask)?D.defaultTask:D.tasks[0].id),task:'',type:'',capFilter:'',selectedCap:D.competencies.find(x=>x.number===9).id,selectedEdge:'C-R010',page:1,chart:['origin','profiles','languages','volume'].includes(params.get('sample'))?params.get('sample'):'origin',method:0,dialog:null};
 const t = key => C[state.lang][key];
 const label = x => x?.[state.lang] || x?.es || '';
 const marker = type => `<i class="type-marker ${esc(type)}" aria-label="${esc(t({C:'knowledge',H:'skills',A:'attitudes'}[type]))}">${esc(type)}</i>`;
 const taskIdsForCha = id => unique(D.contexts.filter(x=>x.cha===id).map(x=>x.task));
 const taskIdsForCap = id => unique(D.competencyTasks.filter(x=>x.competency===id).map(x=>x.task));
 const memberIds = id => new Set(D.members.filter(x=>x.competency===id).map(x=>x.cha));
 const stageLabel = value => {
  const key=Object.keys(t('stages')).find(k=>norm(k)===norm(value));
  return key?t('stages')[key]:value;
 };
 const taskURL=id=>{
  const url=new URL(location.href);url.search='';url.searchParams.set('lang',state.lang);url.searchParams.set('task',id);url.searchParams.set('taskv',taskIdVersion);url.hash='framework';return url.href;
 };
 const updateTaskURL=id=>{try{history.replaceState(null,'',taskURL(id));}catch{}};
 const taskChips = ids => unique(ids).filter(id=>taskById.has(id)).map(id=>`<a class="task-chip" href="${esc(taskURL(id))}" data-task="${esc(id)}">${esc(label(taskById.get(id)))}</a>`).join('');
 const definition = task => task?.definition?.[state.lang] || task?.definition?.es || '';
 function quoteEntries(indices){
  const entries=new Map();
  for(const i of indices){
   const text=D.quotes?.[i];
   if(typeof text!=='string'||!text.length)continue;
   if(!entries.has(text))entries.set(text,{text,sources:new Map()});
   for(const source of D.quoteSources?.[i]||[])entries.get(text).sources.set(JSON.stringify([source.expert,source.turn]),source);
  }
  return [...entries.values()];
 }
 function quotePanel(indices){
  const quotes=quoteEntries(indices);
  if(!quotes.length)return '';
  const block=q=>`<figure class="interview-excerpt"><blockquote class="interview-quote">“${esc(q.text.replace(/"([^"]*)"/g,'“$1”'))}”</blockquote><figcaption class="interview-source">${[...q.sources.values()].map(s=>`<span class="interview-source-entry">${esc(s.expert)} · turno ${esc(s.turn)}</span>`).join('')}</figcaption></figure>`;
  return `<details class="interview-evidence"><summary>${esc(t('evidenceRead'))}</summary><div class="interview-excerpts">${quotes.slice(0,2).map(block).join('')}${quotes.length>2?`<details class="interview-more"><summary>${esc(t('evidenceAll'))}</summary>${quotes.slice(2).map(block).join('')}</details>`:''}</div></details>`;
 }
 function evidenceForCHA(id,scope={}){
  let rows=(scope.competency?D.competencyEvidence:D.evidenceContexts)||[];
  rows=rows.filter(r=>r.cha===id&&(!scope.competency||r.competency===scope.competency)&&(!scope.task||r.task===scope.task)&&(!scope.stage||r.stage===scope.stage));
  if(scope.edge){const contexts=D.edgeContexts.filter(c=>c.edge===scope.edge&&(!scope.task||c.task===scope.task));rows=rows.filter(r=>contexts.some(c=>c.task===r.task&&c.stage===r.stage));}
  return unique(rows.flatMap(r=>r.quotes||[]));
 }
 function scopeForTrigger(button){
  return {task:button.dataset.contextTask||state.task||'',competency:button.dataset.contextCompetency||(state.view==='cha'?state.capFilter:'')||'',edge:button.dataset.contextEdge||''};
 }
 const evidenceScope = scope => `${scope.competency?`<p class="evidence-scope">${esc(label(capById.get(scope.competency)))}</p>`:''}${scope.task?`<div class="task-chips evidence-scope">${taskChips([scope.task])}</div>`:''}`;
 const allText = x => [x.id,x.es,x.en,x.zh].join(' ');
 const searchableCHA = x => norm([allText(x),...taskIdsForCha(x.id).map(id=>allText(taskById.get(id)))].join(' '));
 const chaSearch = new Map(D.cha.map(x=>[x.id,searchableCHA(x)]));
 const matchesCHA = (x,q) => (state.task?norm(allText(x)+' '+allText(taskById.get(state.task))):chaSearch.get(x.id)).includes(q);
 const taskCHA = task => unique(D.contexts.filter(x=>x.task===task).map(x=>x.cha)).map(id=>chaById.get(id));
 const taskCapCHA = (task,cap) => unique(D.competencyContexts.filter(x=>x.task===task&&x.competency===cap).map(x=>x.cha)).map(id=>chaById.get(id));
 const taskCaps = task => D.competencies.filter(c=>D.competencyTasks.some(x=>x.task===task&&x.competency===c.id));
 const countsMarkup = items => ['C','H','A'].map(type=>`<span>${marker(type)} ${items.filter(x=>x.type===type).length}</span>`).join('');

 function renderTaskDirectory(){
  const tasks=D.tasks.filter(x=>!state.taskQuery||norm(allText(x)).includes(norm(state.taskQuery)));
  $('#result-count').textContent=`${tasks.length} / ${D.tasks.length} ${t('taskCount')}`;
  if(!tasks.length){$('#explorer-content').innerHTML=`<div class="empty-state"><p>${esc(t('taskNoResults'))}</p><button class="text-button" data-action="reset">${esc(t('taskClearSearch'))}</button></div>`;return;}
  if(!tasks.some(x=>x.id===state.selectedTask))state.selectedTask=tasks[0].id;
  const task=taskById.get(state.selectedTask),caps=taskCaps(task.id),items=taskCHA(task.id),stages=unique(D.contexts.filter(x=>x.task===task.id).map(x=>x.stage));
  $('#explorer-content').innerHTML=`<div class="task-directory-intro"><span class="detail-kicker">${esc(t('taskDirectory'))}</span><h3>${esc(t('taskDirectoryHint'))}</h3><p>${esc(t('taskDirectoryText'))}</p></div><div class="task-directory-layout"><div class="task-directory-list" role="group" aria-label="${esc(t('viewTasks'))}">${tasks.map(x=>`<button class="directory-task ${x.id===task.id?'active':''}" data-directory-task="${esc(x.id)}" aria-pressed="${x.id===task.id}"><span>${esc(label(x))}</span><span class="directory-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><div class="task-detail fade-in"><p class="detail-kicker">${esc(t('taskLabel'))}</p><h3>${esc(label(task))}</h3><p class="task-definition">${esc(definition(task))}</p>${quotePanel(task.evidence||[])}<div class="task-summary"><span><strong>${caps.length}</strong> ${esc(t(caps.length===1?'taskCompetencyOne':'taskCompetencies'))}</span><span><strong>${items.length}</strong> ${esc(t('taskCHA'))}</span></div><p class="detail-subtitle">${esc(t('taskStages'))}</p><div class="task-stage-list">${stages.map(s=>`<span>${esc(stageLabel(s))}</span>`).join('')}</div><div class="task-combination-heading"><h4>${esc(t('taskCombination'))}</h4><p>${esc(t('taskCombinationText'))}</p></div><div class="task-combination-map"><div class="task-map-hub"><span>${esc(t('taskLabel'))}</span><span aria-hidden="true">↗</span></div><div class="task-combination">${caps.map(c=>`<button class="task-cap-card" data-task-cap="${esc(c.id)}" data-context-task="${esc(task.id)}"><span class="task-cap-heading"><span>${esc(label(c))}</span><span aria-hidden="true">↗</span></span><span class="task-cap-bottom"><span class="type-counts">${countsMarkup(taskCapCHA(task.id,c.id))}</span><span class="task-cap-link">${esc(t('taskCapButton'))}</span></span></button>`).join('')||`<p>${esc(t('taskNoMapping'))}</p>`}</div></div><button class="text-button task-all-cha" data-task-cha="${esc(task.id)}">${esc(t('taskCHAButton'))}<span aria-hidden="true">↗</span></button></div></div>`;
  const active=$('.directory-task.active'),list=$('.task-directory-list');
  if(active)list.scrollTop=Math.max(0,list.scrollTop+active.getBoundingClientRect().top-list.getBoundingClientRect().top-list.clientHeight/3);
 }

 function browseTask(id){
  state.selectedTask=id;state.taskQuery='';state.view='tasks';state.task='';state.query='';state.capFilter='';state.type='';state.page=1;
  updateTaskURL(id);
  if($('#detail-dialog').open)closeDialog();
  renderExplorer();$('.directory-task.active')?.focus({preventScroll:true});$('.explorer').scrollIntoView({behavior:'smooth',block:'start'});
 }

 function renderConcept(){ window.ConceptStory?.render(state.lang); }
 function renderPrimer(){
  $$('.primer-row').forEach(b=>{const on=b.dataset.primer===state.primer;b.classList.toggle('active',on);b.setAttribute('aria-expanded',on);$('.primer-plus',b).textContent=on?'−':'+';});
  const p=$('#primer-explanation'); p.textContent=t('primer')[state.primer];
  $(`[data-primer="${state.primer}"]`).after(p);
 }
 function renderTasks(){
  $('#task-filter').innerHTML=`<option value="">${esc(t('allTasks'))}</option>`+D.tasks.map(x=>`<option value="${esc(x.id)}">${esc(label(x))}</option>`).join('');
  $('#task-filter').value=state.task;
 }
 function filteredCHA(){
  let list=D.cha;
  if(state.capFilter){const ids=memberIds(state.capFilter);list=list.filter(x=>ids.has(x.id));}
  if(state.task){
   const ids=new Set((state.capFilter?D.competencyContexts.filter(x=>x.competency===state.capFilter):D.contexts).filter(x=>x.task===state.task).map(x=>x.cha));
   list=list.filter(x=>ids.has(x.id));
  }
  if(state.type) list=list.filter(x=>x.type===state.type);
  if(state.query) list=list.filter(x=>matchesCHA(x,norm(state.query)));
  return list;
 }
 function filteredCaps(){
  return D.competencies.filter(x=>{
   if(state.task&&!taskIdsForCap(x.id).includes(state.task)) return false;
   if(!state.query) return true;
   const q=norm(state.query),ids=state.task?new Set(D.competencyContexts.filter(c=>c.competency===x.id&&c.task===state.task).map(c=>c.cha)):memberIds(x.id);
   return norm(allText(x)).includes(q)||D.cha.some(c=>ids.has(c.id)&&matchesCHA(c,q));
  });
 }
 function miniCHA(x,competency=''){return `<button class="mini-cha" data-cha="${esc(x.id)}" data-context-competency="${esc(competency)}">${marker(x.type)}<span>${esc(label(x))}</span></button>`;}
 function renderCompetencies(){
  const caps=filteredCaps();
  if(!caps.length){$('#explorer-content').innerHTML=`<p class="empty-state">${esc(t('noResults'))}</p>`;$('#result-count').textContent=`0 ${t('competencies')}`;return;}
  if(!caps.some(x=>x.id===state.selectedCap)) state.selectedCap=caps[0].id;
  const selected=capById.get(state.selectedCap),ids=memberIds(selected.id);
  let items=D.cha.filter(x=>ids.has(x.id));
  if(state.task){const scope=new Set(D.competencyContexts.filter(x=>x.competency===selected.id&&x.task===state.task).map(x=>x.cha));items=items.filter(x=>scope.has(x.id));}
  const sample=['C','H','A'].flatMap(type=>items.filter(x=>x.type===type).slice(0,1));
  const description=state.lang==='es'?selected.description:selected[state.lang==='en'?'descriptionEn':'descriptionZh'];
  $('#explorer-content').innerHTML=`<div class="competency-layout"><div class="competency-list" role="group" aria-label="${esc(t('viewCompetencies'))}">${caps.map(x=>`<button class="competency-item ${x.id===selected.id?'active':''}" data-cap="${esc(x.id)}" aria-pressed="${x.id===selected.id}"><span class="item-title">${esc(label(x))}</span></button>`).join('')}</div><div class="competency-detail"><p class="detail-kicker">${esc(t('competencyLabel'))}</p><h3>${esc(label(selected))}</h3><p class="competency-description">${esc(description)}</p><div class="type-counts">${['C','H','A'].map(type=>`<span>${marker(type)} ${items.filter(x=>x.type===type).length}</span>`).join('')}</div><p class="detail-subtitle">${esc(t(state.task?'taskScopedCHA':'includedCHA'))}</p>${sample.map(x=>miniCHA(x,selected.id)).join('')}<button class="text-button view-all" data-all-cap="${esc(selected.id)}">${esc(t(state.task?'taskScopedAll':'viewAllCHA'))}<span aria-hidden="true">↗</span></button><p class="detail-subtitle">${esc(t('relatedTasks'))}</p><div class="task-chips">${taskChips(taskIdsForCap(selected.id))}</div></div></div>`;
  const selectedItem=$('.competency-item.active'),capList=$('.competency-list');capList.scrollTop=Math.max(0,selectedItem.offsetTop-capList.offsetTop-capList.clientHeight/3);
  $('#result-count').textContent=`${caps.length} ${t('competencies')}`;
 }
 function typeControls(){return `<div class="cha-controls">${['','C','H','A'].map(type=>`<button class="type-filter ${state.type===type?'active':''}" data-type="${type}" aria-pressed="${state.type===type}">${esc(type?`${type} · ${t({C:'knowledge',H:'skills',A:'attitudes'}[type])}`:t('allTypes'))}</button>`).join('')}</div>`;}
 function renderCHA(){
  const all=filteredCHA(),pages=Math.max(1,Math.ceil(all.length/20));state.page=Math.min(state.page,pages);
  const items=all.slice((state.page-1)*20,state.page*20);
  $('#explorer-content').innerHTML=(state.capFilter?`<div class="active-cap-filter"><span>${esc(label(capById.get(state.capFilter)))}</span><button data-action="clear-cap" aria-label="${esc(t('clearFilter'))}">×</button></div>`:'')+typeControls()+
   (items.length?`<div class="cha-list">${items.map(x=>`<button class="cha-row" data-cha="${esc(x.id)}">${marker(x.type)}<span class="cha-row-title">${esc(label(x))}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><div class="pagination"><button data-page="${state.page-1}" ${state.page===1?'disabled':''}>← ${esc(t('previous'))}</button><span>${state.page} ${esc(t('of'))} ${pages}</span><button data-page="${state.page+1}" ${state.page===pages?'disabled':''}>${esc(t('next'))} →</button></div>`:`<p class="empty-state">${esc(t('noResults'))}</p>`);
  $('#result-count').textContent=`${all.length} ${t('integratedCHA')}`;
 }
 function filteredEdges(){
  return D.edges.filter(e=>{
   if(state.type&&chaById.get(e.from).type!==state.type)return false;
   if(state.task&&!D.edgeContexts.some(c=>c.edge===e.id&&c.task===state.task))return false;
   return !state.query||norm([allText(e),allText(chaById.get(e.from)),allText(chaById.get(e.to)),...D.edgeContexts.filter(c=>c.edge===e.id).map(c=>allText(taskById.get(c.task)))].join(' ')).includes(norm(state.query));
  });
 }
 function renderDevelopment(){
  const edges=filteredEdges();
  if(!edges.length){$('#explorer-content').innerHTML=typeControls()+`<p class="empty-state">${esc(t('noRelations'))}</p>`;$('#result-count').textContent=`0 ${t('developmentRelations')}`;return;}
  if(!edges.some(e=>e.id===state.selectedEdge))state.selectedEdge=edges[0].id;
  const edge=edges.find(e=>e.id===state.selectedEdge),from=chaById.get(edge.from),to=chaById.get(edge.to),contexts=D.edgeContexts.filter(x=>x.edge===edge.id&&(!state.task||x.task===state.task));
  const edgePreview=e=>`<span class="edge-preview">${esc(label(chaById.get(e.from)))}</span><span class="edge-preview-arrow" aria-hidden="true">↓</span><span class="edge-preview">${esc(label(chaById.get(e.to)))}</span>`;
  $('#explorer-content').innerHTML=typeControls()+`<div class="development-layout"><div class="edge-list">${edges.map(e=>`<button class="edge-button ${e.id===edge.id?'active':''}" data-edge="${esc(e.id)}" aria-pressed="${e.id===edge.id}">${edgePreview(e)}</button>`).join('')}</div><div class="edge-detail"><p class="detail-kicker">${esc(t('edgeScope'))}</p><div class="edge-context">${contexts.map(c=>`<div class="edge-context-pair">${taskChips([c.task])}<span>${esc(stageLabel(c.stage))}</span></div>`).join('')}</div><div class="edge-graph"><button class="edge-node" data-cha="${esc(from.id)}" data-context-edge="${esc(edge.id)}">${marker(from.type)}<span class="edge-node-title">${esc(label(from))}</span></button><span class="edge-arrow" aria-label="${esc(t('developmentDirection'))}">→</span><button class="edge-node" data-cha="${esc(to.id)}" data-context-edge="${esc(edge.id)}">${marker(to.type)}<span class="edge-node-title">${esc(label(to))}</span></button></div></div></div>`;
  $('#result-count').textContent=`${edges.length} ${t('developmentRelations')}`;
 }

 function renderExplorer(){
  $$('.framework-tabs button').forEach(b=>{const on=b.dataset.view===state.view;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});
  const directory=state.view==='tasks',search=$('#framework-search');
  search.value=directory?state.taskQuery:state.query;search.placeholder=t(directory?'taskSearch':'searchPlaceholder');search.setAttribute('aria-label',search.placeholder);
  $('.task-control').hidden=directory;$('#task-filter').value=state.task;
  ({tasks:renderTaskDirectory,competencies:renderCompetencies,cha:renderCHA,development:renderDevelopment})[state.view]();
  if(!directory&&state.task)$('#explorer-content').insertAdjacentHTML('afterbegin',`<div class="task-context-banner">${taskChips([state.task])}<button class="text-button" data-browse-task="${esc(state.task)}">← ${esc(t('taskBack'))}</button></div>`);
 }
 function renderChart(){
  $$('.sample-tabs button').forEach(b=>{const on=b.dataset.chart===state.chart;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});
  const target=$('#sample-chart-content');
  const volume=window.CorpusVolume;
  if(volume)$('#corpus-volume-summary').innerHTML=volume.summary(state.lang);
  if(state.chart==='volume'&&volume){target.innerHTML=volume.render(state.lang);volume.mount(target,state.lang);return;}
  const numbers={origin:[22,12],profiles:[11,8,16,8],languages:[22,8,4]}[state.chart];
  const keys={origin:['originLabels','originNote'],profiles:['profileLabels','profileNote'],languages:['languageLabels','languageNote']}[state.chart];
  const projectURL=state.lang==='es'?'https://lt-lider.eu/es/home-espanol/':'https://lt-lider.eu/';
  target.innerHTML=numbers.map((n,i)=>`<div class="bar-row"><div class="bar-label"><span>${state.chart==='origin'&&i===0?`<a class="project-source-link" href="${projectURL}" target="_blank" rel="noopener noreferrer">${esc(t(keys[0])[i])}<span aria-hidden="true"> ↗</span></a>`:esc(t(keys[0])[i])}</span><span>${n}</span></div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--bar:${n/34*100}%"></div></div></div>`).join('')+`<p class="chart-note">${esc(t(keys[1]))}</p>`;
 }

 function renderMethod(){
  $('#method-steps').innerHTML=t('methodSteps').map((x,i)=>`<button class="method-step" role="tab" aria-selected="${i===state.method}" tabindex="${i===state.method?0:-1}" id="method-tab-${i}" data-method="${i}"><span>0${i+1}</span><span>${esc(x.title)}</span><span aria-hidden="true">↗</span></button>`).join('');
  const m=t('methodSteps')[state.method];$('#method-panel').setAttribute('aria-labelledby',`method-tab-${state.method}`);
  const counts=['C','H','A'].map(type=>D.cha.filter(x=>x.type===type).length);
  const facts=t('methodFacts'),values={tasks:D.tasks.length,cha:D.cha.length,knowledge:counts[0],skills:counts[1],attitudes:counts[2],edges:D.edges.length,competencies:D.competencies.length,members:D.members.length,quotes:D.quotes?.length||0,sourceCHA:D.stats?.sourceCHA||0,sourceRelations:D.stats?.sourceRelations||0};
  const fact=(facts?.[state.method]||m.fact||'').replace(/\{(\w+)\}/g,(_,key)=>values[key]??'');
  $('#method-panel').innerHTML=`<div class="fade-in"><span class="method-number">0${state.method+1}</span><h4>${esc(m.title)}</h4><p>${esc(m.text)}</p>${fact?`<div class="method-fact">${esc(fact)}</div>`:''}</div>`;
 }
 function showDialog(kind,id,scope={}){
  if((kind==='cha'&&!chaById.has(id))||(kind==='task'&&!taskById.has(id)))return;
  state.dialog={kind,id,scope};
  if(kind==='cha'){
   const x=chaById.get(id);
   $('#dialog-eyebrow').textContent=t('recordLabel');
   const caps=unique(D.members.filter(m=>m.cha===id).map(m=>m.competency)).map(c=>capById.get(c));
   const edges=D.edges.filter(e=>(e.from===id||e.to===id)&&(!scope.task||D.edgeContexts.some(c=>c.edge===e.id&&c.task===scope.task)));
   $('#dialog-body').innerHTML=`<h3>${esc(label(x))}</h3><p>${marker(x.type)} ${esc(t({C:'knowledge',H:'skills',A:'attitudes'}[x.type]))}</p>${evidenceScope(scope)}${quotePanel(evidenceForCHA(id,scope))}${state.lang!=='es'?`<details class="original-wording"><summary>${esc(t('originalWording'))}</summary><p lang="es">${esc(x.es)}</p></details>`:''}<p class="detail-subtitle">${esc(t('relatedTasks'))}</p><div class="task-chips">${taskChips(taskIdsForCha(id))}</div><p class="detail-subtitle">${esc(t('associatedCompetencies'))}</p>${caps.map(c=>`<button class="mini-cha" data-open-cap="${esc(c.id)}"><span>${esc(label(c))} ↗</span></button>`).join('')}${edges.length?`<p class="detail-subtitle">${esc(t('relatedDevelopment'))}</p>${edges.map(e=>`<button class="mini-cha development-link" data-open-edge="${esc(e.id)}"><span>${esc(label(chaById.get(e.from)))}</span><span aria-hidden="true">→</span><span>${esc(label(chaById.get(e.to)))}</span></button>`).join('')}`:''}`;
  }else if(kind==='task'){
   const task=taskById.get(id);
   $('#dialog-eyebrow').textContent=t('taskLabel');
   $('#dialog-body').innerHTML=`<h3>${esc(label(task))}</h3><p class="task-definition">${esc(definition(task))}</p>${quotePanel(task.evidence||[])}<button class="text-button task-dialog-browse" data-browse-task="${esc(id)}">${esc(t('taskExplore'))}<span aria-hidden="true">↗</span></button>`;
  }else{
   $('#dialog-eyebrow').textContent=t('references');
   const entry=(title,text,url)=>`<div class="source-entry"><h4>${esc(title)}</h4><p>${esc(text)}</p>${url?`<a href="${url}" target="_blank" rel="noopener">${esc(t('readSource'))}</a>`:''}</div>`;
   $('#dialog-body').innerHTML=`<h3>${esc(t('sourcesTitle'))}</h3><p>${esc(t('sourcesIntro'))}</p>`+(id!=='research'?
    entry(t('sourceThesis'),t('sourceThesisText'))+entry('Gilster, P. (1997). Digital Literacy.',t('sourceGilster'),'https://search.worldcat.org/search?q=ti%3ADigital+Literacy+au%3AGilster')+entry('Martin, A. (2006). A european framework for digital literacy.',t('sourceMartin'),'https://doi.org/10.18261/ISSN1891-943X-2006-02-06')+entry('Belshaw, D. (2012). On the important differences between literacies, skills and competencies.',t('sourceBelshaw'),'https://blog.dougbelshaw.com/on-the-important-differences-between-literacies-skills-and-competencies/'):'')+
    (id!=='concepts'?entry(t('sourceWorkbook'),t('sourceWorkbookText'))+entry(t('sourceScope'),t('sourceScopeText')):'');
  }
  $('#dialog-body h3').id='dialog-title';
  $('#close-dialog').setAttribute('aria-label',t('close'));
  const d=$('#detail-dialog');if(!d.open)d.showModal();d.scrollTop=0;
 }

 function closeDialog(){ $('#detail-dialog').close();state.dialog=null; }
 function setLanguage(lang){
  if(!C[lang])return;
  const bookAnchor=$('.cb-paper'),bookRect=bookAnchor?.getBoundingClientRect();
  const y=window.scrollY,anchor=bookRect&&bookRect.top<=240&&bookRect.bottom>120?bookAnchor:$$('main>section').find(s=>s.getBoundingClientRect().top<=120&&s.getBoundingClientRect().bottom>120),anchorOffset=anchor?anchor.getBoundingClientRect().top:null;state.lang=lang;document.documentElement.lang=lang==='zh'?'zh':lang;
  document.title=`${t('thesisTitle')} · ${t('authorName')}`;
  document.querySelector('meta[name="description"]').setAttribute('content',`${t('thesisTitle')} · ${t('authorName')}`);
  $$('[data-i18n]').forEach(el=>{const value=t(el.dataset.i18n);if(typeof value==='string')el.innerHTML=value;});
  $$('[data-placeholder]').forEach(el=>el.placeholder=t(el.dataset.placeholder));
  $$('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.lang===lang));
  const totals={competencies:D.competencies.length,integratedCHA:D.cha.length,tasks:D.tasks.length,developmentRelations:D.edges.length};
  $$('.framework-numbers [data-i18n]').forEach(el=>{if(totals[el.dataset.i18n]!==undefined)el.previousElementSibling.textContent=totals[el.dataset.i18n];});
  $('#framework-search').setAttribute('aria-label',t('searchPlaceholder'));$('#task-filter').setAttribute('aria-label',t('filterTask'));
  renderConcept();renderPrimer();renderTasks();renderExplorer();renderChart();renderMethod();
  if(state.dialog)showDialog(state.dialog.kind,state.dialog.id,state.dialog.scope);
  try{const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}catch{}
  const restoredAnchor=anchor?.classList.contains('cb-paper')?$('.cb-paper'):anchor;
  window.scrollTo({top:restoredAnchor?window.scrollY+restoredAnchor.getBoundingClientRect().top-anchorOffset:y,behavior:'instant'});
 }
 function reset(){state.query='';state.taskQuery='';state.task='';state.type='';state.capFilter='';state.page=1;$('#framework-search').value='';$('#task-filter').value='';renderExplorer();}
 document.addEventListener('click',e=>{
  const b=e.target.closest('button,a[data-task]');if(!b)return;
  if(b.matches('a')&&(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey))return;
  if(b.dataset.lang){setLanguage(b.dataset.lang);return;}
  if(b.dataset.primer){state.primer=b.dataset.primer;renderPrimer();return;}
  if(b.dataset.view){state.view=b.dataset.view;if(state.view==='tasks'){if(state.task)state.selectedTask=state.task;state.task='';state.query='';state.taskQuery='';}state.page=1;state.type='';state.capFilter='';renderExplorer();return;}
  if(b.dataset.directoryTask){const list=$('.task-directory-list'),scroll=list.scrollTop;state.selectedTask=b.dataset.directoryTask;updateTaskURL(state.selectedTask);renderExplorer();$('.task-directory-list').scrollTop=scroll;$('.directory-task.active').focus({preventScroll:true});return;}
  if(b.dataset.browseTask){browseTask(b.dataset.browseTask);return;}
  if(b.dataset.taskCap){state.task=b.dataset.contextTask;state.selectedCap=b.dataset.taskCap;state.query='';state.type='';state.capFilter='';state.view='competencies';renderExplorer();$('.competency-item.active').focus({preventScroll:true});$('.explorer').scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(b.dataset.taskCha){state.task=b.dataset.taskCha;state.query='';state.type='';state.capFilter='';state.page=1;state.view='cha';renderExplorer();$('.cha-row')?.focus({preventScroll:true});$('.explorer').scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(b.dataset.cap){const list=$('.competency-list'),scroll=list.scrollTop;state.selectedCap=b.dataset.cap;renderExplorer();$('.competency-list').scrollTop=scroll;$(`[data-cap="${state.selectedCap}"]`).focus({preventScroll:true});return;}
  if(b.dataset.allCap){state.capFilter=b.dataset.allCap;state.view='cha';state.type='';state.page=1;renderExplorer();$('.cha-row')?.focus({preventScroll:true});return;}
  if(b.dataset.type!==undefined){state.type=b.dataset.type;state.page=1;renderExplorer();$(`[data-type="${state.type}"]`).focus({preventScroll:true});return;}
  if(b.dataset.page){state.page=Number(b.dataset.page);renderExplorer();$('.cha-row')?.focus({preventScroll:true});$('.explorer').scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(b.dataset.cha){showDialog('cha',b.dataset.cha,scopeForTrigger(b));return;}
  if(b.dataset.edge){const scroll=$('.edge-list').scrollTop;state.selectedEdge=b.dataset.edge;renderExplorer();$('.edge-list').scrollTop=scroll;$(`[data-edge="${state.selectedEdge}"]`).focus({preventScroll:true});return;}
  if(b.dataset.task){e.preventDefault();showDialog('task',b.dataset.task);return;}
  if(b.dataset.openCap){closeDialog();reset();state.selectedCap=b.dataset.openCap;state.view='competencies';renderExplorer();$('.competency-item.active').focus({preventScroll:true});$('.explorer').scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(b.dataset.openEdge){closeDialog();reset();state.selectedEdge=b.dataset.openEdge;state.view='development';renderExplorer();$('.edge-button.active').focus({preventScroll:true});$('.explorer').scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(b.dataset.chart){state.chart=b.dataset.chart;renderChart();try{const url=new URL(location.href);if(state.chart==='origin')url.searchParams.delete('sample');else url.searchParams.set('sample',state.chart);history.replaceState(null,'',url);}catch{}$('.sample-tabs button[aria-selected="true"]')?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});return;}
  if(b.dataset.method!==undefined){state.method=Number(b.dataset.method);renderMethod();$(`[data-method="${state.method}"]`).focus({preventScroll:true});return;}
  if(b.dataset.sources){if(b.dataset.sources!=='research'&&window.ConceptStory?.openReferences){window.ConceptStory.openReferences();}else showDialog('sources',b.dataset.sources);return;}
  if(b.dataset.action==='reset'){const fromResults=!!b.closest('#explorer-content');reset();if(fromResults)$('#framework-search').focus({preventScroll:true});return;}
  if(b.dataset.action==='clear-cap'){state.capFilter='';state.page=1;renderExplorer();($('.cha-row')||$('#framework-search')).focus({preventScroll:true});return;}
 });
 $('#framework-search').addEventListener('input',e=>{state[state.view==='tasks'?'taskQuery':'query']=e.target.value;state.page=1;renderExplorer();});
 $('#task-filter').addEventListener('change',e=>{state.task=e.target.value;state.page=1;renderExplorer();});
 $('#close-dialog').addEventListener('click',closeDialog);
 $('#detail-dialog').addEventListener('cancel',()=>{state.dialog=null;});
 $('#detail-dialog').addEventListener('click',e=>{if(e.target===$('#detail-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
 document.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||e.target.getAttribute('role')!=='tab')return;
  const tablist=e.target.closest('[role="tablist"]');const buttons=$$('[role="tab"]',tablist);let i=buttons.indexOf(e.target);
  i=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  e.preventDefault();buttons[i].click();const next=$$('[role="tab"]',tablist)[i];if(next)next.focus({preventScroll:true});
 });
 setLanguage(state.lang);
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
 $$('.section-intro,.bridge-copy,.research-data,.publication-empty').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
 const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('.main-nav a').forEach(a=>a.classList.toggle('current',a.hash==='#'+entry.target.id));}}),{rootMargin:'-15% 0px -65% 0px',threshold:0});
 $$('main>section[id]').forEach(el=>navObserver.observe(el));
 if(params.get('cha')&&chaById.has(params.get('cha')))showDialog('cha',params.get('cha'),{task:linkedTask});
 else if(location.hash&&location.hash!=='#framework'){const id=decodeURIComponent(location.hash.slice(1));const target=document.getElementById(id);if(target)target.scrollIntoView({behavior:'instant'});else window.ConceptStory?.openChapter(id);}
 else if(linkedTask)$('#framework').scrollIntoView({behavior:'instant'});
})();
