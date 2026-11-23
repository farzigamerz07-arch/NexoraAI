
/* NEXORA interactive chatbot preview and solution explorer.
   Demo replies are local templates; connect a server-side AI endpoint for live model responses. */
(() => {
  const knowledge = [
    {keys:['chatbot','chat bot','customer support','website assistant'], title:'AI chatbot', text:'A website or support chatbot can answer common questions, guide visitors, qualify leads and hand complex requests to your team. We can connect it with your approved FAQs, CRM and support tools. A live AI model and knowledge base need a backend connection.'},
    {keys:['workflow','automate','automation','follow up','lead management','sales'], title:'AI workflow automation', text:'We can map your process, connect the tools you already use and automate repetitive steps such as lead capture, routing, reminders, follow-ups and reporting. Human approval checkpoints can remain in the flow wherever needed.'},
    {keys:['voice','phone','call'], title:'AI voice assistant', text:'An AI voice assistant can handle inbound questions, capture caller intent, route requests and create structured follow-up tasks. Telephony, speech services and a secure backend are required for a production rollout.'},
    {keys:['health','hospital','healthcare','clinic'], title:'Healthcare AI', text:'Healthcare use cases include patient enquiry assistance, appointment workflows, document processing and internal knowledge search. Any deployment should respect patient privacy, access controls and applicable healthcare regulations.'},
    {keys:['finance','bank','banking','insurance','fintech'], title:'Banking & finance AI', text:'Financial services teams can explore customer-service copilots, document intelligence, onboarding assistance, knowledge search and controlled workflow automation—with strong auditability and data governance.'},
    {keys:['retail','ecommerce','e-commerce','shop','store'], title:'Retail & e-commerce AI', text:'Retail AI can support product discovery, order-status questions, personalized assistance, customer feedback analysis and inventory-related workflows through connected business systems.'},
    {keys:['real estate','property','estate'], title:'Real estate AI', text:'Real estate workflows can automate enquiry qualification, property matching, site-visit scheduling and follow-ups while keeping agents informed at every stage.'},
    {keys:['manufacturing','factory','production'], title:'Manufacturing AI', text:'Manufacturing use cases include operational knowledge assistants, maintenance support, quality-inspection workflows and production reporting, integrated with the systems your teams already use.'},
    {keys:['education','school','university','student'], title:'Education AI', text:'Education teams can use AI for student enquiry support, admissions workflows, learning-content discovery and administrative automation, with clear safeguards around student data.'},
    {keys:['price','pricing','cost','budget'], title:'Scoping & pricing', text:'Pricing depends on the use case, integrations, conversation volume, security requirements and whether you need a custom knowledge base or workflow. Share your goals and we can help define a practical scope.'},
    {keys:['integration','crm','website','api'], title:'Integrations', text:'The assistant can be integrated with websites, CRMs, ticketing tools, APIs and internal knowledge sources. The exact connection depends on your platform, permissions and backend architecture.'}
  ];
  const fallback = 'I can help you explore AI chatbots, voice assistants, workflow automation, custom software and industry use cases. Tell me a little about your business and the task you want to improve, and I’ll point you in the right direction.';
  function answer(message) {
    const q=message.toLowerCase();
    const match=knowledge.find(item=>item.keys.some(key=>q.includes(key)));
    if(match) return match.text;
    if(/\b(hi|hello|hey|good morning|good afternoon)\b/.test(q)) return 'Hello! Great to meet you. What kind of business do you run, and what would you like AI to help you achieve?';
    if(q.includes('nexora')||q.includes('what do you do')||q.includes('services')) return 'NEXORA.AI designs and builds AI solutions, intelligent automation, custom software and connected digital experiences. We can help from discovery and solution design through engineering and integration.';
    if(q.includes('contact')||q.includes('talk')||q.includes('meeting')||q.includes('demo')) return 'Absolutely. Share your name, business email and a short description through our contact page, and the team can follow up. Use the “Discuss this solution” link to get started.';
    return fallback;
  }
  function addMessage(container, message, who) {
    const row=document.createElement('div'); row.className='chat-message '+who;
    if(who==='assistant'){const avatar=document.createElement('span');avatar.className='message-avatar';avatar.textContent='✳';row.appendChild(avatar);}
    const bubble=document.createElement('div');bubble.className='message-bubble';
    const label=document.createElement('small');label.textContent=who==='user'?'YOU':'NEXORA INTELLIGENCE';
    const p=document.createElement('p');p.textContent=message;
    bubble.append(label,p);row.appendChild(bubble);container.appendChild(row);container.scrollTop=container.scrollHeight;
  }
  document.querySelectorAll('[data-nexora-chat]').forEach(panel=>{
    const form=panel.querySelector('[data-chat-form]'),input=panel.querySelector('[data-chat-input]'),messages=panel.querySelector('[data-chat-messages]');
    if(!form||!input||!messages)return;
    const send=(raw)=>{const message=raw.trim();if(!message)return;panel.querySelector('.chat-suggestions')?.remove();addMessage(messages,message,'user');input.value='';const reply=answer(message);window.setTimeout(()=>addMessage(messages,reply,'assistant'),420);};
    form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
    panel.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=>send(button.dataset.prompt||'')));
  });
  const industryData={
    finance:{eyebrow:'01 / FINANCIAL SERVICES',title:'Intelligence for every transaction.',desc:'Give customers instant answers, help teams surface insights and streamline high-volume service journeys with secure, connected AI.',tags:['Customer service AI','Document intelligence','Workflow orchestration']},
    health:{eyebrow:'02 / HEALTHCARE',title:'More human time. Less admin friction.',desc:'Support patient enquiries, simplify appointment journeys and help staff find trusted information with privacy-aware AI experiences.',tags:['Patient assistance','Appointment workflows','Knowledge search']},
    retail:{eyebrow:'03 / RETAIL & E-COMMERCE',title:'Make every customer journey count.',desc:'Connect product discovery, order support and customer insights to create smoother shopping experiences across channels.',tags:['Product discovery','Order assistance','Customer insights']},
    property:{eyebrow:'04 / REAL ESTATE',title:'Turn every enquiry into momentum.',desc:'Qualify property enquiries, recommend relevant listings and coordinate site visits with connected lead workflows.',tags:['Lead qualification','Property matching','Visit scheduling']},
    manufacturing:{eyebrow:'05 / MANUFACTURING',title:'Bring intelligence closer to operations.',desc:'Make operational knowledge easier to access and streamline maintenance, quality and production reporting workflows.',tags:['Operations copilot','Quality workflows','Maintenance support']},
    education:{eyebrow:'06 / EDUCATION',title:'Create better learning journeys.',desc:'Help students and applicants find answers while simplifying admissions, administration and learning-content discovery.',tags:['Student assistance','Admissions automation','Content discovery']}
  };
  document.querySelectorAll('[data-explorer-stage]').forEach(stage=>{
    const tabs=document.querySelectorAll('[data-industry]');
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      const data=industryData[tab.dataset.industry];if(!data)return;
      tabs.forEach(t=>{const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));});
      stage.querySelector('.explorer-copy .eyebrow').textContent=data.eyebrow;
      stage.querySelector('[data-explorer-title]').textContent=data.title;
      stage.querySelector('[data-explorer-desc]').textContent=data.desc;
      const tags=stage.querySelector('[data-explorer-tags]');tags.replaceChildren(...data.tags.map(value=>{const span=document.createElement('span');span.textContent=value;return span;}));
      stage.querySelector('.explorer-visual').animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});
    }));
  });
  if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.nexora-chat-wrap,.explorer-stage,.explorer-tabs,.chat-project-intro,.project-chat-panel,.chat-project-note').forEach(el=>{el.classList.add('reveal');io.observe(el);});}
})();
