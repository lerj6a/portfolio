'use strict';
(() => {
 const dictionary=window.PORTFOLIO_EN;
 const textSources=new WeakMap(),attributeSources=new WeakMap();
 let language='ru';
 try {if(localStorage.getItem('portfolio-language')==='en')language='en';} catch {}
 const switcher=document.querySelector('#language-switch');
 function translate(value){
  const trimmed=value.trim();
  if(dictionary[trimmed])return value.replace(trimmed,dictionary[trimmed]);
  if(trimmed.startsWith('Открыть кейс '))return 'Open case study '+translate(trimmed.slice(13));
  if(trimmed.includes(' / '))return trimmed.split(' / ').map(v=>dictionary[v]||v).join(' / ');
  return value;
 }
 function apply(){
  // Disconnect while writing so our own translations do not trigger another pass.
  observer.disconnect();
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
   if(node.parentElement.closest('script,style,#language-switch,svg'))continue;
   let record=textSources.get(node);
   if(!record||node.nodeValue!==record.output)record={source:node.nodeValue};
   record.output=language==='en'?translate(record.source):record.source;
   if(node.nodeValue!==record.output)node.nodeValue=record.output;
   textSources.set(node,record);
  }
  document.querySelectorAll('[aria-label],[alt]').forEach(el=>{
   if(el===switcher)return;
   let records=attributeSources.get(el)||{};
   for(const attr of ['aria-label','alt']){
    if(!el.hasAttribute(attr))continue;
    let record=records[attr];const value=el.getAttribute(attr);
    if(!record||value!==record.output)record={source:value};
    record.output=language==='en'?translate(record.source):record.source;
    if(value!==record.output)el.setAttribute(attr,record.output);
    records[attr]=record;
   }
   attributeSources.set(el,records);
  });
  // The animated name is split into individual letters in app.js.
  const name=document.querySelector('.contact-name');
  const desired=language==='en'?'Valeria Zaitseva':'Зайцева Валерия';
  if(name.textContent!==desired)name.replaceChildren(...[...desired].map(c=>{const span=document.createElement('span');span.textContent=c;span.setAttribute('aria-hidden','true');return span;}));
  name.setAttribute('aria-label',desired);
  document.documentElement.lang=language;
  document.title=language==='en'?'Valeria Zaitseva — Product Designer':'Валерия Зайцева — Product Designer';
  document.querySelector('meta[name="description"]').content=language==='en'?'Valeria Zaitseva’s portfolio: product design, UX/UI, research and visual concepts.':'Портфолио Валерии Зайцевой: продуктовый дизайн, UX/UI, исследования и визуальные концепции.';
  switcher.textContent=language==='en'?'RU':'EN';
  switcher.setAttribute('aria-label',language==='en'?'Switch to Russian':'Переключить на английский');
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt']});
 }
 const observer=new MutationObserver(apply);
 switcher.addEventListener('click',()=>{
  language=language==='ru'?'en':'ru';
  try{localStorage.setItem('portfolio-language',language);}catch{}
  apply();
  // Recalculate pinned sections after translated text changes their dimensions.
  window.ScrollTrigger?.refresh();
 });
 apply();
})();
