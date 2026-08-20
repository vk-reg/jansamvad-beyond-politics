async function loadArticle(){
 const root=document.querySelector('[data-article]');
 if(!root)return;
 const slug=new URLSearchParams(location.search).get('slug');
 if(!slug){showError('खबर उपलब्ध नहीं है।');return;}
 try{
  const r=await fetch('/api/posts?slug='+encodeURIComponent(slug));
  const data=await r.json();
  if(!r.ok||!data.post)throw new Error(data.error||'Post not found');
  const p=data.post;
  document.title=(p.title||'जनसंवाद अपडेट')+' | जनसंवाद – Beyond Politics';
  const cleanBody=String(p.body||'').trim();
  const paragraphs=cleanBody.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean).map(x=>'<p>'+escapeHtml(x).replace(/\n/g,'<br>')+'</p>').join('');
  root.innerHTML=`<a class="back" href="index.html">← वापस</a><div style="margin-top:24px"><span class="tag">${escapeHtml(p.category||'HIMACHAL UPDATE')}${p.district&&p.district!=='Statewide'?' • '+escapeHtml(p.district):''}</span></div><h1>${escapeHtml(p.title)}</h1><p class="meta">${escapeHtml(p.published_at||'')} · ${escapeHtml(p.author||'जनसंवाद')}</p>${p.image?`<img class="article-image" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}">`:''}<div class="article-lead">${escapeHtml(p.excerpt||'')}</div><div class="article-body">${paragraphs}</div>${p.video?`<div class="source-box"><strong>वीडियो:</strong> <a href="${escapeAttr(p.video)}" target="_blank" rel="noopener">YouTube पर देखें →</a></div>`:''}${p.source_url?`<div class="source-box"><strong>आधिकारिक स्रोत:</strong> <a href="${escapeAttr(p.source_url)}" target="_blank" rel="noopener">Source देखें →</a></div>`:''}`;
 }catch(e){showError('यह खबर अभी उपलब्ध नहीं है।');}
}
function showError(msg){const root=document.querySelector('[data-article]');if(root)root.innerHTML='<a class="back" href="index.html">← वापस</a><h1>'+escapeHtml(msg)+'</h1>';}
function escapeHtml(s){return String(s??'').replace(/[&<>"\\]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#92;'}[c]));}
function escapeAttr(s){return escapeHtml(s).replace(/'/g,'&#39;');}
loadArticle();
