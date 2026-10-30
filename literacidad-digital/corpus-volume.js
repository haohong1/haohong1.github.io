(() => {
 'use strict';
 const COPY={
  zh:{words:'词（含数字）',han:'汉字',summary:'语料规模',explore:'查看每份文本的篇幅',languages:'选择分析文本语言',names:{en:'英语',zh:'中文',es:'西班牙语'},texts:n=>`${n} 份文本`,totalWords:'本组总词数',totalHan:'本组汉字数',median:'每份中位数',range:'篇幅范围',hint:'每根柱代表一份文本。选择一根柱，查看篇幅。',axisWords:'英语与西班牙语共用词数刻度',axisHan:'中文按汉字数显示',selected:'当前文本',written:'书面回答',interview:'访谈文本',method:'怎样统计',methodText:'统计对象是清理了定位标记、说话人标签和编辑标记的提问与回答正文。汉字逐字计数，其他文字按词计数，包含数字；连字符或撇号连接的词计为一词。混排文本中的非汉字词也计入总词数。两种单位分别呈现。',groupChart:name=>`${name}文本篇幅分布`,rowLabel:(value,unit)=>`${value} ${unit}`,wordUnit:'词',hanUnit:'字',otherWords:'另含词数'},
  es:{words:'palabras',han:'caracteres chinos',summary:'EXTENSIÓN DEL CORPUS',explore:'Ver la extensión de cada texto',languages:'Elegir la lengua de los textos',names:{en:'Inglés',zh:'Chino',es:'Español'},texts:n=>`${n} textos`,totalWords:'Palabras en este grupo',totalHan:'Caracteres chinos en este grupo',median:'Mediana por texto',range:'Intervalo de extensión',hint:'Cada barra representa un texto. Selecciona una para consultar su extensión.',axisWords:'Inglés y español comparten la escala de palabras',axisHan:'El chino se muestra por número de caracteres',selected:'TEXTO SELECCIONADO',written:'Respuesta escrita',interview:'Texto de entrevista',method:'Cómo se cuenta',methodText:'Se cuentan las preguntas y respuestas tras limpiar los marcadores de posición, las etiquetas de hablante y las marcas de edición. Los caracteres chinos se cuentan uno a uno; el resto, por palabras, incluidos los números. Los términos unidos por guion o apóstrofo cuentan como una palabra. Las palabras incluidas en textos chinos también forman parte del total de palabras. Las dos unidades se presentan por separado.',groupChart:name=>`Distribución de la extensión de los textos en ${name.toLowerCase()}`,rowLabel:(value,unit)=>`${value} ${unit}`,wordUnit:'palabras',hanUnit:'caracteres chinos',otherWords:'Además, palabras'},
  en:{words:'words',han:'Chinese characters',summary:'CORPUS SIZE',explore:'See the length of each text',languages:'Choose the language of the texts',names:{en:'English',zh:'Chinese',es:'Spanish'},texts:n=>`${n} texts`,totalWords:'Words in this group',totalHan:'Chinese characters in this group',median:'Median per text',range:'Length range',hint:'Each bar represents one text. Select a bar to see its length.',axisWords:'English and Spanish share a word-count scale',axisHan:'Chinese is shown by character count',selected:'SELECTED TEXT',written:'Written response',interview:'Interview text',method:'How the text is counted',methodText:'Counts cover questions and answers after position markers, speaker labels and editing marks have been removed. Chinese characters are counted individually; other text is counted as words, including numbers. Words joined by a hyphen or apostrophe count as one. Words within Chinese texts are also included in the overall word count. The two units are reported separately.',groupChart:name=>`Distribution of ${name} text lengths`,rowLabel:(value,unit)=>`${value} ${unit}`,wordUnit:'words',hanUnit:'Chinese characters',otherWords:'Also contains words'}
 };
 const locales={zh:'zh-CN',es:'es-ES',en:'en-GB'};
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeNumber=value=>Math.max(0,Number(value)||0);
 const format=(value,lang)=>new Intl.NumberFormat(locales[lang],{maximumFractionDigits:1}).format(safeNumber(value));
 const state={language:'en',selected:{}};
 const mounted=new WeakSet();
 const language=value=>COPY[value]?value:'es';
 const dataset=()=>window.CORPUS_VOLUME_DATA;
 const groups=()=>Array.isArray(dataset()?.groups)?dataset().groups:[];
 const group=()=>groups().find(item=>item.language===state.language)||groups()[0];
 const unit=(item,lang)=>COPY[lang][item.unit==='han'?'hanUnit':'wordUnit'];
 const chosen=item=>item.rows?.find(row=>row.id===state.selected[item.language])||item.rows?.[0];
 const scaleMax=item=>{
  const maximum=Math.max(1,...groups().filter(other=>other.unit===item.unit).flatMap(other=>(other.rows||[]).map(row=>safeNumber(row.value))));
  const step=Math.pow(10,Math.floor(Math.log10(maximum)))/2;
  return Math.ceil(maximum/step)*step;
 };
 function summary(value='es'){
  const lang=language(value),copy=COPY[lang],data=dataset();
  if(!data?.totals)return '';
  return `<div class="cv-summary" aria-label="${escape(copy.summary)}"><div class="cv-summary-metrics"><div><strong>${format(data.totals.words,lang)}</strong><span>${escape(copy.words)}</span></div><div><strong>${format(data.totals.han,lang)}</strong><span>${escape(copy.han)}</span></div></div><button type="button" class="cv-summary-link" data-chart="volume">${escape(copy.explore)} <span aria-hidden="true">↗</span></button></div>`;
 }
 function detail(item,row,lang){
  if(!row)return '';
  const copy=COPY[lang],extra=item.unit==='han'&&safeNumber(row.words)>0?`<span class="cv-extra-words">${escape(copy.otherWords)}: ${format(row.words,lang)}</span>`:'';
  return `<div><span class="cv-detail-label">${escape(copy.selected)}</span><strong>${escape(row.id==='E31'?copy.written:copy.interview)}</strong></div><div class="cv-detail-count"><strong>${format(row.value,lang)}</strong><span>${escape(unit(item,lang))}</span>${extra}</div>`;
 }
 function panelContent(lang){
  const copy=COPY[lang],item=group();
  if(!item)return '';
  const row=chosen(item),maximum=scaleMax(item),rows=item.rows||[];
  return `<div class="cv-language-picker" role="group" aria-label="${escape(copy.languages)}">${groups().map(entry=>`<button type="button" data-cv-language="${escape(entry.language)}" aria-pressed="${entry.language===item.language}"><span>${escape(copy.names[entry.language]||entry.language)}</span><small>${format(entry.count,lang)}</small></button>`).join('')}</div><div class="cv-group-total"><strong>${format(item.total,lang)}</strong><div><span>${escape(copy[item.unit==='han'?'totalHan':'totalWords'])}</span><small>${escape(copy.texts(item.count))}</small></div></div><div class="cv-group-stats"><div><span>${escape(copy.median)}</span><strong>${format(item.median,lang)} <small>${escape(unit(item,lang))}</small></strong></div><div><span>${escape(copy.range)}</span><strong>${format(item.min,lang)}–${format(item.max,lang)} <small>${escape(unit(item,lang))}</small></strong></div></div><p class="cv-hint">${escape(copy.hint)}</p><div class="cv-plot"><div class="cv-axis" aria-hidden="true"><span>${format(maximum,lang)}</span><span>0</span></div><div class="cv-bars" role="group" aria-label="${escape(copy.groupChart(copy.names[item.language]||item.language))}" style="--cv-count:${Math.max(1,rows.length)}">${rows.map((entry,index)=>`<button class="cv-bar" type="button" data-cv-row="${escape(entry.id)}" aria-pressed="${entry.id===row?.id}" aria-label="${escape(copy.rowLabel(format(entry.value,lang),unit(item,lang)))}" style="--cv-ratio:${Math.min(1,safeNumber(entry.value)/maximum)};--cv-delay:${Math.min(index*12,180)}ms"><span class="cv-bar-fill" aria-hidden="true"></span><span class="cv-bar-mark" aria-hidden="true"></span></button>`).join('')}</div></div><p class="cv-axis-note">${escape(copy[item.unit==='han'?'axisHan':'axisWords'])}</p><div class="cv-selected-text" role="status" aria-live="polite" aria-atomic="true">${detail(item,row,lang)}</div><details class="cv-counting"><summary>${escape(copy.method)}</summary><p>${escape(copy.methodText)}</p></details>`;
 }
 function render(value='es'){
  const lang=language(value);
  if(!groups().length)return '';
  return `<div class="cv-panel" data-cv-lang="${lang}">${panelContent(lang)}</div>`;
 }
 function mount(target,value='es'){
  const panel=target?.matches?.('.cv-panel')?target:target?.querySelector?.('.cv-panel');
  if(!panel||mounted.has(panel))return;
  mounted.add(panel);
  const lang=language(value);
  const select=id=>{
   const item=group(),row=item?.rows?.find(entry=>entry.id===id);if(!row)return;
   state.selected[item.language]=id;
   panel.querySelectorAll('[data-cv-row]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cvRow===id)));
   panel.querySelector('.cv-selected-text').innerHTML=detail(item,row,lang);
  };
  panel.addEventListener('click',event=>{
   const choice=event.target.closest('[data-cv-language]');
   if(choice){state.language=choice.dataset.cvLanguage;panel.innerHTML=panelContent(lang);panel.querySelector(`[data-cv-language="${state.language}"]`)?.focus({preventScroll:true});return;}
   const bar=event.target.closest('[data-cv-row]');if(bar)select(bar.dataset.cvRow);
  });
  panel.addEventListener('pointerover',event=>{const bar=event.target.closest('[data-cv-row]');if(bar&&!bar.contains(event.relatedTarget))select(bar.dataset.cvRow);});
  panel.addEventListener('focusin',event=>{const bar=event.target.closest('[data-cv-row]');if(bar)select(bar.dataset.cvRow);});
  panel.addEventListener('keydown',event=>{
   const bar=event.target.closest('[data-cv-row]');
   if(!bar||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
   const buttons=[...panel.querySelectorAll('[data-cv-row]')],index=buttons.indexOf(bar);
   const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(['ArrowLeft','ArrowDown'].includes(event.key)?-1:1)+buttons.length)%buttons.length;
   event.preventDefault();buttons[next]?.focus({preventScroll:true});
  });
 }
 window.CorpusVolume=Object.freeze({summary,render,mount});
})();
