'use strict';
// Set the public form ID in site-config.js after inbox verification. Never add keys.
const inquiryForm=document.getElementById('contact-form');
const formId=window.AZ_CONFIG?.formspreeId || '';
const formEndpoint=/^[a-zA-Z0-9]{6,20}$/.test(formId)?`https://formspree.io/f/${formId}`:'';
document.querySelectorAll('.contact-email').forEach(link=>{link.textContent=SITE_CONFIG.email;link.href=`mailto:${SITE_CONFIG.email}`;});
if(inquiryForm){
  const submit=inquiryForm.querySelector('[type="submit"]'),note=inquiryForm.querySelector('.form-note'),status=document.getElementById('form-status');
  submit.textContent=formEndpoint?'Send inquiry →':'Prepare email draft →';
  note.textContent=formEndpoint?'Sends your inquiry through Formspree. Please avoid sensitive information.':'Opens your email app. Review the draft and press Send there. You can also download the message.';
  let downloadURL;
  function draft(){
    const values=new FormData(inquiryForm);
    return {subject:`AZ Makes inquiry — ${values.get('service')}`,body:`Hi Akhi,\n\n${values.get('message')}\n\nName: ${values.get('name')}\nEmail: ${values.get('email')}\nService: ${values.get('service')}\nPreferred timeline: ${values.get('timeline') || 'To discuss'}\nBudget: ${values.get('budget') || 'To discuss'}`};
  }
  function saveDraft(){
    const message=draft();if(downloadURL)URL.revokeObjectURL(downloadURL);
    downloadURL=URL.createObjectURL(new Blob([`${message.subject}\n\n${message.body}`],{type:'text/plain;charset=utf-8'}));
    const link=document.getElementById('inquiry-download');link.href=downloadURL;link.download='az-makes-inquiry.txt';link.hidden=false;
  }
  document.getElementById('prepare-download').addEventListener('click',()=>{
    if(!inquiryForm.reportValidity())return;saveDraft();document.getElementById('inquiry-download').click();status.textContent='Your message download is ready. If it did not start, use Download message below. Nothing has been sent.';
  });
  inquiryForm.addEventListener('input',()=>{document.getElementById('inquiry-download').hidden=true;status.textContent='';});
  inquiryForm.addEventListener('submit',async event=>{
    event.preventDefault();if(!inquiryForm.reportValidity()||submit.disabled)return;
    if(inquiryForm.elements._gotcha.value)return;
    saveDraft();const message=draft();
    if(!formEndpoint){
      location.href=`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
      status.textContent='Draft prepared. Send it from your email app. If no app opens, download the message below and email the studio.';return;
    }
    submit.disabled=true;submit.textContent='Sending…';inquiryForm.setAttribute('aria-busy','true');status.textContent='Sending your inquiry…';
    try{
      const payload=new FormData(inquiryForm);payload.set('subject',message.subject);
      const response=await fetch(formEndpoint,{method:'POST',body:payload,headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw new Error('Delivery not confirmed');
      status.textContent='Your inquiry was accepted. Thank you — the studio will review it and reply by email.';
      inquiryForm.reset();document.getElementById('inquiry-download').hidden=true;
    }catch{
      status.textContent='Delivery could not be confirmed. Your entries are still here. Download your message or email the studio; please avoid resending immediately.';
    }finally{submit.disabled=false;submit.textContent='Send inquiry →';inquiryForm.removeAttribute('aria-busy');}
  });
}
