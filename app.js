'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const projects=window.PROJECTS, reduced=matchMedia('(prefers-reduced-motion: reduce)'), desktop=matchMedia('(min-width: 701px)');
const hasGSAP=!!(window.gsap&&window.ScrollTrigger);let lenis,orbitTime=0,orbitScroll=0,orbitFrame,lastTime=0,openedFrom,savedY=0,closing=false,moreTrigger;
function cover(p){if(p.id==='soyka')return `<div class="cover soyka cover-screenshot" aria-hidden="true"><img src="assets/soyka/cover.jpg" alt="" decoding="async"></div>`;if(p.id==='lym')return `<div class="cover lym cover-screenshot" aria-hidden="true"><img src="assets/lym/cover.jpg" alt="" width="3840" height="2912" decoding="async"></div>`;if(p.id==='ocean')return `<div class="cover ocean cover-screenshot" aria-hidden="true"><img src="assets/ocean/cover.jpg" alt="" width="1616" height="1272" decoding="async"></div>`;if(p.id==='eagle')return `<div class="cover eagle cover-screenshot" aria-hidden="true"><img src="assets/eagle/cover.jpg" alt="" width="1616" height="1272" decoding="async"></div>`;if(p.id==='barevie')return `<div class="cover barevie cover-screenshot" aria-hidden="true"><img src="assets/barevie/cover.jpg" alt="" width="3232" height="2544" decoding="async"></div>`;if(p.id==='youps')return `<div class="cover youps cover-screenshot" aria-hidden="true"><img src="assets/youps/cover-new.png" alt="" width="1440" height="1092" decoding="async"></div>`;if(p.id==='tdevice')return `<div class="cover tdevice cover-screenshot" aria-hidden="true"><img src="assets/tdevice/cover.png" alt="" width="1440" height="1092" decoding="async"></div>`;if(p.id==='pulse')return `<div class="cover pulse cover-screenshot" aria-hidden="true"><img src="assets/pulse/cover.png" alt="" width="1439" height="1093" decoding="async"></div>`;return `<div class="cover ${p.id}" aria-hidden="true"><div class="cover-top"><span>${p.company}</span></div><div class="cover-name">${p.name}</div><div class="cover-bottom"><span>Типографическая обложка</span><span>${p.tag.split(' · ')[0]}</span></div></div>`}
function card(p,i,orbit=false){if(orbit)return `<div class="orbit-card ${p.id}" role="img" aria-label="${p.name}">${cover(p)}</div>`;return `<button class="${orbit?'orbit-card':'project-card'} ${p.id}" data-project="${p.id}" aria-label="Открыть кейс ${p.name}">${cover(p)}${orbit?'':`<div class="project-meta"><h3>${p.name}</h3></div><p>${p.subtitle}</p><span class="project-tag">${p.tag}</span>`}</button>`}
$('.orbit').innerHTML=[...projects,...projects].map((p,i)=>card(p,i,true)).join('');$('.selected-grid').innerHTML=projects.slice(0,3).map((p,i)=>card(p,i)).join('');$('.reel').innerHTML=projects.slice(3).map((p,i)=>card(p,i)).join('');
if(hasGSAP)gsap.registerPlugin(ScrollTrigger);
if(window.Lenis&&!reduced.matches){lenis=new Lenis({duration:1.05,smoothWheel:true});if(hasGSAP){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}else{function raf(t){lenis.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf)}}
const orbitState={spread:reduced.matches?1:.9,mx:0,my:0,tx:0,ty:0};
function orbitLayout(){
 const box=$('.intro'),w=box.clientWidth,h=box.clientHeight;
 $$('.orbit-card').forEach((el,i)=>{
  // The reference's tall arch continues below the frame, leaving the center empty.
  const phase=((i/16+orbitTime/(Math.PI*2))%1+1)%1,visible=.58;
  const t=Math.min(1,phase/visible),angle=Math.PI-.13+t*(Math.PI+.26);
  const rx=w*.43,ry=w<700?h*.43:h*.72;
  const baseline=w<700?h*.49:h*.95;
  const x=Math.cos(angle)*rx,y=baseline-h/2+Math.sin(angle)*ry;
  const rotation=angle*180/Math.PI+90;
  const edge=Math.min(1,t/.035,(1-t)/.035);
  const opacity=phase>visible?0:orbitState.spread*Math.max(0,edge);
  el.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${rotation}deg)`;
  el.style.opacity=opacity;el.style.pointerEvents='none';
 });
}
function orbitTick(t){if(!lastTime)lastTime=t;if(!reduced.matches&&!document.hidden&&!$('#case-dialog').open&&scrollY<$('.intro').offsetHeight){orbitTime+=Math.min(t-lastTime,50)*Math.PI*2/110000;orbitState.mx+=(orbitState.tx-orbitState.mx)*.05;orbitState.my+=(orbitState.ty-orbitState.my)*.05;}lastTime=t;orbitLayout();orbitFrame=requestAnimationFrame(orbitTick)}requestAnimationFrame(orbitTick);
if(hasGSAP&&!reduced.matches)gsap.to(orbitState,{spread:1,duration:2.2,ease:'expo.out',delay:.2});else orbitState.spread=1;
$('.intro').addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduced.matches)return;const rect=$('.intro').getBoundingClientRect();orbitState.tx=(e.clientX/rect.width-.5)*2;orbitState.ty=((e.clientY-rect.top)/rect.height-.5)*2;},{passive:true});
$('.intro').addEventListener('pointerleave',()=>{orbitState.tx=0;orbitState.ty=0});
if(hasGSAP&&!reduced.matches){gsap.from('.intro-copy > *',{y:22,opacity:0,stagger:.12,duration:1,ease:'power2.out'});ScrollTrigger.create({trigger:'.intro',start:'top top',end:'bottom top',onUpdate:s=>orbitScroll=s.progress});$$('.section-heading,.selected-grid .project-card').forEach(el=>gsap.from(el,{y:28,opacity:0,duration:.7,scrollTrigger:{trigger:el,start:'top 94%',once:true}}));}
let activeMore=0;const reelCards=$$('.reel .project-card');
function setMore(n){activeMore=Math.max(0,Math.min(4,n));$('#more-count').textContent=`${String(activeMore+1).padStart(2,'0')} / 05`;$('#more-title').textContent=projects[activeMore+3].name;$('#more-description').textContent=projects[activeMore+3].subtitle;$('#more-prev').disabled=activeMore===0;$('#more-next').disabled=activeMore===4;}
function layoutReel(position){reelCards.forEach((el,i)=>{const d=i-position;el.style.transform=`translateY(calc(-50% + ${d*440}px)) scale(${Math.max(.88,1-Math.abs(d)*.07)})`;el.style.opacity=Math.max(.15,1-Math.abs(d)*.55);el.style.filter=`blur(${Math.min(Math.abs(d)*1.5,3)}px)`;el.inert=Math.abs(d)>.52;el.style.zIndex=10-Math.round(Math.abs(d));});setMore(Math.round(position));}
if(hasGSAP){gsap.matchMedia().add({wide:'(min-width:701px)',motion:'(prefers-reduced-motion: no-preference)'},ctx=>{if(ctx.conditions.wide&&ctx.conditions.motion){moreTrigger=ScrollTrigger.create({trigger:'.more-stage',start:'top top',end:'+=2800',pin:true,scrub:.6,onUpdate:s=>layoutReel(s.progress*4)});layoutReel(0);return()=>{moreTrigger=null;reelCards.forEach(el=>{el.removeAttribute('style');el.inert=false})}}else{reelCards.forEach(el=>{el.style.position='relative';el.style.top='auto';el.style.transform='none';el.style.marginBottom='30px';el.inert=false});$('.more-stage').style.height='auto';$('.reel').style.height='auto';return()=>{$('.more-stage').style.height='';$('.reel').style.height='';reelCards.forEach(el=>el.removeAttribute('style'))}}});}
function navigateMore(n){if(!moreTrigger)return;const y=moreTrigger.start+(Math.max(0,Math.min(4,n))/4)*(moreTrigger.end-moreTrigger.start);scrollToY(y)}
$('#more-prev').onclick=()=>navigateMore(activeMore-1);$('#more-next').onclick=()=>navigateMore(activeMore+1);

let aboutMotion=null;
const aboutParts=$$('.about-part'),aboutStage=document.createElement('div'),aboutPanels=document.createElement('div');
aboutStage.className='about-stage';aboutPanels.className='about-panels';
$('#about').append(aboutStage);aboutStage.append($('.about-nav'),aboutPanels);aboutParts.forEach(p=>aboutPanels.append(p));
if(hasGSAP){gsap.matchMedia().add({room:'(min-width:1000px) and (min-height:760px)',motion:'(prefers-reduced-motion: no-preference)'},ctx=>{
 let active=-1;
 if(ctx.conditions.room&&ctx.conditions.motion){
  $('#about').classList.add('about-sequence');
  function showPanel(index){if(index===active)return;active=index;
   $$('.about-nav a').forEach((a,i)=>i===index?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
   aboutParts.forEach((panel,i)=>{gsap.killTweensOf(panel);panel.inert=i!==index;panel.setAttribute('aria-hidden',String(i!==index));
    if(i===index){panel.classList.add('is-active');gsap.fromTo(panel,{autoAlpha:0},{autoAlpha:1,duration:.45,overwrite:true});const kids=panel.querySelectorAll('h3, .profile-statement, .skills > div, .experience-row, .education-list li, #profile > div > p:not(.profile-statement), #writing p');gsap.fromTo(kids,{y:36,opacity:0},{y:0,opacity:1,duration:.9,ease:'expo.out',stagger:.065,overwrite:true});}
    else{panel.classList.remove('is-active');gsap.set(panel,{autoAlpha:0});}
   });
  }
  aboutMotion=ScrollTrigger.create({trigger:aboutStage,start:'top 64px',end:'+=2400',pin:true,onUpdate:t=>{$('.about-nav i').style.transform=`scaleX(${t.progress})`;showPanel(Math.min(aboutParts.length-1,Math.floor(t.progress*aboutParts.length)));}});showPanel(0);
 }else{
  aboutParts.forEach(panel=>{panel.inert=false;panel.removeAttribute('aria-hidden')});
  if(ctx.conditions.motion)aboutParts.forEach(panel=>{gsap.from(panel.querySelectorAll('h3,.profile-statement,.skills>div,.experience-row,.education-list li,#writing p'),{y:28,opacity:0,duration:.8,stagger:.08,ease:'expo.out',scrollTrigger:{trigger:panel,start:'top 78%',once:true}})});
 }
 return()=>{aboutMotion=null;$('#about').classList.remove('about-sequence');aboutParts.forEach(panel=>{panel.inert=false;panel.removeAttribute('aria-hidden');panel.classList.remove('is-active')})};
 });}
function scrollToY(y){if(lenis&&!reduced.matches)lenis.scrollTo(y);else window.scrollTo({top:y,behavior:reduced.matches?'instant':'smooth'})}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();const panelIndex=aboutParts.indexOf(target);const y=aboutMotion&&panelIndex>=0?aboutMotion.start+(panelIndex+.12)/aboutParts.length*(aboutMotion.end-aboutMotion.start):target.getBoundingClientRect().top+scrollY-(target.id==='intro'?0:84);scrollToY(y);history.replaceState(null,'',a.getAttribute('href'));target.setAttribute('tabindex','-1');if(!(aboutMotion&&panelIndex>=0))target.focus({preventScroll:true});$('.header nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
$('.menu-toggle').onclick=()=>{const open=$('.header nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open))};document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('.header nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}});
const sections=$$('main > section'),parts=$$('.about-part');let ticking=false;
function progress(){const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;$('.page-progress i').style.transform=`scaleX(${max>0?y/max:0})`;let index=0;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.45)index=i});$$('.header nav a').forEach((a,i)=>i===index?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));$('#mobile-section').textContent=`0${index+1} / 05`;let part=0;if(!aboutMotion)parts.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.5)part=i});if(!aboutMotion)$$('.about-nav a').forEach((a,i)=>i===part?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));const ar=$('#about').getBoundingClientRect();if(!aboutMotion)$('.about-nav i').style.transform=`scaleX(${Math.max(0,Math.min(1,(innerHeight*.5-ar.top)/ar.height))})`;ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true}},{passive:true});addEventListener('resize',()=>{orbitLayout();progress()});progress();
const dialog=$('#case-dialog');
function caseHTML(p){if(p.id==='soyka')return soykaCase(p);if(p.id==='lym')return lymCase(p);if(p.id==='ocean')return oceanCase(p);if(p.id==='eagle')return eagleCase(p);if(p.id==='barevie')return barevieCase(p);let html = `<header class="case-hero"><span class="eyebrow">${p.company}</span><h2 id="case-title">${p.name}</h2><span class="project-tag">${p.tag}</span></header><figure class="case-art">${cover(p)}</figure><section class="case-section"><span class="eyebrow">01 / Контекст</span><p>${p.context}</p></section><section class="case-section"><span class="eyebrow">02 / Мой вклад</span><p>${p.work}</p></section><section class="case-section"><span class="eyebrow">03 / Логика работы</span><div><p>${p.id==='pulse'?'Сценарий прокторинга':p.id==='tdevice'?'От потребностей сотрудников к согласованным решениям':'Основные направления проекта'}</p><ol class="case-flow">${p.flow.map(s=>`<li>${s}</li>`).join('')}</ol><small>Схема по описанию проекта, не интерфейс продукта.</small></div></section><section class="case-section"><span class="eyebrow">04 / Результат и статус</span><p>${p.outcome}</p></section><footer class="case-end"><a href="mailto:rlera4765@mail.ru">Обсудить проект</a></footer>`;
 if(p.id==='pulse'){
  html=html.replace(/<section class="case-section"><span class="eyebrow">03 \/ Логика работы<\/span>[\s\S]*?<\/section>/,'').replace('04 / Результат и статус','03 / Результат и статус');
  html=html.replace(`<figure class="case-art">${cover(p)}</figure>`,`<figure class="case-art pulse-hero-image"><img src="assets/pulse/pulse-777.jpg" alt="Пульс: лента развития с карточками обучающих материалов" width="4095" height="2648" decoding="async"></figure>`);
  html=html.replace('<section class="case-section"><span class="eyebrow">03 / Результат и статус</span>',pulseScreens()+'<section class="case-section"><span class="eyebrow">03 / Результат и статус</span>');
 }
 if(p.id==='tdevice'){
  html=html.replace(/<section class="case-section"><span class="eyebrow">03 \/ Логика работы<\/span>[\s\S]*?<\/section>/,'').replace('04 / Результат и статус','03 / Результат и статус');
  html=html.replace(`<figure class="case-art">${cover(p)}</figure>`,`<figure class="case-art tdevice-hero-image"><img src="assets/tdevice/tdevice-0.png" alt="TDevice: справочник моделей оборудования" width="2945" height="1853" decoding="async"></figure>`);
  html=html.replace('<section class="case-section"><span class="eyebrow">03 / Результат и статус</span>',tdeviceScreens()+'<section class="case-section"><span class="eyebrow">03 / Результат и статус</span>');
 }
 if(p.id==='youps'){
  html=html.replace(/<section class="case-section"><span class="eyebrow">03 \/ Логика работы<\/span>[\s\S]*?<\/section>/,'').replace('04 / Результат и статус','03 / Результат и статус');
  html=html.replace(`<figure class="case-art">${cover(p)}</figure>`,`<figure class="case-art youps-hero-image"><img src="assets/youps/cover-new.png" alt="Youps: обзор мобильных интерфейсов, профиля, турнира и игрового питомца" width="3840" height="2160" decoding="async"></figure>`);
  html=html.replace('<section class="case-section"><span class="eyebrow">03 / Результат и статус</span>',youpsScreens()+'<section class="case-section"><span class="eyebrow">03 / Результат и статус</span>');
 }
 return html;
}
function pulseScreens(){
 const groups=[
  {title:'Обучение и развитие',screens:[[775,'Карточка обучающего марафона и этапы прохождения'],[776,'Аналитика обучения: статусы и динамика']]},
  {title:'Тесты, опросы и оценка',screens:[[778,'Каталог тестов и опросов'],[779,'Прохождение теста и навигация по вопросам'],[780,'Страница опроса CSI'],[781,'Оценка сотрудников и самооценка']]},
  {title:'Карьера и цели',screens:[[782,'Раздел «Моя карьера»: вакансии, поиск и фильтры'],[783,'Создание новой цели']]}
 ];
 return `<section class="pulse-gallery" aria-label="Экраны платформы Пульс">${groups.map(g=>`<div class="pulse-screen-group"><h3>${g.title}</h3>${g.screens.map(([n,alt])=>`<figure><img src="assets/pulse/pulse-${n}.jpg" alt="${alt}" width="4095" height="${n===782?2597:2648}" loading="lazy" decoding="async"><figcaption>${alt}</figcaption></figure>`).join('')}</div>`).join('')}</section>`;
}
function tdeviceScreens(){
 const groups=[{title:'Справочник моделей',screens:[[1,'Настройка колонок таблицы',2939,1838],[2,'Создание новой модели',2939,2790],[3,'Карточка модели: информация, стоимость и характеристики',2939,2466]]},{title:'Компоненты и паттерны',screens:[[4,'Библиотека компонентов и описание поведения таблиц',2945,2001]]},{title:'Рабочее место сотрудника',screens:[[5,'Концепция рабочего места: документы, перемещения и продуктивность',2939,3473]]}];
 return `<section class="pulse-gallery tdevice-gallery" aria-label="Экраны TDevice">${groups.map(g=>`<div class="pulse-screen-group"><h3>${g.title}</h3>${g.screens.map(([n,alt,w,h])=>`<figure><div class="tdevice-screen"><img src="assets/tdevice/tdevice-${n}.png" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async"></div><figcaption>${alt}</figcaption></figure>`).join('')}</div>`).join('')}</section>`;
}
function youpsScreens(){
 const groups=[
  {title:'Обзор приложения',screens:[[78,'Мобильные интерфейсы Youps: профиль, турнир и игровой питомец']]},
  {title:'Профиль и создание образа',screens:[[83,'Профиль пользователя, приватное состояние и выбор аватара'],[80,'Создание образа: выбор вещей, шаблона, фона и стиля'],[84,'Сообщения об обновлении приложения и варианты фона образа']]},
  {title:'Игровые механики',screens:[[82,'Сценарии взаимодействия с питомцем и настройки команды'],[81,'Последовательность анимации ежедневной награды'],[79,'Уведомления, достижения и повышение уровня']]},
  {title:'Турниры и избранное',screens:[[85,'Турнир, избранные вещи и образы, заказ персонального стилиста']]}
 ];
 return `<section class="pulse-gallery youps-gallery" aria-label="Интерфейсы Youps">${groups.map(g=>`<div class="pulse-screen-group"><h3>${g.title}</h3>${g.screens.map(([n,alt])=>`<figure><img src="assets/youps/youps-${n}.jpg" alt="${alt}" width="3840" height="${n===83?1564:2160}" loading="lazy" decoding="async"><figcaption>${alt}</figcaption></figure>`).join('')}</div>`).join('')}</section>`;
}
function soykaCase(p){
 const alts=['Концепция журнала воспоминаний Сойка','Рекламный носитель Сойки','Вход и главный экран','Совместный альбом и чат','Поиск, профиль и подписка','Обзор экранов приложения','Идея и позиционирование бренда','Наружная реклама','Мерч Сойки','Выставочный носитель','Реклама на городской остановке'];
 return `<header class="case-hero"><span class="eyebrow">${p.company}</span><h2 id="case-title">${p.name}</h2><span class="project-tag">${p.tag}</span></header><section class="case-section"><span class="eyebrow">01 / О проекте</span><p>${p.context}</p></section><section class="case-section"><span class="eyebrow">02 / Моя работа</span><p>${p.work}</p></section><div class="barevie-continuous soyka-continuous" aria-label="Презентация Сойки">${alts.map((alt,i)=>`<img src="assets/soyka/soyka-${String(i+1).padStart(2,'0')}.jpg" alt="${alt}" loading="lazy" decoding="async">`).join('')}</div><section class="case-section"><span class="eyebrow">03 / Результат</span><p>${p.outcome}</p></section><footer class="case-end"><a href="mailto:rlera4765@mail.ru">Обсудить проект</a></footer>`;
}
function lymCase(p){
 const alts=['Концепция Lym','Исследование и целевая аудитория','Структура приложения','Сценарии, карта пути пользователя и мерч','Дизайн-система, прототип и бренд','Вход и онбординг','Главный экран и настройка потока','Виджеты и продвижение','Друзья и профиль','Мерч и носители бренда','Анимация настройки звука','Анимация дыхательного упражнения','Исследование с тепловыми картами'];
 return `<header class="case-hero"><span class="eyebrow">${p.company}</span><h2 id="case-title">${p.name}</h2><span class="project-tag">${p.tag}</span></header><section class="case-section"><span class="eyebrow">01 / О проекте</span><p>${p.context}</p></section><section class="case-section"><span class="eyebrow">02 / Моя работа</span><p>${p.work}</p></section><div class="barevie-continuous lym-continuous" aria-label="Презентация Lym">${[0,1,2,12,3,10,4,11,5,6,7,8,9].map(i=>`<img src="assets/lym/lym-${String(i+1).padStart(2,'0')}.${i<10?'jpg':'gif'}" alt="${alts[i]}" loading="lazy" decoding="async">`).join('')}</div><section class="case-section"><span class="eyebrow">03 / Результат</span><p>${p.outcome}</p></section><footer class="case-end"><a href="mailto:rlera4765@mail.ru">Обсудить проект</a></footer>`;
}
function oceanCase(p){
 const alts=['Концепция сайта Ocean Deep','Главная страница и мобильная версия','Рекламный носитель клуба','Каталог услуг дайвинг-клуба','Вывеска Ocean Deep','Страница первого погружения','Команда клуба и адаптивная версия','Сайт клуба на планшете','Страница о клубе','Рекламный плакат','Типографика и цветовая система','Услуги и адаптивные версии','Фирменная сумка'];
 return `<header class="case-hero"><span class="eyebrow">${p.company}</span><h2 id="case-title">${p.name}</h2><span class="project-tag">${p.tag}</span></header><section class="case-section"><span class="eyebrow">01 / О проекте</span><p>${p.context}</p></section><section class="case-section"><span class="eyebrow">02 / Моя работа</span><p>${p.work}</p></section><div class="barevie-continuous ocean-continuous" aria-label="Презентация Ocean Deep">${alts.map((alt,i)=>`<img src="assets/ocean/ocean-${String(i+1).padStart(2,'0')}.jpg" alt="${alt}" loading="lazy" decoding="async">`).join('')}</div><section class="case-section"><span class="eyebrow">03 / Результат</span><p>${p.outcome}</p></section><footer class="case-end"><a href="mailto:rlera4765@mail.ru">Обсудить проект</a></footer>`;
}
function eagleCase(p){
 const alts=['Обзор концепции Eagle News','Носители фирменного стиля','Пользовательские персоны и структура приложения','Карта пользовательского пути и сценарии','Вход, онбординг и чтение статей','Профиль, аналитика и подписка','Дизайн-система и новостная лента','Поиск и иконка приложения','Каталог и результаты поиска','Светлая и тёмная темы, прототипы','Новостная лента и брендинг','Обзор экранов приложения'];
 return `<header class="case-hero"><span class="eyebrow">${p.company}</span><h2 id="case-title">${p.name}</h2><span class="project-tag">${p.tag}</span></header><section class="case-section"><span class="eyebrow">01 / О проекте</span><p>${p.context}</p></section><section class="case-section"><span class="eyebrow">02 / Моя работа</span><p>${p.work}</p></section><div class="barevie-continuous eagle-continuous" aria-label="Презентация Eagle News">${alts.map((alt,i)=>`<img src="assets/eagle/eagle-${String(i+1).padStart(2,'0')}.jpg" alt="${alt}" loading="lazy" decoding="async">`).join('')}</div><section class="case-section"><span class="eyebrow">03 / Результат</span><p>${p.outcome}</p></section><footer class="case-end"><a href="mailto:rlera4765@mail.ru">Обсудить проект</a></footer>`;
}
function barevieCase(p){
 const descriptions=['Визуальная концепция Barevie','Адаптивный интерфейс на мобильном устройстве','Главная страница интернет-магазина','Визуальная подача косметики','Каталог продукции','Дизайн упаковки косметики','Страница о бренде и мобильные версии','Страница о бренде и мобильные версии','Упаковка и подписка на новости','Упаковка и подписка на новости','Типографика и цветовая система','Мобильные интерфейсы и упаковка','Финальная презентация бренда'];
 return `<header class="case-hero"><span class="eyebrow">${p.company}</span><h2 id="case-title">${p.name}</h2><span class="project-tag">${p.tag}</span></header><section class="case-section"><span class="eyebrow">01 / О проекте</span><p>${p.context}</p></section><section class="case-section"><span class="eyebrow">02 / Моя работа</span><p>${p.work}</p></section><div class="barevie-continuous" aria-label="Презентация Barevie в порядке отправки">${descriptions.map((alt,i)=>({alt,i})).filter(({i})=>i!==7&&i!==9).map(({alt,i})=>`<img src="assets/barevie/barevie-${String(i+1).padStart(2,'0')}.jpg" alt="${alt}" ${i?'loading="lazy"':''} decoding="async">`).join('')}</div><section class="case-section"><span class="eyebrow">03 / Результат</span><p>${p.outcome}</p></section><footer class="case-end"><a href="mailto:rlera4765@mail.ru">Обсудить проект</a></footer>`;
}
function fly(source,reverse=false){if(reduced.matches||!hasGSAP||!source)return Promise.resolve();const rect=source.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return Promise.resolve();const clone=document.createElement('div');clone.className='transition-cover';clone.innerHTML=source.outerHTML;dialog.append(clone);const from={left:rect.left,top:rect.top,width:rect.width,height:rect.height},to={left:0,top:0,width:innerWidth,height:innerHeight};gsap.set(clone,reverse?to:from);return new Promise(resolve=>gsap.to(clone,{...(reverse?from:to),duration:.5,ease:'power3.inOut',onComplete:()=>{clone.remove();resolve()}}))}
async function openCase(button){if(dialog.open||closing)return;openedFrom=button;savedY=scrollY;const p=projects.find(x=>x.id===button.dataset.project);$('#case-content').innerHTML=caseHTML(p);$('#case-label').textContent=`${p.company} / ${p.name}`;lenis?.stop();document.body.classList.add('modal-open');dialog.showModal();dialog.scrollTop=0;$('#close-case').focus({preventScroll:true});await fly(button.querySelector('.cover'));if(hasGSAP&&!reduced.matches)gsap.from('#case-content > *',{y:15,opacity:0,duration:.35,stagger:.04});}
async function closeCase(){if(!dialog.open||closing)return;closing=true;await fly(openedFrom?.querySelector('.cover'),true);dialog.close();document.body.classList.remove('modal-open');window.scrollTo(0,savedY);lenis?.start();openedFrom?.focus({preventScroll:true});closing=false;}
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>openCase(b)));$('#close-case').onclick=closeCase;dialog.addEventListener('cancel',e=>{e.preventDefault();closeCase()});dialog.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeCase()});dialog.addEventListener('scroll',()=>{const max=dialog.scrollHeight-dialog.clientHeight;$('.case-progress i').style.transform=`scaleX(${max?dialog.scrollTop/max:0})`},{passive:true});
const name=$('.contact-name');name.innerHTML=[...name.textContent].map(c=>c===' '?' ':`<span aria-hidden="true">${c}</span>`).join('');if(hasGSAP&&!reduced.matches)gsap.from('.contact-name span',{y:60,opacity:0,stagger:.04,duration:.65,scrollTrigger:{trigger:name,start:'top 95%',once:true}});
if(matchMedia('(pointer:fine)').matches&&!reduced.matches){document.addEventListener('pointermove',e=>{const c=$('.cursor');c.style.transform=`translate(${e.clientX+14}px,${e.clientY+14}px)`;c.style.opacity=e.target.closest('[data-project]')&&!dialog.open?'1':'0'})}
reduced.addEventListener('change',()=>location.reload());

function styleActions(){document.querySelectorAll('.text-link,.filled-button,.contact-links a,.certificate-link,.case-end button,.case-end a,.more-controls button,.menu-toggle').forEach(el=>el.classList.add('action-button'));}
styleActions();
new MutationObserver(styleActions).observe(document.querySelector('#case-content'),{childList:true});
