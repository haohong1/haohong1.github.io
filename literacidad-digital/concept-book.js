(() => {
 'use strict';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const identifier=value=>String(value??'').replace(/[^a-z0-9_-]/gi,c=>`-${c.codePointAt(0).toString(16)}-`);
 const plain=value=>String(value??'').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,'$2');
 const decodeEntities=value=>String(value).replace(/&(amp|lt|gt|quot|apos|#39|#\d+|#x[0-9a-f]+);/gi,(entity,code)=>{
  const named={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",'#39':"'"};
  if(named[code.toLowerCase()])return named[code.toLowerCase()];
  const point=code[1]?.toLowerCase()==='x'?parseInt(code.slice(2),16):parseInt(code.slice(1),10);
  return Number.isFinite(point)&&point>=0&&point<=0x10ffff?String.fromCodePoint(point):entity;
 });
 const safeReference=html=>String(html??'').split(/(<\/?em>)/gi).map(part=>/^<\/?em>$/i.test(part)?part.toLowerCase():esc(decodeEntities(part))).join('');
 const safeURL=url=>/^https?:\/\//i.test(String(url??''))?String(url):'';
 const COPY={
  zh:{previous:'上一页',next:'下一页',page:'页',of:'／',chapter:'章',references:'参考文献',reading:'阅读位置',returnReading:'返回刚才的阅读',returnHint:'回到打开引文前的页面和位置',referenceHint:'点按引文，可跳至书末完整参考文献。',referenceTitle:'阅读所依据的文献',referenceIntro:'正文中的引文可以在这里找到。点击链接可访问相应来源。',referenceLink:'查看来源',referenceEmpty:'参考文献正在整理。',continued:'续',model:'图解',contents:'阅读书签',book:'概念之书',keyboard:'可用 ← → 翻页',end:'本书完',citationUnavailable:'参考信息暂不可用',citationDescription:'查看完整参考文献',chapterPage:'本章',backToReading:'回到正文'},
  es:{previous:'Anterior',next:'Siguiente',page:'página',of:'/',chapter:'capítulo',references:'Referencias',reading:'POSICIÓN DE LECTURA',returnReading:'Volver a mi lectura',returnHint:'Volver a la página y posición anteriores a la consulta',referenceHint:'Pulsa la cita para ver la referencia completa al final del libro.',referenceTitle:'Las fuentes de esta lectura',referenceIntro:'Aquí se reúnen las referencias citadas en el texto. Los enlaces permiten consultar las fuentes.',referenceLink:'Consultar la fuente',referenceEmpty:'Las referencias se están preparando.',continued:'continuación',model:'Modelo',contents:'Marcadores de lectura',book:'El libro de los conceptos',keyboard:'Usa ← → para pasar de página',end:'Fin del libro',citationUnavailable:'Referencia no disponible',citationDescription:'Consultar la referencia completa',chapterPage:'En este capítulo',backToReading:'Volver al texto'},
  en:{previous:'Previous',next:'Next',page:'page',of:'/',chapter:'chapter',references:'References',reading:'READING POSITION',returnReading:'Return to my reading',returnHint:'Return to the page and position before opening the citation',referenceHint:'Select the citation to see its full reference at the end of the book.',referenceTitle:'The sources behind this reading',referenceIntro:'The references cited in the text are collected here. Follow the links to consult the sources.',referenceLink:'Read the source',referenceEmpty:'The references are being prepared.',continued:'continued',model:'Model',contents:'Reading bookmarks',book:'The book of concepts',keyboard:'Use ← → to turn the page',end:'End of the book',citationUnavailable:'Reference unavailable',citationDescription:'View the full reference',chapterPage:'In this chapter',backToReading:'Back to the text'}
 };
 let state={lang:'es',story:null,pages:[],index:0,root:null,refs:[],refMap:new Map(),compact:false},returnPoint=null,tooltip=null,tooltipAnchor=null,turnTimer=null;
 const text=key=>COPY[state.lang][key];
 const measure=(value,lang)=>lang==='zh'?[...plain(value).replace(/\s/g,'')].length:plain(value).trim().split(/\s+/).filter(Boolean).length;
 const headerHeight=()=>document.querySelector('.site-header')?.getBoundingClientRect().height||88;
 function references(){
  const refs=Array.isArray(window.CONCEPT_REFERENCES)?window.CONCEPT_REFERENCES:[];
  const seen=new Set();
  return refs.filter(ref=>ref&&ref.id&&!seen.has(ref.id)&&seen.add(ref.id));
 }
 function inline(value,key){
  const source=String(value??''),pattern=/\[\[([^|\]]+)\|([^\]]+)\]\]/g;
  let html='',offset=0,match,index=0;
  while((match=pattern.exec(source))){
   html+=esc(source.slice(offset,match.index));
   const id=match[1].trim(),rawLabel=match[2].trim(),label=/^[（(].*[）)]$/.test(rawLabel)?rawLabel:`(${rawLabel})`,citeId=`book-cite-${identifier(key)}-${index++}`;
   html+=state.refMap.has(id)?`<a class="cb-citation" id="${citeId}" href="#book-reference-${identifier(id)}" data-cb-reference="${esc(id)}" data-cb-unit="${esc(key)}" aria-label="${esc(label)} · ${esc(text('citationDescription'))}">${esc(label)}</a>`:`<span class="cb-citation-text">${esc(label)}</span>`;
   offset=match.index+match[0].length;
  }
  return html+esc(source.slice(offset));
 }
 function unitCost(unit,lang){
  const fields=unit.type==='paragraph'||unit.type==='basis'?[unit.text]:unit.type==='example'?[unit.value.title,...(unit.value.paragraphs||[])]:unit.type==='aside'?[unit.value.title,unit.value.text,...(unit.value.paragraphs||[])]:unit.type==='comparison'?[unit.value.title,...unit.value.items.flatMap(item=>[item.label,item.text]),unit.value.note]:[];
  return fields.reduce((sum,value)=>sum+measure(value,lang),0)+(unit.type==='paragraph'?0:lang==='zh'?55:25);
 }
 function paginate(story,lang,refs){
  const pages=[],compact=window.innerWidth<=600,limit=lang==='zh'?(compact?410:740):(compact?180:315);
  story.sections.forEach((section,chapterIndex)=>{
   const all=[];
   (section.paragraphs||[]).forEach((paragraph,index)=>all.push({type:'paragraph',text:paragraph,key:`${section.id}-p-${index}`}));
   if(section.comparison)all.push({type:'comparison',value:section.comparison,key:`${section.id}-comparison`});
   if(section.example)all.push({type:'example',value:section.example,key:`${section.id}-example`});
   if(section.aside)all.push({type:'aside',value:section.aside,key:`${section.id}-aside`});
   if(section.basis)all.push({type:'basis',text:section.basis,key:`${section.id}-basis`});
   const chapterPages=section.model?[{type:'model',chapterId:section.id,chapterIndex,section,first:false,units:[{type:'model',kind:section.model,key:`${section.id}-model`}],model:section.model}]:[];
   let current={type:'reading',chapterId:section.id,chapterIndex,section,first:true,units:[]},cost=measure(section.lead,lang)+(lang==='zh'?115:55);
   const flush=()=>{
    if(current.units.length||current.first)chapterPages.push(current);
    current={type:'reading',chapterId:section.id,chapterIndex,section,first:false,units:[]};cost=lang==='zh'?45:20;
   };
   all.forEach(unit=>{
    const size=unitCost(unit,lang);
    if(current.units.length&&cost+size>limit)flush();
    current.units.push(unit);cost+=size;
   });
   flush();
   chapterPages.forEach((page,index)=>{page.chapterPage=index;page.chapterTotal=chapterPages.length;pages.push(page);});
  });
  const count=Math.max(1,Math.ceil(refs.length/5));
  for(let index=0;index<count;index++)pages.push({type:'references',chapterId:'references',chapterIndex:story.sections.length,chapterPage:index,chapterTotal:count,refs:refs.slice(index*5,index*5+5),units:[]});
  return pages;
 }
 function paragraphMarkup(values,key){return (values||[]).map((value,index)=>`<p>${inline(value,`${key}-${index}`)}</p>`).join('');}
 function unitMarkup(unit){
  if(unit.type==='paragraph')return `<p data-cb-unit-key="${esc(unit.key)}">${inline(unit.text,unit.key)}</p>`;
  if(unit.type==='basis')return `<p class="cb-source" data-cb-unit-key="${esc(unit.key)}"><span>${esc(state.story.sourceLabel||'')}</span>${inline(unit.text,unit.key)}</p>`;
  if(unit.type==='example')return `<aside class="cb-example" data-cb-unit-key="${esc(unit.key)}"><span class="cb-example-mark" aria-hidden="true">↗</span><div><h4>${inline(unit.value.title,`${unit.key}-title`)}</h4>${paragraphMarkup(unit.value.paragraphs,unit.key)}</div></aside>`;
  if(unit.type==='aside')return `<aside class="cb-aside" data-cb-unit-key="${esc(unit.key)}"><h4>${inline(unit.value.title,`${unit.key}-title`)}</h4>${unit.value.text?`<p>${inline(unit.value.text,unit.key)}</p>`:''}${paragraphMarkup(unit.value.paragraphs,unit.key)}</aside>`;
  if(unit.type==='comparison')return `<section class="cb-comparison" data-cb-unit-key="${esc(unit.key)}"><h4>${inline(unit.value.title,`${unit.key}-title`)}</h4><div class="cb-comparison-columns">${unit.value.items.map((item,index)=>`<div><h5>${inline(item.label,`${unit.key}-${index}-label`)}</h5><p>${inline(item.text,`${unit.key}-${index}`)}</p></div>`).join('')}</div>${unit.value.note?`<p class="cb-comparison-note">${inline(unit.value.note,`${unit.key}-note`)}</p>`:''}</section>`;
  return '';
 }
 function referenceMarkup(reference){
  const url=safeURL(reference.url);
  return `<li class="cb-reference-entry" id="book-reference-${identifier(reference.id)}" data-cb-ref-entry="${esc(reference.id)}"><p>${safeReference(reference.html||reference.short||reference.id)}</p>${url?`<a class="cb-source-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text('referenceLink'))} <span aria-hidden="true">↗</span></a>`:''}</li>`;
 }
 function pageMarkup(page){
  const chapterNumber=String(page.chapterIndex+1).padStart(2,'0'),running=page.type==='references'?text('references'):page.section.shortTitle;
  let content='';
  if(page.type==='references'){
   content=`<div class="cb-reading-body"><header class="cb-page-heading"><span class="cb-page-kicker">${esc(text('references'))}</span><h3 id="book-page-title" tabindex="-1">${esc(text('referenceTitle'))}${page.chapterPage?` <small>${esc(text('continued'))}</small>`:''}</h3>${page.chapterPage===0?`<p class="cb-lead">${esc(text('referenceIntro'))}</p>`:''}</header><ol class="cb-reference-list" start="${page.chapterPage*5+1}">${page.refs.length?page.refs.map(referenceMarkup).join(''):`<li>${esc(text('referenceEmpty'))}</li>`}</ol></div>`;
  }else if(page.type==='model'){
   content=`<h3 class="cb-visually-hidden" id="book-page-title" tabindex="-1">${esc(page.section.title)} · ${esc(text('model'))}</h3><div class="cb-model-page" data-cb-unit-key="${esc(page.units[0].key)}">${window.ConceptModels?.render(page.model,state.lang)||''}<p class="cb-model-citation">${inline(`[[lai|Lai 2026, sec. ${page.model==='dimensions'?'2.1.2.4':'2.1.5.6'}]]`,page.units[0].key)}</p></div>`;
  }else{
   const heading=page.first?`<header class="cb-page-heading"><span class="cb-page-kicker">${chapterNumber} · ${esc(page.section.shortTitle)}</span><h3 id="book-page-title" tabindex="-1">${inline(page.section.title,`${page.chapterId}-title`)}</h3>${page.section.lead?`<p class="cb-lead">${inline(page.section.lead,`${page.chapterId}-lead`)}</p>`:''}</header>`:`<header class="cb-continuation"><span class="cb-page-kicker">${chapterNumber} · ${esc(page.section.shortTitle)}</span><h3 id="book-page-title" tabindex="-1">${esc(page.section.title)} <small>${esc(text('continued'))}</small></h3></header>`;
   content=`<div class="cb-reading-body">${heading}<div class="cb-prose">${page.units.map(unitMarkup).join('')}</div></div>`;
  }
  return `<div class="cb-running-head"><span>${esc(running)}</span><span>${esc(text('chapterPage'))} ${page.chapterPage+1} ${esc(text('of'))} ${page.chapterTotal}</span></div><div class="cb-page-content">${content}</div><footer class="cb-paper-footer"><span>${esc(state.story.eyebrow||text('book'))}</span><span class="cb-folio">${String(state.index+1).padStart(2,'0')}</span></footer>`;
 }
 function controls(where){
  return `<div class="cb-controls cb-controls-${where}"><button type="button" class="cb-nav-button" data-cb-action="previous" aria-label="${esc(text('previous'))}"><span aria-hidden="true">←</span><span>${esc(text('previous'))}</span></button><span class="cb-page-counter" ${where==='top'?'role="status" aria-live="polite"':''}></span><button type="button" class="cb-nav-button" data-cb-action="next" aria-label="${esc(text('next'))}"><span>${esc(text('next'))}</span><span aria-hidden="true">→</span></button>${where==='top'?`<button type="button" class="cb-mobile-contents" data-cb-action="contents">${esc(state.lang==='zh'?'书签':state.lang==='es'?'Capítulos':'Chapters')}</button><button type="button" class="cb-return-button" data-cb-action="return" title="${esc(text('returnHint'))}" hidden><span aria-hidden="true">↶</span>${esc(text('returnReading'))}</button>`:''}</div>`;
 }
 function closeTooltip(){
  if(tooltipAnchor)tooltipAnchor.removeAttribute('aria-describedby');
  tooltip?.remove();tooltip=null;tooltipAnchor=null;
 }
 function showTooltip(anchor){
  if(anchor===tooltipAnchor&&tooltip)return;
  closeTooltip();const reference=state.refMap.get(anchor.dataset.cbReference);if(!reference)return;
  tooltip=document.createElement('div');tooltip.id='concept-book-citation-tooltip';tooltip.className='cb-tooltip';tooltip.setAttribute('role','tooltip');tooltip.innerHTML=`<div>${safeReference(reference.html||reference.short||reference.id)}</div><p>${esc(text('referenceHint'))}</p>`;
  document.body.append(tooltip);tooltipAnchor=anchor;anchor.setAttribute('aria-describedby',tooltip.id);
  const rect=anchor.getBoundingClientRect(),box=tooltip.getBoundingClientRect(),left=Math.max(12,Math.min(rect.left,window.innerWidth-box.width-12));
  const below=rect.bottom+10,top=below+box.height<=window.innerHeight-12?below:Math.max(12,rect.top-box.height-10);
  tooltip.style.left=`${left}px`;tooltip.style.top=`${top}px`;
  tooltip.addEventListener('pointerleave',event=>{if(!anchor.contains(event.relatedTarget))closeTooltip();});
 }
 function contextOf(page){return {chapterId:page.chapterId,chapterPage:page.chapterPage,type:page.type,unitKey:page.units[0]?.key,reference:page.refs?.[0]?.id};}
 function locate(context){
  if(!context)return 0;
  if(context.type==='references'){
   const byRef=state.pages.findIndex(page=>page.type==='references'&&page.refs.some(ref=>ref.id===context.reference));
   if(byRef>=0)return byRef;
  }
  const chapter=state.pages.map((page,index)=>({page,index})).filter(x=>x.page.chapterId===context.chapterId);
  if(!chapter.length)return 0;
  if(context.unitKey){const found=chapter.find(x=>x.page.units.some(unit=>context.unitKey===unit.key||context.unitKey.startsWith(`${unit.key}-`)));if(found)return found.index;}
  if(context.type==='model'){const model=chapter.find(x=>x.page.type==='model');if(model)return model.index;}
  return chapter[Math.min(context.chapterPage||0,chapter.length-1)].index;
 }
 function pageTop(){
  const paper=state.root.querySelector('.cb-paper'),toolbar=state.root.querySelector('.cb-controls-top');
  if(!paper)return;
  const top=paper.getBoundingClientRect().top+window.scrollY-headerHeight()-(toolbar?.offsetHeight||0)-18;
  window.scrollTo({top:Math.max(0,top),behavior:'instant'});
 }
 function updateNavigation(){
  const page=state.pages[state.index];
  state.root.querySelectorAll('[data-cb-action="previous"]').forEach(button=>button.disabled=state.index===0);
  state.root.querySelectorAll('[data-cb-action="next"]').forEach(button=>button.disabled=state.index===state.pages.length-1);
  state.root.querySelectorAll('.cb-page-counter').forEach(counter=>counter.innerHTML=`<span>${state.index+1}</span><span class="cb-counter-divider">${esc(text('of'))}</span><span>${state.pages.length}</span>`);
  state.root.querySelectorAll('[data-cb-chapter]').forEach(button=>{
   const on=button.dataset.cbChapter===page.chapterId;button.classList.toggle('active',on);
   if(on)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
  });
  state.root.querySelector('[data-cb-action="return"]').hidden=!returnPoint;
  state.root.style.setProperty('--cb-header-offset',`${headerHeight()+8}px`);
 }
 function paint({turn=0,focus=false,scroll=false}={}){
  closeTooltip();clearTimeout(turnTimer);state.root.querySelector('.cb-turn-leaf')?.remove();
  const paper=state.root.querySelector('.cb-paper'),oldHeight=paper.offsetHeight,page=state.pages[state.index];
  paper.classList.toggle('cb-paper-model',page.type==='model');paper.classList.toggle('cb-paper-references',page.type==='references');paper.innerHTML=pageMarkup(page);
  window.ConceptModels?.mount(paper,state.lang);updateNavigation();
  if(turn&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   const leaf=document.createElement('div');leaf.className=`cb-turn-leaf ${turn<0?'cb-turn-back':'cb-turn-forward'}`;leaf.setAttribute('aria-hidden','true');leaf.setAttribute('inert','');leaf.style.height=`${Math.min(Math.max(oldHeight,760),paper.offsetHeight)}px`;
   state.root.querySelector('.cb-page-stage').append(leaf);turnTimer=setTimeout(()=>leaf.remove(),560);
  }
  if(focus)paper.querySelector('#book-page-title')?.focus({preventScroll:true});
  if(scroll)pageTop();
 }
 function go(index,options={}){
  const target=Math.max(0,Math.min(state.pages.length-1,index));
  if(target===state.index&&!options.force)return;
  const direction=target>=state.index?1:-1;state.index=target;paint({turn:options.animate===false?0:direction,focus:options.focus!==false,scroll:options.scroll!==false});
 }
 function openReference(id,anchor){
  const target=state.pages.findIndex(page=>page.type==='references'&&page.refs.some(ref=>ref.id===id));if(target<0)return;
  if(anchor){
   returnPoint={...contextOf(state.pages[state.index]),unitKey:anchor.dataset.cbUnit||contextOf(state.pages[state.index]).unitKey,citationId:anchor.id,referenceId:id,scrollY:window.scrollY,viewportTop:anchor.getBoundingClientRect().top,lang:state.lang,width:window.innerWidth};
  }
  go(target,{force:true,animate:false,focus:false});
  const entry=state.root.querySelector(`[data-cb-ref-entry="${CSS.escape(id)}"]`);
  if(entry){
   entry.classList.add('cb-reference-highlight');entry.setAttribute('tabindex','-1');entry.focus({preventScroll:true});
   window.scrollTo({top:Math.max(0,window.scrollY+entry.getBoundingClientRect().top-headerHeight()-state.root.querySelector('.cb-controls-top').offsetHeight-28),behavior:'instant'});
  }
 }
 function restoreReading(){
  if(!returnPoint)return;
  const saved={...returnPoint};state.index=locate(saved);returnPoint=null;paint({focus:false,scroll:false});
  let anchor=document.getElementById(saved.citationId);
  if(!anchor){
   const candidates=[...state.root.querySelectorAll('.cb-citation')].filter(a=>a.dataset.cbReference===saved.referenceId);
   anchor=candidates.find(a=>a.dataset.cbUnit===saved.unitKey)||candidates[0];
  }
  const restore=()=>{
   if(saved.lang===state.lang&&saved.width===window.innerWidth)window.scrollTo({top:saved.scrollY,behavior:'instant'});
   else if(anchor)window.scrollTo({top:Math.max(0,window.scrollY+anchor.getBoundingClientRect().top-saved.viewportTop),behavior:'instant'});
   else pageTop();
   if(anchor)anchor.focus({preventScroll:true});else state.root.querySelector('#book-page-title')?.focus({preventScroll:true});
   closeTooltip();
  };
  restore();requestAnimationFrame(restore);
 }
 function bind(root){
  if(root.dataset.cbBound)return;root.dataset.cbBound='true';
  root.addEventListener('click',event=>{
   const citation=event.target.closest('.cb-citation');if(citation){event.preventDefault();openReference(citation.dataset.cbReference,citation);return;}
   const chapter=event.target.closest('[data-cb-chapter]');if(chapter){openChapter(chapter.dataset.cbChapter);return;}
   const button=event.target.closest('[data-cb-action]');if(!button)return;
   if(button.dataset.cbAction==='previous')go(state.index-1);
   if(button.dataset.cbAction==='next')go(state.index+1);
   if(button.dataset.cbAction==='return')restoreReading();
   if(button.dataset.cbAction==='contents'){const nav=state.root.querySelector('.cb-bookmarks');window.scrollTo({top:Math.max(0,scrollY+nav.getBoundingClientRect().top-headerHeight()-18),behavior:'instant'});}
  });
  root.addEventListener('pointerover',event=>{const anchor=event.target.closest('.cb-citation');if(anchor)showTooltip(anchor);});
  root.addEventListener('pointerout',event=>{const anchor=event.target.closest('.cb-citation');if(anchor&&!anchor.contains(event.relatedTarget)&&!tooltip?.contains(event.relatedTarget))closeTooltip();});
  root.addEventListener('focusin',event=>{if(event.target.matches('.cb-citation'))showTooltip(event.target);});
  root.addEventListener('focusout',event=>{if(event.target.matches('.cb-citation'))closeTooltip();});
  root.addEventListener('keydown',event=>{
   if(event.key==='Escape'){closeTooltip();return;}
   if(!['ArrowLeft','ArrowRight'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.target.closest('input,textarea,select,[contenteditable=true],.cm'))return;
   event.preventDefault();go(state.index+(event.key==='ArrowRight'?1:-1));
  });
 }
 function render(language='es'){
  const lang=COPY[language]?language:'es',story=window.CONCEPT_STORY?.[lang],root=document.querySelector('#concept-story');if(!story||!root)return;
  const previous=state.pages.length?contextOf(state.pages[state.index]):null;
  closeTooltip();state.lang=lang;state.story=story;state.root=root;state.refs=references();state.refMap=new Map(state.refs.map(ref=>[ref.id,ref]));state.compact=window.innerWidth<=600;state.pages=paginate(story,lang,state.refs);state.index=locate(previous);
  root.innerHTML=`<header class="cb-introduction"><span class="cb-eyebrow">${esc(story.eyebrow||text('book'))}</span><h2>${esc(story.title||text('book')).replace(/\n/g,'<br>')}</h2><div>${paragraphMarkup(story.intro,'introduction')}<p class="cb-reading-note">${inline(story.readingNote||'','reading-note')}</p></div></header><div class="cb-book-layout"><div class="cb-book-main">${controls('top')}<div class="cb-page-stage"><article class="cb-paper" aria-labelledby="book-page-title"></article></div>${controls('bottom')}<p class="cb-keyboard-hint">${esc(text('keyboard'))}</p></div><aside class="cb-bookmarks"><p class="cb-bookmark-label">${esc(story.tocTitle||text('contents'))}</p><nav aria-label="${esc(text('contents'))}">${story.sections.map((section,index)=>`<button type="button" data-cb-chapter="${esc(section.id)}"><span class="cb-bookmark-number">${String(index+1).padStart(2,'0')}</span><span>${esc(section.shortTitle||section.title)}</span></button>`).join('')}<button type="button" data-cb-chapter="references" class="cb-reference-bookmark"><span class="cb-bookmark-number" aria-hidden="true">↗</span><span>${esc(text('references'))}</span></button></nav></aside></div><div class="cb-book-end"><span class="cb-book-end-mark" aria-hidden="true">✳</span><a class="button primary" href="#framework"><span>${esc(story.continueFramework||'')}</span><span aria-hidden="true">↗</span></a></div>`;
  bind(root);paint();
 }
 function openChapter(id){
  if(!state.root||!state.pages.length)render(document.documentElement.lang);
  const index=state.pages.findIndex(page=>page.chapterId===id);if(index<0)return false;
  go(index,{force:true});return true;
 }
 function openReferences(){returnPoint=null;return openChapter('references');}
 window.addEventListener('scroll',()=>{
  if(tooltipAnchor&&document.activeElement===tooltipAnchor){
   const anchor=tooltipAnchor,rect=anchor.getBoundingClientRect();
   closeTooltip();if(rect.bottom>headerHeight()&&rect.top<innerHeight)showTooltip(anchor);
  }else closeTooltip();
 },{passive:true,capture:true});
 window.addEventListener('resize',()=>{
  closeTooltip();if(!state.root)return;
  state.root.style.setProperty('--cb-header-offset',`${headerHeight()+8}px`);
  if(state.compact!==(window.innerWidth<=600)){
   const context=contextOf(state.pages[state.index]);state.compact=window.innerWidth<=600;
   state.pages=paginate(state.story,state.lang,state.refs);state.index=locate(context);paint();
  }
 },{passive:true});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeTooltip();});
 window.ConceptStory=Object.freeze({render,openChapter,openReferences});
})();
