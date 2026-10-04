'use strict';
// Public, curated case studies only. Original workflow exports are never fetched.
let showcaseData;
const showcaseDialog=document.getElementById('showcase-dialog');
let showcaseOpener;
const dataReady=fetch('showcase-data.json?v=12').then(response=>{
  if(!response.ok) throw new Error('Collection unavailable');
  return response.json();
}).then(data=>showcaseData=data);
function showcaseText(tag,text){const node=document.createElement(tag);node.textContent=text;return node;}
document.querySelectorAll('[data-showcase]').forEach(button=>button.addEventListener('click',async()=>{
  try{
    await dataReady;
    const study=showcaseData.find(item=>item.id===button.dataset.showcase);
    if(!study)return;
    showcaseOpener=button;
    document.getElementById('showcase-title').textContent=study.title;
    document.getElementById('showcase-description').textContent=study.description;
    document.getElementById('showcase-tools').replaceChildren(...study.tools.map(tool=>showcaseText('span',tool)));
    document.getElementById('showcase-images').replaceChildren(...study.images.map((src,index)=>{
      const figure=document.createElement('figure'),image=new Image();
      image.src=src;image.alt=study.title+(study.images.length>1?(index?' — dark appearance':' — light appearance'):' — anonymized showcase');
      image.decoding='async';figure.append(image);return figure;
    }));
    const context=document.getElementById('showcase-context');context.replaceChildren();
    if(study.pricePHP)context.append(showcaseText('h3','Portfolio price'),showcaseText('p','₱'+study.pricePHP+' PHP'));
    if(study.steps){const heading=showcaseText('h3','How the workflow is designed');const list=document.createElement('ol');list.append(...study.steps.map(step=>showcaseText('li',step)));context.append(heading,list);}
    if(study.deliverables){context.append(showcaseText('h3','What this demonstrates'),showcaseText('p',study.deliverables.join(' · ')));}
    document.getElementById('showcase-note').textContent=study.note;
    const actions=document.getElementById('showcase-actions');actions.replaceChildren();
    if(study.demo){const link=showcaseText('a','Explore full interactive portfolio ↗');link.href=study.demo;link.className='button';link.target='_blank';link.rel='noopener';actions.append(link);}
    const contact=showcaseText('a','Create something like this →');contact.href='contact.html';contact.className='text-link';actions.append(contact);
    showcaseDialog.showModal();showcaseDialog.scrollTop=0;
  }catch{toast('The collection could not load. Please refresh and try again.');}
}));
document.getElementById('showcase-close').addEventListener('click',()=>showcaseDialog.close());
showcaseDialog.addEventListener('close',()=>showcaseOpener?.focus());
showcaseDialog.addEventListener('click',event=>{if(event.target!==showcaseDialog)return;const r=showcaseDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)showcaseDialog.close();});
