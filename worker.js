const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=UTF-8','cache-control':'no-store'}});
const slugify=s=>String(s||'').toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,90)||`post-${Date.now()}`;
const auth=(request,env)=>Boolean(env.ADMIN_KEY&&request.headers.get('X-Admin-Key')===env.ADMIN_KEY);
async function api(request,env){
 const url=new URL(request.url);
 if(!env.DB)return json({error:'D1 database is not configured yet.'},503);
 if(request.method==='GET'){
  const slug=url.searchParams.get('slug');
  if(slug){
   const post=await env.DB.prepare('SELECT * FROM posts WHERE slug = ? AND status = ? LIMIT 1').bind(slug,'published').first();
   if(!post)return json({error:'Post not found'},404);
   return json({post});
  }
  const limit=Math.min(Number(url.searchParams.get('limit')||20),100),category=url.searchParams.get('category'),district=url.searchParams.get('district');
  let sql='SELECT * FROM posts WHERE status = ?';const args=['published'];
  if(category){sql+=' AND category = ?';args.push(category)} if(district){sql+=' AND district = ?';args.push(district)}
  sql+=' ORDER BY published_at DESC LIMIT ?';args.push(limit);
  const {results}=await env.DB.prepare(sql).bind(...args).all();return json({posts:results});
 }
 if(!auth(request,env))return json({error:'Unauthorized'},401);
 const d=await request.json();
 if(request.method==='POST'){
  if(!d.title||!d.body)return json({error:'Title and body are required.'},400);
  const slug=slugify(d.title)+'-'+Date.now().toString(36),excerpt=String(d.body).replace(/<[^>]*>/g,'').slice(0,220);
  const r=await env.DB.prepare('INSERT INTO posts (slug,title,excerpt,body,category,district,image,video,source_url,author,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind(slug,d.title,excerpt,d.body,d.category||'Himachal',d.district||'Statewide',d.image||'',d.video||'',d.source||'',d.author||'जनसंवाद','published').run();
  return json({ok:true,id:r.meta.last_row_id,slug});
 }
 if(request.method==='PUT'){
  if(!d.id||!d.title||!d.body)return json({error:'id, title and body are required.'},400);
  await env.DB.prepare('UPDATE posts SET title=?,excerpt=?,body=?,category=?,district=?,image=?,video=?,source_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(d.title,String(d.body).replace(/<[^>]*>/g,'').slice(0,220),d.body,d.category||'Himachal',d.district||'Statewide',d.image||'',d.video||'',d.source||'',d.id).run();return json({ok:true});
 }
 if(request.method==='DELETE'){if(!d.id)return json({error:'id is required.'},400);await env.DB.prepare('DELETE FROM posts WHERE id=?').bind(d.id).run();return json({ok:true});}
 return json({error:'Method not allowed'},405);
}
export default{async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/posts')return api(request,env);return env.ASSETS.fetch(request)}};