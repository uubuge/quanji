window.__BASE_URL__="https://modelscope.cn/datasets/quejing/quanjiPDF/resolve/master/";
window.__INDEX__=[];
window.__DATA__={};

const S={
  B:window.__BASE_URL__||'https://modelscope.cn/datasets/quejing/quanjiPDF/resolve/master/',
  C:window.__INDEX__||[],
  D:{},A:0,P:1,PS:50,Q:'',L:new Set()
};

function vu(c,f){return S.B+'/'+encodeURI(c+'/'+f).replace(/%2F/g,'/')}
function du(c,f){return S.B+encodeURIComponent(c+'/'+f)}
function ou(c,f){return'https://modelscope.cn/datasets/quejing/quanjiPDF/file/view/master/'+encodeURIComponent(c+'/'+f)}
function fu(p){return p.startsWith('http')?p:'https://modelscope.cn/datasets/quejing/'+p}
function ph(){const r=decodeURIComponent(location.hash.slice(1)),i=r.indexOf('&page=');return{n:i>=0?r.slice(0,i):r||'',p:i>=0?+r.slice(i+6):0}}
function uh(n,p){let h='#'+encodeURIComponent(n);if(p&&p>1)h+='&page='+p;history.replaceState(null,'',h)}

function buildTabs(){
  document.getElementById('tabBar').innerHTML=S.C.map((c,i)=>
    '<a class="tab-btn'+(i===0?' active':'')+'" href="#'+encodeURIComponent(c.name)+'" data-idx="'+i+'" onclick="st('+i+');return false">'+
    eH(c.name.replace(/15000|20001|pdf|PDF/gi,'').replace('美式','·美式').replace('英式','·英式'))+'</a>'
  ).join('');
}

function st(idx,setH,pg){
  S.A=idx;S.P=(pg&&pg>0)?pg:1;S.Q='';
  const c=S.C[idx];
  if(setH!==false)uh(c.name,S.P);

  document.getElementById('heroCurrent').textContent=c.count.toLocaleString();

  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',+b.dataset.idx===idx));

  const lb=c.name,T=[];
  if(lb.includes('古典'))T.push('<span class="tag tag-purple">古典</span>');
  if(lb.includes('杂书'))T.push('<span class="tag tag-amber">杂书</span>');
  if(lb.includes('长篇'))T.push('<span class="tag tag-blue">长篇</span>');
  if(lb.includes('短篇'))T.push('<span class="tag tag-green">短篇</span>');
  if(lb.includes('美式'))T.push('<span class="tag tag-amber">美式</span>');
  if(lb.includes('英式'))T.push('<span class="tag tag-pink">英式</span>');

  document.getElementById('catTitle').textContent=lb.replace(/15000|20001|pdf|PDF/gi,'').replace('美式','·美式').replace('英式','·英式');
  document.getElementById('catTags').innerHTML=T.join('');
  document.getElementById('catCount').innerHTML='<strong>'+c.count.toLocaleString()+'</strong> 个 PDF';
  document.getElementById('catIcon').textContent=['📜','🏛️','📖','📚','📄','✒️','📕','📗'][idx]||'📘';

  document.getElementById('searchInput').value='';
  document.getElementById('fileBody').innerHTML='<tr><td colspan="4"><div class="loading"><div class="spinner"></div><p>加载中…</p></div></td></tr>';
  document.getElementById('statusBar').textContent='—';
  document.getElementById('pagination').innerHTML='';

  if(!S.D[lb])lc(lb);else rd();
}

async function lc(cn){
  const c=S.C.find(x=>x.name===cn);if(!c)return;
  const ms=c.batches.filter(b=>!S.L.has(b.file));
  if(ms.length){try{await Promise.all(ms.map(b=>fetch('data/'+b.file).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{window.__DATA__=window.__DATA__||{};window.__DATA__[b.file]=d;S.L.add(b.file)})))}catch(e){document.getElementById('fileBody').innerHTML='<tr><td colspan="4"><div class="empty"><div class="e-icon">⚠️</div><p>加载失败</p></div></td></tr>';return}}
  const fs=[];
  for(const b of c.batches){const r=window.__DATA__[b.file];if(!r)continue;for(const it of r){
    const n=it.name,f=it.path;
    fs.push({
      name:n,
      path:f,
      url:vu(cn,f),
      dlUrl:du(cn,f),
      orig:ou(cn,f),
      computer:it.computer||[],
      mobile:it.mobile||[]
    });
  }}
  S.D[cn]=fs;rd();
}

function rd(){
  const cn=S.C[S.A].name,fs=S.D[cn]||[];
  let f=fs;if(S.Q){const q=S.Q.toLowerCase();f=fs.filter(x=>x.name.toLowerCase().includes(q)||x.path.toLowerCase().includes(q))}
  const tp=Math.ceil(f.length/S.PS);if(S.P>tp)S.P=Math.max(1,tp);if(!tp)S.P=1;
  const stt=(S.P-1)*S.PS,pg=f.slice(stt,stt+S.PS);
  const g=document.getElementById('fileBody');
  if(!pg.length){
    g.innerHTML='<tr><td colspan="4"><div class="empty"><div class="e-icon">🔍</div><p>无匹配结果</p></div></td></tr>';
  }else{
    g.innerHTML=pg.map(function(x){
      var computerBtns='';
      if(x.computer&&x.computer.length){
        computerBtns='<div class="action-btns">';
        x.computer.forEach(function(u){
          computerBtns+='<a class="action-btn computer" href="'+eA(fu(u))+'" target="_blank" rel="noopener" title="下载电脑版ZIP">💻 ZIP</a>';
        });
        computerBtns+='</div>';
      }

      var mobileBtns='';
      if(x.mobile&&x.mobile.length){
        mobileBtns='<div class="action-btns">';
        x.mobile.forEach(function(u){
          mobileBtns+='<a class="action-btn mobile" href="'+eA(fu(u))+'" target="_blank" rel="noopener" title="下载手机版APK">📱 APK</a>';
        });
        mobileBtns+='</div>';
      }

      return '<tr>'+
        '<td><a class="file-link" href="'+eA(x.url)+'" target="_blank" rel="noopener">'+eH(x.name)+'</a>'+
          '<div class="btn-container">'+
            '<div class="action-btns">'+
              '<a class="action-btn download" href="'+eA(x.dlUrl)+'" target="_blank" rel="noopener" title="下载PDF">⬇ PDF</a>'+
              '<a class="action-btn origin" href="'+eA(x.orig)+'" target="_blank" rel="noopener" title="魔搭原地址">🔗</a>'+
            '</div>'+
            computerBtns+mobileBtns+
          '</div>'+
        '</td>'+
        '<td><div class="action-btns">'+
          '<a class="action-btn download" href="'+eA(x.dlUrl)+'" target="_blank" rel="noopener" title="下载PDF">⬇ PDF</a>'+
          '<a class="action-btn origin" href="'+eA(x.orig)+'" target="_blank" rel="noopener" title="魔搭原地址">🔗</a>'+
        '</div></td>'+
        '<td>'+computerBtns+'</td>'+
        '<td>'+mobileBtns+'</td>'+
      '</tr>';
    }).join('');
  }
  document.getElementById('statusBar').innerHTML='共 <strong>'+f.length.toLocaleString()+'</strong> 个文件';

  const pp=document.getElementById('pagination');if(tp<=1){pp.innerHTML='';return}
  let h='';
  h+='<button class="page-btn arrow" onclick="gp('+(S.P-1)+')" '+(S.P<=1?'disabled':'')+'>←</button>';
  const R=2;let a=Math.max(1,S.P-R),b=Math.min(tp,S.P+R);
  if(a>1)h+='<button class="page-btn num-btn" onclick="gp(1)">1</button>';
  if(a>2)h+='<span class="page-btn" style="pointer-events:none;border:none;background:transparent">…</span>';
  for(let i=a;i<=b;i++)h+='<button class="page-btn'+(i===S.P?' active':'')+'" onclick="gp('+i+')">'+i+'</button>';
  if(b<tp-1)h+='<span class="page-btn" style="pointer-events:none;border:none;background:transparent">…</span>';
  if(b<tp)h+='<button class="page-btn" onclick="gp('+tp+')">'+tp+'</button>';
  h+='<button class="page-btn arrow" onclick="gp('+(S.P+1)+')" '+(S.P>=tp?'disabled':'')+'>→</button>';
  h+='<span class="page-info">'+S.P+' / '+tp+'</span>';pp.innerHTML=h;
}

function gp(p){const cn=S.C[S.A].name,fs=S.D[cn]||[],f=S.Q?fs.filter(x=>x.name.toLowerCase().includes(S.Q)||x.path.toLowerCase().includes(S.Q)):fs;const t=Math.ceil(f.length/S.PS);if(p<1||p>t)return;S.P=p;uh(cn,p);rd();document.getElementById('catCard').scrollIntoView({behavior:'smooth',block:'start'})}

function os(v){clearTimeout(os._t);os._t=setTimeout(()=>{S.Q=v.trim().toLowerCase();S.P=1;rd()},250)}
function onSearch(v){os(v);}

function copyQQ(){navigator.clipboard.writeText('704100972').then(()=>alert('QQ号 704100972 已复制到剪贴板')).catch(()=>alert('QQ号：704100972'))}
function eH(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
function eA(s){return s.replace(/&/g,'&amp;').replace(/'/g,'&#39;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

(function(){
  fetch('data/categories.json').then(function(r){
    if(!r.ok)throw new Error(r.status);
    return r.json();
  }).then(function(data){
    window.__BASE_URL__=data.baseUrl||window.__BASE_URL__;
    S.B=window.__BASE_URL__;
    window.__INDEX__=data.categories||[];
    S.C=window.__INDEX__;
    if(window.__INDEX__.length){
      document.getElementById('heroCats').textContent=window.__INDEX__.length;
      document.getElementById('heroTotal').textContent=window.__INDEX__.reduce(function(s,c){return s+c.count},0).toLocaleString();
      buildTabs();
      var r=decodeURIComponent(location.hash.slice(1)),i=r.indexOf('&page=');
      var n=i>=0?r.slice(0,i):r||'';
      var p=i>=0?+r.slice(i+6):0;
      var j=n?window.__INDEX__.findIndex(function(c){return c.name===n}):-1;
      st(j>=0?j:0,false,p);
      window.addEventListener('hashchange',function(){
        var h=ph();
        var k=h.n?window.__INDEX__.findIndex(function(c){return c.name===h.n}):-1;
        if(k>=0&&k!==S.A)st(k,false,h.p);
      });
    }
  }).catch(function(e){
    document.getElementById('fileBody').innerHTML='<tr><td colspan="4"><div class="empty"><div class="e-icon">⚠️</div><p>数据加载失败</p></div></td></tr>';
  });
})();