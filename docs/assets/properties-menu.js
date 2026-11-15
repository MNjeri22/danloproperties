(()=>{
 const root=document.querySelector('.properties-nav');
 if(!root)return;
 const trigger=root.querySelector('.properties-toggle'),panel=root.querySelector('.properties-mega');
 const nav=document.getElementById('navigation'),desktop=matchMedia('(min-width:901px)'),hover=matchMedia('(hover:hover) and (pointer:fine)');
 let leaveTimer;
 function setOpen(open,restore=false){clearTimeout(leaveTimer);panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(restore)trigger.focus();}
 trigger.addEventListener('click',()=>setOpen(panel.hidden));
 root.addEventListener('mouseenter',()=>{if(desktop.matches&&hover.matches)setOpen(true)});
 root.addEventListener('mouseleave',()=>{if(desktop.matches&&hover.matches)leaveTimer=setTimeout(()=>{if(!root.contains(document.activeElement))setOpen(false)},180)});
 root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget))setOpen(false)});
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();setOpen(false,true)}
  if(event.key==='ArrowDown'&&event.target===trigger){event.preventDefault();setOpen(true);panel.querySelector('a').focus()}
 });
 document.addEventListener('click',event=>{if(!root.contains(event.target))setOpen(false)});
 panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
 document.querySelector('.menu-toggle')?.addEventListener('click',()=>setOpen(false));
 new MutationObserver(()=>{if(!nav.classList.contains('open')&&!desktop.matches)setOpen(false)}).observe(nav,{attributes:true,attributeFilter:['class']});
 desktop.addEventListener('change',()=>setOpen(false));

 const categories={
  residential:{name:'Residential land',tag:'Build a community',copy:'Tell us about your plans for a home or residential development. Share your preferred location, acreage, and budget so we can discuss land options with you.'},
  institutional:{name:'Institutional land',tag:'Establish your vision',copy:'Looking for land for a school, college, or another institutional project? Tell us your location, acreage, access needs, and budget to start the conversation.'},
  commercial:{name:'Commercial land',tag:'Create room to grow',copy:'Discuss your commercial land requirements with Danlo. Tell us about the location, size, access, and budget you have in mind for your project.'},
  industrial:{name:'Industrial land',tag:'Plan on a larger scale',copy:'Share your requirements for an industrial site, including acreage, location, access, and budget. Our team can discuss the available land options with you.'}
 };
 const params=new URLSearchParams(location.search),key=params.get('category'),category=categories[key];
 if(!category)return;
 const message=document.getElementById('inquiry-message');
 if(message&&params.get('inquiry')==='requirements'&&!message.value){message.value='I am interested in '+category.name.toLowerCase()+'.\nPreferred location: \nAcreage: \nBudget: \nIntended use: ';}
 const catalogue=document.getElementById('catalogue-main');
 if(!catalogue)return;
 trigger.setAttribute('aria-current','page');
 document.title=category.name+' | Danlo Properties Ltd';
 const main=document.createElement('main');main.id='category-main';main.className='category-page';main.tabIndex=-1;
 main.innerHTML='<div class="wrap"><div class="catalogue-crumb"><a href="index.html">Home</a> / <a href="land.html">Properties</a> / '+category.name+'</div><div class="eyebrow">'+category.tag+'</div><h1>'+category.name+'</h1><p class="category-lead">'+category.copy+'</p><div class="category-actions"><a class="btn" href="index.html?inquiry=requirements&amp;category='+key+'#contact">Discuss Your Requirements <span aria-hidden="true">&#8594;</span></a><a class="btn secondary" href="land.html">View All Land</a></div><section class="category-other"><h2>Explore other property types</h2><div class="category-links">'+Object.entries(categories).filter(([id])=>id!==key).map(([id,c])=>'<a href="land.html?category='+id+'">'+c.name+'</a>').join('')+'</div></section></div>';
 catalogue.hidden=true;catalogue.before(main);
 const skip=document.querySelector('.skip-link');if(skip)skip.href='#category-main';
})();
