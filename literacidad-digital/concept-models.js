(() => {
 'use strict';
 let serial=0;
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const COPY={
  zh:{
   dimensions:{kicker:'四个相互联系的维度',title:'从四个方向，理解同一种参与。',hint:'点选一个维度，看看它怎样在实践中体现。',center:'素养',centerSub:'社会实践中的整体参与状态',detailLabel:'把目光转向',exampleLabel:'以借助 AI 审查译文为例',note:'同一项实践，可以从这四个维度同时观察。',items:[
    {name:'实践与操作',short:'实践与操作',text:'素养与实际行动相连。人需要使用资源、处理问题、参与活动；具体能力让素养的部分表现变得可观察，却不能穷尽整个参与状态。',example:'怎样组织原文与译文、发出审查指令，再把输出用于实际修改？'},
    {name:'社会与情境',short:'社会与情境',text:'行动总是发生在人与人的关系、制度和惯例中。做什么、怎样做才合适，取决于参与者、目的及具体条件。',example:'译文将交给谁？客户要求、职业规范与团队分工怎样影响审查？'},
    {name:'多模态的意义',short:'多模态性',text:'意义可以通过语言、图像、数据、声音和界面等资源来组织。关键在于理解这些资源如何配合、呈现和改变意义。',example:'原文、译文、批注与界面的排列，怎样帮助或干扰我们理解问题？'},
    {name:'批判与变革',short:'批判与变革',text:'我们既判断信息，也追问惯例背后的价值、利益与权力安排，并考虑介入或改变实践的可能。',example:'谁决定什么算“好翻译”？哪些偏差被忽视，结果由谁负责，流程能怎样改善？'}]},
   bridges:{kicker:'一个开放的桥梁模型',title:'理论提出问题，实践也改变理论。',hint:'选择一个领域，观察同一组理论坐标如何获得具体意义。',theoryLabel:'构成性坐标',theoryTitle:'数字素养',theoryText:'帮助我们理解数字实践的结构。',coordinates:['实践与操作','社会与情境','多模态性','批判与变革'],outLabel:'再情境化',outText:'把理论问题带入具体领域',backLabel:'反思反馈',backText:'由实践经验修订理论理解',domainLabel:'领域中的具体配置',questionsLabel:'理论 → 领域',questionsTitle:'在这里，四个维度会问什么？',feedbackLabel:'领域 → 理论',feedbackTitle:'实践又可能让理论追问什么？',openNote:'各领域在实践中重新回答四个维度提出的问题，也通过经验与反思丰富数字素养的理解。新的领域还会不断出现。',items:[
    {name:'信息素养',context:'以为翻译任务寻找和判断资料为例。',questions:['怎样找到、评价和组织与任务有关的信息？','谁需要这些信息，什么来源和规则被认为可信？','语言、图表与检索界面怎样影响信息的意义？','哪些声音被看见或排除，信息服务了谁？'],feedback:'当资料获取受到平台排序、资源权限或语言不平等的影响时，我们应怎样重新理解“能够参与”？'},
    {name:'机器翻译素养',context:'以决定是否采用一份机器译文为例。',questions:['怎样选择系统、检查输出并作出采用决定？','翻译目的、客户需求和专业规范提出了什么要求？','源文、译文、语料和质量指标怎样帮助解释结果？','错误会带来什么后果，采用系统的责任由谁承担？'],feedback:'当机器译文看起来流畅却不适合用途时，“能操作”与“会判断”之间的关系需要怎样重新理解？'},
    {name:'数据素养',context:'以准备和使用翻译数据为例。',questions:['怎样选择、清理、评价和使用数据？','谁拥有数据，谁可以访问，谁的劳动被使用？','文本、标注和元数据怎样组织我们对数据的理解？','哪些偏差、安全风险和不公平安排需要被改变？'],feedback:'训练数据的来源和劳动条件，怎样改变我们对数字参与中的权利、责任与公平的理解？'},
    {name:'AI 素养',context:'以把 AI 用于一项语言服务任务为例。',questions:['怎样理解系统的用途、限度并与它协作？','谁决定任务目标，哪些判断可以交给系统？','提示、示例、界面和生成内容怎样共同组织意义？','怎样检查偏差、幻觉、不透明性与责任归属？'],feedback:'当内容来源和责任难以追溯时，数字素养中的批判性需要增加哪些新的问题？'},
    {name:'提示素养',context:'以多轮调整 AI 的翻译回应为例。',questions:['怎样表达要求、选择示例并逐轮调整？','谁的目的和角色决定了这次交互的方向？','指令、示例及回答格式怎样影响意义的生成？','何时需要核查、拒绝或改写回答，依据是什么？'],feedback:'当表达的效果依赖多轮交互和不确定的输出时，“会表达”还需要包含怎样的判断与责任？'}]}
  },
  es:{
   dimensions:{kicker:'CUATRO DIMENSIONES RELACIONADAS',title:'Cuatro miradas sobre una misma participación.',hint:'Elige una dimensión para explorar cómo se manifiesta en la práctica.',center:'Literacidad',centerSub:'Condición integral de participación',detailLabel:'UNA MIRADA HACIA',exampleLabel:'Al revisar una traducción con apoyo de IA',note:'Las cuatro dimensiones permiten observar conjuntamente una misma práctica.',items:[
    {name:'Práctica y operación',short:'Práctica y operación',text:'La literacidad está vinculada a la acción: usar recursos, abordar problemas y participar en actividades. Las competencias concretas hacen visibles algunas manifestaciones de la literacidad, sin agotarla.',example:'¿Cómo organizamos el original y la traducción, solicitamos una revisión y utilizamos la respuesta para modificar el texto?'},
    {name:'Sociedad y contexto',short:'Sociedad y contexto',text:'Actuamos en relaciones sociales, instituciones y convenciones. Lo que hacemos y lo que resulta adecuado depende de los participantes, los propósitos y las condiciones concretas.',example:'¿A quién llegará la traducción? ¿Cómo influyen el encargo, las normas profesionales y el reparto del trabajo?'},
    {name:'Sentido multimodal',short:'Multimodalidad',text:'El sentido se organiza mediante lengua, imágenes, datos, sonidos e interfaces. Importa comprender cómo estos recursos se combinan, representan y transforman significados.',example:'¿Cómo ayudan o dificultan la interpretación el original, la traducción, las anotaciones y su disposición en la interfaz?'},
    {name:'Crítica y transformación',short:'Crítica y transformación',text:'Además de juzgar la información, examinamos los valores, intereses y relaciones de poder de una práctica, y consideramos cómo intervenir o transformarla.',example:'¿Quién decide qué cuenta como una buena traducción? ¿Qué sesgos se omiten, quién responde por el resultado y qué podría cambiar?'}]},
   bridges:{kicker:'UN MODELO ABIERTO DE PUENTES',title:'La teoría plantea preguntas. La práctica también transforma la teoría.',hint:'Elige un ámbito y observa cómo unas mismas coordenadas adquieren un sentido concreto.',theoryLabel:'COORDENADAS CONSTITUTIVAS',theoryTitle:'Literacidad digital',theoryText:'Ayudan a comprender la estructura de las prácticas digitales.',coordinates:['Práctica y operación','Sociedad y contexto','Multimodalidad','Crítica y transformación'],outLabel:'Recontextualización',outText:'Llevar las preguntas al ámbito concreto',backLabel:'Retorno reflexivo',backText:'Revisar la teoría desde la experiencia',domainLabel:'CONFIGURACIÓN DE DOMINIO',questionsLabel:'TEORÍA → ÁMBITO',questionsTitle:'¿Qué preguntan aquí las cuatro dimensiones?',feedbackLabel:'ÁMBITO → TEORÍA',feedbackTitle:'¿Qué podría llevar la práctica a replantear?',openNote:'Cada ámbito responde de nuevo a las preguntas de las cuatro dimensiones y enriquece la comprensión de la literacidad digital con su experiencia y reflexión. Seguirán surgiendo nuevos ámbitos.',items:[
    {name:'Literacidad informacional',context:'Por ejemplo, buscar y valorar documentación para traducir.',questions:['¿Cómo encontrar, evaluar y organizar información pertinente?','¿Quién la necesita y qué fuentes y normas se consideran fiables?','¿Cómo influyen la lengua, los gráficos y la interfaz de búsqueda en su significado?','¿Qué voces se muestran o se excluyen, y a quién sirve la información?'],feedback:'Cuando el acceso depende de la clasificación de una plataforma, de permisos o de desigualdades lingüísticas, ¿cómo debemos repensar la posibilidad de participar?'},
    {name:'Literacidad en traducción automática',context:'Por ejemplo, decidir si se utiliza una traducción automática.',questions:['¿Cómo elegir un sistema, revisar su salida y decidir si se adopta?','¿Qué exigen el propósito, el cliente y las normas profesionales?','¿Cómo ayudan el original, la traducción, los corpus y los indicadores a interpretar el resultado?','¿Qué consecuencias tienen los errores y quién asume la responsabilidad?'],feedback:'Si una traducción parece fluida pero no responde a su finalidad, ¿cómo debemos reconsiderar la relación entre saber operar y saber juzgar?'},
    {name:'Literacidad de datos',context:'Por ejemplo, preparar y utilizar datos de traducción.',questions:['¿Cómo seleccionar, limpiar, evaluar y utilizar los datos?','¿A quién pertenecen, quién accede y de quién es el trabajo utilizado?','¿Cómo organizan los textos, las anotaciones y los metadatos nuestra interpretación?','¿Qué sesgos, riesgos de seguridad o desigualdades requieren cambios?'],feedback:'¿Cómo modifican el origen de los datos de entrenamiento y sus condiciones de trabajo nuestra comprensión de los derechos, la responsabilidad y la equidad en la participación digital?'},
    {name:'Literacidad en IA',context:'Por ejemplo, incorporar IA a una tarea de servicios lingüísticos.',questions:['¿Cómo comprender sus usos y límites y colaborar con el sistema?','¿Quién decide los objetivos y qué juicios pueden delegarse?','¿Cómo organizan conjuntamente el sentido los prompts, ejemplos, interfaces y resultados?','¿Cómo examinar sesgos, alucinaciones, opacidad y atribución de responsabilidades?'],feedback:'Si resulta difícil rastrear las fuentes o atribuir responsabilidades, ¿qué nuevas preguntas necesita incorporar la dimensión crítica de la literacidad digital?'},
    {name:'Literacidad en prompts',context:'Por ejemplo, ajustar una respuesta de traducción mediante varias interacciones.',questions:['¿Cómo expresar requisitos, elegir ejemplos y revisar la petición?','¿Qué propósitos y roles orientan esta interacción?','¿Cómo influyen las instrucciones, los ejemplos y el formato de respuesta en el significado?','¿Cuándo verificar, rechazar o reformular una respuesta, y con qué criterios?'],feedback:'Cuando la expresión depende de varias interacciones y de resultados inciertos, ¿qué formas de juicio y responsabilidad debe incluir saber expresarse?'}]}
  },
  en:{
   dimensions:{kicker:'FOUR INTERRELATED DIMENSIONS',title:'Four ways to understand the same participation.',hint:'Choose a dimension to explore how it takes shape in practice.',center:'Literacy',centerSub:'A holistic condition of participation',detailLabel:'TURNING OUR ATTENTION TO',exampleLabel:'When reviewing a translation with AI support',note:'The four dimensions offer connected perspectives on the same practice.',items:[
    {name:'Practice and operation',short:'Practice and operation',text:'Literacy is connected to action: using resources, addressing problems and participating in activities. Specific competencies make some manifestations of literacy visible, without exhausting it.',example:'How do we organise the source and translation, request a review and use the response to revise the text?'},
    {name:'Society and context',short:'Society and context',text:'We act within social relationships, institutions and conventions. What we do and what counts as appropriate depend on the people, purposes and particular conditions involved.',example:'Who will receive the translation? How do the brief, professional norms and division of work shape the review?'},
    {name:'Multimodal meaning',short:'Multimodality',text:'Meaning is organised through language, images, data, sound and interfaces. We need to understand how these resources work together to represent and transform meaning.',example:'How do the source, translation, annotations and their arrangement on screen help or hinder our interpretation?'},
    {name:'Critique and transformation',short:'Critique and transformation',text:'Alongside judging information, we examine the values, interests and power relations within a practice, and consider how to intervene in or transform it.',example:'Who decides what counts as a good translation? Which biases go unnoticed, who is responsible and what could change?'}]},
   bridges:{kicker:'AN OPEN MODEL OF BRIDGES',title:'Theory asks questions. Practice also changes theory.',hint:'Choose a domain to see how the same coordinates take on a specific meaning.',theoryLabel:'CONSTITUTIVE COORDINATES',theoryTitle:'Digital literacy',theoryText:'They help us understand the structure of digital practices.',coordinates:['Practice and operation','Society and context','Multimodality','Critique and transformation'],outLabel:'Recontextualisation',outText:'Bring theoretical questions into a domain',backLabel:'Reflective feedback',backText:'Reconsider theory through experience',domainLabel:'DOMAIN CONFIGURATION',questionsLabel:'THEORY → DOMAIN',questionsTitle:'What do the four dimensions ask here?',feedbackLabel:'DOMAIN → THEORY',feedbackTitle:'What might practice prompt us to reconsider?',openNote:'Each domain answers the questions raised by all four dimensions and enriches our understanding of digital literacy through experience and reflection. New domains will continue to emerge.',items:[
    {name:'Information literacy',context:'For example, finding and evaluating information for a translation.',questions:['How do we find, evaluate and organise relevant information?','Who needs it, and which sources and conventions are considered trustworthy?','How do language, graphics and search interfaces influence meaning?','Whose voices appear or are excluded, and whose interests does the information serve?'],feedback:'When access depends on platform rankings, permissions or language inequalities, how should we rethink what it means to be able to participate?'},
    {name:'Machine translation literacy',context:'For example, deciding whether to use a machine translation.',questions:['How do we choose a system, examine its output and decide whether to use it?','What do the purpose, client and professional norms require?','How do the source, translation, corpora and quality indicators help us interpret the result?','What consequences do errors have, and who takes responsibility?'],feedback:'If a translation sounds fluent but does not serve its purpose, how should we reconsider the relationship between knowing how to operate and knowing how to judge?'},
    {name:'Data literacy',context:'For example, preparing and using translation data.',questions:['How do we select, clean, evaluate and use data?','Who owns the data, who has access and whose work is being used?','How do texts, annotations and metadata organise our interpretation?','Which biases, security risks or unequal arrangements call for change?'],feedback:'How do the origins of training data and the conditions of the work behind them change our understanding of rights, responsibility and fairness in digital participation?'},
    {name:'AI literacy',context:'For example, using AI in a language-service task.',questions:['How do we understand the system’s uses and limits and work with it?','Who decides the goals, and which judgements can be delegated?','How do prompts, examples, interfaces and generated content jointly shape meaning?','How do we examine bias, hallucinations, opacity and responsibility?'],feedback:'When sources and responsibility are difficult to trace, what new questions must the critical dimension of digital literacy address?'},
    {name:'Prompt literacy',context:'For example, refining a translation response over several interactions.',questions:['How do we express requirements, select examples and refine requests?','Whose purposes and roles guide this interaction?','How do instructions, examples and response formats influence meaning?','When should we verify, reject or reformulate a response, and on what grounds?'],feedback:'When expression depends on repeated interactions and uncertain outputs, what forms of judgement and responsibility must knowing how to express oneself include?'}]}
  }
 };

 const icons=[
  '<path d="M5 5h12v12H5z"/><path d="m14 14 7 3-4 1-1 4z"/>',
  '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m10.5 7.5-4 8M13.5 7.5l4 8M8 18h8"/>',
  '<path d="M3 5h9M7.5 5v12M3 17h9"/><rect x="15" y="10" width="7" height="9" rx="1"/><path d="m15 16 2-2 2 2 3-3"/>',
  '<path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5M18 3v4h-4M6 21v-4h4"/><path d="M12 7v6M12 16v1"/>'
 ];
 const icon=i=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[i]}</svg>`;
 const OVERVIEW={
  zh:{label:'数字素养与领域素养的整体关系',open:'其他领域……',dimensions:['实践性','情境性','多模态性','批判性'],out:'理论 → 领域',back:'领域 → 理论',selected:'走进这个领域'},
  es:{label:'Relación global entre la literacidad digital y las literacidades de ámbito',open:'Otros ámbitos…',dimensions:['Práctica','Contexto','Multimodalidad','Crítica'],out:'Teoría → ámbito',back:'Ámbito → teoría',selected:'Explorar este ámbito'},
  en:{label:'Digital literacy and domain literacies: the whole model',open:'Further domains…',dimensions:['Practice','Context','Multimodality','Critique'],out:'Theory → domain',back:'Domain → theory',selected:'Explore this domain'}
 };
 const globalMap=(copy,lang,id)=>{
  const t=OVERVIEW[lang];
  const paths=[
   ['M474 156L474 88','M486 88L486 156'],
   ['M625 244Q655 220 684 207','M684 194Q650 209 619 233'],
   ['M625 376Q653 390 684 408','M684 421Q650 407 619 387'],
   ['M335 376Q307 390 276 408','M276 421Q310 407 341 387'],
   ['M335 244Q305 220 276 207','M276 194Q310 209 341 233'],
   ['M474 464L474 532','M486 532L486 464']
  ];
  const direction=(back)=>`<div class="cm-global-direction ${back?'cm-global-back':'cm-global-out'}"><span>${escape(back?t.back:t.out)}</span><strong>${escape(back?copy.backLabel:copy.outLabel)}</strong><small>${escape(back?copy.backText:copy.outText)}</small></div>`;
  return `<div class="cm-overview-legend">${direction(false)}${direction(true)}</div><div class="cm-global-map" role="group" aria-label="${escape(t.label)}">
   <svg class="cm-global-lines" viewBox="0 0 960 620" aria-hidden="true" focusable="false"><defs><marker id="${id}-out" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L8 5L1 9"/></marker><marker id="${id}-back" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L8 5L1 9"/></marker></defs>${paths.map((pair,i)=>`<g class="cm-global-link ${i===0?'is-active':''} ${i===5?'cm-open-link':''}" data-cm-link="${i}"><path class="cm-global-out-line" d="${pair[0]}" marker-end="url(#${id}-out)"/><path class="cm-global-back-line" d="${pair[1]}" marker-end="url(#${id}-back)"/></g>`).join('')}</svg>
   <div class="cm-global-center"><div class="cm-global-core"><span>${escape(copy.theoryTitle)}</span></div>${t.dimensions.map((x,i)=>`<span class="cm-global-coordinate cm-global-coordinate-${i}">${escape(x)}</span>`).join('')}</div>
   <div class="cm-global-mobile-arrows" aria-hidden="true"><span>↓</span><span>↑</span></div>
   ${copy.items.map((item,i)=>`<button class="cm-global-node cm-global-node-${i}" type="button" data-cm-choice="${i}" aria-pressed="${i===0}" aria-controls="${id}-detail"><span>${escape(item.name)}</span><small aria-hidden="true">↔</small></button>`).join('')}
   <div class="cm-global-open"><span>${escape(t.open)}</span></div>
  </div>`;
 };
 const dimPanel=(copy,i)=>`<span class="cm-eyebrow">${escape(copy.detailLabel)}</span><h4>${escape(copy.items[i].name)}</h4><p class="cm-detail-text">${escape(copy.items[i].text)}</p><div class="cm-example"><span>${escape(copy.exampleLabel)}</span><p>${escape(copy.items[i].example)}</p></div>`;
 const bridgePanel=(copy,i)=>`<div class="cm-bridge-questions"><span class="cm-eyebrow">${escape(copy.questionsLabel)}</span><h4>${escape(copy.questionsTitle)}</h4><div class="cm-question-grid">${copy.items[i].questions.map((question,j)=>`<div class="cm-question"><span class="cm-question-coordinate">${icon(j)}${escape(copy.coordinates[j])}</span><p>${escape(question)}</p></div>`).join('')}</div></div><div class="cm-bridge-feedback"><span class="cm-eyebrow">${escape(copy.feedbackLabel)}</span><h4>${escape(copy.feedbackTitle)}</h4><p>${escape(copy.items[i].feedback)}</p></div>`;

 function render(kind,language='es'){
  const lang=COPY[language]?language:'es',copy=COPY[lang][kind];
  if(!copy)return '';
  const id=`concept-model-${++serial}`;
  const header=`<header class="cm-heading"><span class="cm-eyebrow">${escape(copy.kicker)}</span><h3 id="${id}-title">${escape(copy.title)}</h3><p>${escape(copy.hint)}</p></header>`;
  if(kind==='dimensions')return `<figure class="cm cm-dimensions" data-cm-kind="dimensions" data-cm-lang="${lang}" aria-labelledby="${id}-title">${header}<div class="cm-dim-layout"><div class="cm-orbit" role="group" aria-label="${escape(copy.kicker)}"><svg class="cm-ring" viewBox="0 0 480 440" aria-hidden="true" focusable="false"><circle cx="240" cy="220" r="154"/><circle class="cm-ring-inner" cx="240" cy="220" r="111"/>${['M240 66a154 154 0 0 1 154 154','M394 220a154 154 0 0 1-154 154','M240 374A154 154 0 0 1 86 220','M86 220A154 154 0 0 1 240 66'].map((d,i)=>`<path data-cm-arc="${i}" class="${i===0?'is-active':''}" d="${d}"/>`).join('')}</svg><div class="cm-orbit-center"><span>${escape(copy.center)}</span><p>${escape(copy.centerSub)}</p></div>${copy.items.map((item,i)=>`<button class="cm-dimension cm-dimension-${i}" type="button" data-cm-choice="${i}" aria-pressed="${i===0}" aria-controls="${id}-detail">${icon(i)}<span>${escape(item.short)}</span></button>`).join('')}</div><div id="${id}-detail" class="cm-dim-detail" aria-live="polite" aria-atomic="true">${dimPanel(copy,0)}</div></div><figcaption><p>${escape(copy.note)}</p></figcaption></figure>`;
  return `<figure class="cm cm-bridges" data-cm-kind="bridges" data-cm-lang="${lang}" aria-labelledby="${id}-title">${header}${globalMap(copy,lang,id)}<div class="cm-selected-domain"><span class="cm-eyebrow">${escape(OVERVIEW[lang].selected)}</span><h4 data-cm-domain-title>${escape(copy.items[0].name)}</h4><p data-cm-domain-context>${escape(copy.items[0].context)}</p></div><div id="${id}-detail" class="cm-bridge-detail" aria-live="polite" aria-atomic="true">${bridgePanel(copy,0)}</div><figcaption><p>${escape(copy.openNote)}</p></figcaption></figure>`;
 }

 function mount(root,language){
  if(!root?.querySelectorAll)return;
  const models=[...(root.matches?.('[data-cm-kind]')?[root]:[]),...root.querySelectorAll('[data-cm-kind]')];
  models.forEach(model=>{
   if(model.dataset.cmMounted)return;
   model.dataset.cmMounted='true';
   const lang=COPY[language]?language:model.dataset.cmLang||'es',kind=model.dataset.cmKind,copy=COPY[lang][kind];
   const buttons=[...model.querySelectorAll('[data-cm-choice]')];
   const select=index=>{
    if(!copy.items[index])return;
    buttons.forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.cmChoice)===index));
    if(kind==='dimensions'){
     model.querySelectorAll('[data-cm-arc]').forEach(path=>path.classList.toggle('is-active',Number(path.dataset.cmArc)===index));
     model.querySelector('.cm-dim-detail').innerHTML=dimPanel(copy,index);
    }else{
     model.querySelectorAll('[data-cm-link]').forEach(path=>path.classList.toggle('is-active',Number(path.dataset.cmLink)===index));
     model.querySelector('[data-cm-domain-title]').textContent=copy.items[index].name;
     model.querySelector('[data-cm-domain-context]').textContent=copy.items[index].context;
     model.querySelector('.cm-bridge-detail').innerHTML=bridgePanel(copy,index);
    }
   };
   model.addEventListener('click',event=>{const button=event.target.closest('[data-cm-choice]');if(button&&model.contains(button))select(Number(button.dataset.cmChoice));});
   model.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-cm-choice]');
    if(!button||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    let index=buttons.indexOf(button);if(index<0)return;
    index=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+buttons.length)%buttons.length;
    event.preventDefault();select(index);buttons[index].focus({preventScroll:true});
   });
  });
 }
 window.ConceptModels=Object.freeze({render,mount});
})();
