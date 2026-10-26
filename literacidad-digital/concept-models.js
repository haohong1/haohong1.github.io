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
   bridges:{kicker:'翻译学视角下的桥梁模型',title:'从数字素养，走进翻译实践。',hint:'选择一种领域素养，沿着两条路径，看理论与翻译实践怎样相互推动。',theoryLabel:'构成性坐标',theoryTitle:'数字素养',theoryText:'帮助我们理解数字实践的结构。',coordinates:['实践与操作','社会与情境','多模态性','批判与变革'],outLabel:'再情境化',outText:'把理论问题带入具体领域',backLabel:'反思反馈',backText:'由实践经验修订理论理解',domainLabel:'领域中的具体配置',questionsLabel:'理论 → 领域',questionsTitle:'在这里，四个维度会问什么？',feedbackLabel:'领域 → 理论',feedbackTitle:'实践又可能让理论追问什么？',openNote:'各领域在实践中重新回答四个维度提出的问题，也通过经验与反思丰富数字素养的理解。新的领域还会不断出现。',items:[
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
   bridges:{kicker:'UN MODELO DE PUENTES DESDE LA TRADUCTOLOGÍA',title:'De la literacidad digital a la práctica traductora.',hint:'Elige una literacidad de ámbito y recorre las dos vías que conectan la teoría con la práctica traductora.',theoryLabel:'COORDENADAS CONSTITUTIVAS',theoryTitle:'Literacidad digital',theoryText:'Ayudan a comprender la estructura de las prácticas digitales.',coordinates:['Práctica y operación','Sociedad y contexto','Multimodalidad','Crítica y transformación'],outLabel:'Recontextualización',outText:'Llevar las preguntas al ámbito concreto',backLabel:'Retorno reflexivo',backText:'Revisar la teoría desde la experiencia',domainLabel:'CONFIGURACIÓN DE DOMINIO',questionsLabel:'TEORÍA → ÁMBITO',questionsTitle:'¿Qué preguntan aquí las cuatro dimensiones?',feedbackLabel:'ÁMBITO → TEORÍA',feedbackTitle:'¿Qué podría llevar la práctica a replantear?',openNote:'Cada ámbito responde de nuevo a las preguntas de las cuatro dimensiones y enriquece la comprensión de la literacidad digital con su experiencia y reflexión. Seguirán surgiendo nuevos ámbitos.',items:[
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
   bridges:{kicker:'A BRIDGE MODEL FROM TRANSLATION STUDIES',title:'From digital literacy into translation practice.',hint:'Choose a domain literacy and follow the two paths connecting theory and translation practice.',theoryLabel:'CONSTITUTIVE COORDINATES',theoryTitle:'Digital literacy',theoryText:'They help us understand the structure of digital practices.',coordinates:['Practice and operation','Society and context','Multimodality','Critique and transformation'],outLabel:'Recontextualisation',outText:'Bring theoretical questions into a domain',backLabel:'Reflective feedback',backText:'Reconsider theory through experience',domainLabel:'DOMAIN CONFIGURATION',questionsLabel:'THEORY → DOMAIN',questionsTitle:'What do the four dimensions ask here?',feedbackLabel:'DOMAIN → THEORY',feedbackTitle:'What might practice prompt us to reconsider?',openNote:'Each domain answers the questions raised by all four dimensions and enriches our understanding of digital literacy through experience and reflection. New domains will continue to emerge.',items:[
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
  zh:{label:'从翻译学视角理解数字素养与领域素养的双向联系',open:'更多领域，继续展开',dimensions:['实践与操作','社会与情境','多模态性','批判与变革'],origin:'理解数字实践的四个维度',fields:'翻译实践中的领域素养',selected:'走进这个领域',both:'双向联系',out:'理论进入实践',back:'实践反馈理论',controls:'选择联系方向',pause:'暂停流动',play:'播放流动',reduced:'静态显示',outLabel:'再情境化',backLabel:'反思反馈',notes:{both:'从翻译学出发，理论在具体实践中获得意义，实践经验也会改变我们理解数字素养的方式。',out:'把四个维度带入翻译实践，在具体对象、任务与关系中重新回答它们提出的问题。',back:'从翻译实践中的经验与问题出发，修订、扩展并深化对数字素养的理解。'}},
  es:{label:'La relación entre literacidad digital y literacidades de ámbito desde la traductología',open:'Otros ámbitos por explorar',dimensions:['Práctica y operación','Sociedad y contexto','Multimodalidad','Crítica y transformación'],origin:'Cuatro dimensiones de la práctica digital',fields:'Literacidades en la práctica traductora',selected:'Explorar este ámbito',both:'Ambas vías',out:'Hacia la práctica',back:'Retorno a la teoría',controls:'Elegir la dirección del puente',pause:'Pausar el flujo',play:'Activar el flujo',reduced:'Vista estática',outLabel:'Recontextualización',backLabel:'Retorno reflexivo',notes:{both:'Desde la traductología, la teoría adquiere sentido en prácticas concretas y la experiencia transforma nuestra comprensión de la literacidad digital.',out:'Llevar las cuatro dimensiones a la práctica traductora y responder a sus preguntas en objetos, tareas y relaciones concretas.',back:'Partir de las experiencias y los problemas de la práctica traductora para revisar, ampliar y profundizar la comprensión de la literacidad digital.'}},
  en:{label:'Digital literacy and domain literacies from a translation studies perspective',open:'Further domains to explore',dimensions:['Practice and operation','Society and context','Multimodality','Critique and transformation'],origin:'Four dimensions of digital practice',fields:'Literacies in translation practice',selected:'Explore this domain',both:'Both directions',out:'Into practice',back:'Back to theory',controls:'Choose the direction of the bridge',pause:'Pause flow',play:'Play flow',reduced:'Static view',outLabel:'Recontextualisation',backLabel:'Reflective feedback',notes:{both:'From a translation studies perspective, theory gains meaning in specific practices, while experience reshapes our understanding of digital literacy.',out:'Bring the four dimensions into translation practice and answer their questions through particular objects, tasks and relationships.',back:'Start from experiences and problems in translation practice to revise, extend and deepen our understanding of digital literacy.'}}
 };
 const weaveState={flow:'both',userPaused:false,index:0};
 const globalMap=(copy,lang,id)=>{
  const t=OVERVIEW[lang];
  return `<div class="cm-weave-toolbar"><div class="cm-flow-choices" role="group" aria-label="${escape(t.controls)}">${['both','out','back'].map(mode=>`<button type="button" data-cm-flow="${mode}" aria-pressed="${mode===weaveState.flow}">${escape(t[mode])}</button>`).join('')}</div><button type="button" class="cm-motion-toggle" data-cm-motion aria-pressed="false"><span data-cm-motion-icon aria-hidden="true">Ⅱ</span><span data-cm-motion-label>${escape(t.pause)}</span></button></div>
   <div class="cm-flow-legend"><span class="cm-flow-key cm-flow-key-out"><i aria-hidden="true">→</i>${escape(t.outLabel)}</span><span class="cm-flow-key cm-flow-key-back"><i aria-hidden="true">←</i>${escape(t.backLabel)}</span></div>
   <div class="cm-weave-scene" role="group" aria-label="${escape(t.label)}">
    <svg class="cm-weave-wires" aria-hidden="true" focusable="false"><defs><marker id="${id}-out" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L8 5L1 9"/></marker><marker id="${id}-back" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L8 5L1 9"/></marker></defs>${[0,1,2,3,4,5].map(i=>`<g class="cm-weave-link ${i===weaveState.index?'is-active':''} ${i===5?'cm-weave-open-link':''}" data-cm-link="${i}"><path class="cm-wire cm-wire-out" data-cm-path="out" marker-end="url(#${id}-out)"/><path class="cm-wire cm-wire-back" data-cm-path="back" marker-end="url(#${id}-back)"/><path class="cm-flow-stroke cm-flow-out" data-cm-path="out" pathLength="100"/><path class="cm-flow-stroke cm-flow-back" data-cm-path="back" pathLength="100"/></g>`).join('')}</svg>
    <div class="cm-weave-origin"><span class="cm-weave-origin-label">${escape(t.origin)}</span><h4>${escape(copy.theoryTitle)}</h4><div class="cm-weave-dimensions">${t.dimensions.map((x,i)=>`<span>${icon(i)}${escape(x)}</span>`).join('')}</div><span class="cm-weave-origin-port" aria-hidden="true"></span></div>
    <div class="cm-weave-fields"><span class="cm-eyebrow">${escape(t.fields)}</span>${copy.items.map((item,i)=>`<button class="cm-field-node" type="button" data-cm-choice="${i}" data-cm-endpoint="${i}" aria-pressed="${i===weaveState.index}" aria-controls="${id}-detail"><span class="cm-field-index" aria-hidden="true">0${i+1}</span><span>${escape(item.name)}</span><span class="cm-field-indicator" aria-hidden="true">↔</span></button>`).join('')}<div class="cm-field-open" data-cm-endpoint="5"><span aria-hidden="true">＋</span>${escape(t.open)}</div></div>
   </div><p class="cm-flow-note" data-cm-flow-note aria-live="polite">${escape(t.notes[weaveState.flow])}</p>`;
 };
 const modelObservers=new Map();
 function mountWeave(model,copy,lang){
  const t=OVERVIEW[lang],scene=model.querySelector('.cm-weave-scene'),origin=model.querySelector('.cm-weave-origin'),svg=scene.querySelector('svg'),motion=model.querySelector('[data-cm-motion]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  model.dataset.cmFlow=weaveState.flow;model.dataset.cmPaused=String(weaveState.userPaused||reduced.matches);model.dataset.cmVisible='false';
  const motionLabel=()=>{const paused=model.dataset.cmPaused==='true';motion.setAttribute('aria-pressed',String(paused));motion.querySelector('[data-cm-motion-label]').textContent=reduced.matches?t.reduced:paused?t.play:t.pause;motion.querySelector('[data-cm-motion-icon]').textContent=paused?'▷':'Ⅱ';motion.disabled=reduced.matches;};
  motionLabel();
  const draw=()=>{
   if(!scene.isConnected)return;
   const box=scene.getBoundingClientRect(),a=origin.getBoundingClientRect(),narrow=box.width<=620;
   if(!box.width||!box.height)return;
   svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
   const x1=a.right-box.left+2,y1=a.top-box.top+a.height/2;
   scene.querySelectorAll('[data-cm-endpoint]').forEach(node=>{
    const b=node.getBoundingClientRect(),i=node.dataset.cmEndpoint,x2=(narrow?b.right:b.left)-box.left+(narrow?2:-2),y2=b.top-box.top+b.height/2,link=svg.querySelector(`[data-cm-link="${i}"]`);
    const bend=narrow?box.width-3:x1+(x2-x1)*.51;
    const out=`M${x1},${y1-4} C${bend},${y1-4} ${bend},${y2-4} ${x2},${y2-4}`;
    const back=`M${x2},${y2+4} C${bend+(narrow?7:0)},${y2+4} ${bend+(narrow?7:0)},${y1+4} ${x1},${y1+4}`;
    link.querySelectorAll('[data-cm-path="out"]').forEach(path=>path.setAttribute('d',out));link.querySelectorAll('[data-cm-path="back"]').forEach(path=>path.setAttribute('d',back));
   });
  };
  const resize=new ResizeObserver(draw);resize.observe(scene);resize.observe(origin);
  scene.querySelectorAll('[data-cm-endpoint]').forEach(node=>resize.observe(node));
  const visibility=new IntersectionObserver(entries=>{model.dataset.cmVisible=String(entries.some(entry=>entry.isIntersecting));},{threshold:.12});visibility.observe(scene);
  const preference=()=>{model.dataset.cmPaused=String(weaveState.userPaused||reduced.matches);motionLabel();};reduced.addEventListener('change',preference);
  modelObservers.set(model,()=>{resize.disconnect();visibility.disconnect();reduced.removeEventListener('change',preference);});
  model.addEventListener('click',event=>{
   const mode=event.target.closest('button[data-cm-flow]');
   if(mode){weaveState.flow=mode.dataset.cmFlow;model.dataset.cmFlow=weaveState.flow;model.querySelectorAll('button[data-cm-flow]').forEach(button=>button.setAttribute('aria-pressed',String(button===mode)));model.querySelector('[data-cm-flow-note]').textContent=t.notes[mode.dataset.cmFlow];}
   if(event.target.closest('[data-cm-motion]')){weaveState.userPaused=!weaveState.userPaused;model.dataset.cmPaused=String(weaveState.userPaused||reduced.matches);motionLabel();}
  });
  draw();
 }
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
  modelObservers.forEach((dispose,model)=>{if(!model.isConnected){dispose();modelObservers.delete(model);}});
  if(!root?.querySelectorAll)return;
  const models=[...(root.matches?.('[data-cm-kind]')?[root]:[]),...root.querySelectorAll('[data-cm-kind]')];
  models.forEach(model=>{
   if(model.dataset.cmMounted)return;
   model.dataset.cmMounted='true';
   const lang=COPY[language]?language:model.dataset.cmLang||'es',kind=model.dataset.cmKind,copy=COPY[lang][kind];
   const buttons=[...model.querySelectorAll('[data-cm-choice]')];
   if(kind==='bridges')mountWeave(model,copy,lang);
   const select=(index,animate=true)=>{
    if(!copy.items[index])return;
    buttons.forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.cmChoice)===index));
    if(kind==='dimensions'){
     model.querySelectorAll('[data-cm-arc]').forEach(path=>path.classList.toggle('is-active',Number(path.dataset.cmArc)===index));
     model.querySelector('.cm-dim-detail').innerHTML=dimPanel(copy,index);
    }else{
     weaveState.index=index;
     model.querySelectorAll('[data-cm-link]').forEach(path=>path.classList.toggle('is-active',Number(path.dataset.cmLink)===index));
     model.querySelector('[data-cm-domain-title]').textContent=copy.items[index].name;
     model.querySelector('[data-cm-domain-context]').textContent=copy.items[index].context;
     const detail=model.querySelector('.cm-bridge-detail');detail.innerHTML=bridgePanel(copy,index);
     if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)detail.animate([{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
   };
   if(kind==='bridges')select(weaveState.index,false);
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
