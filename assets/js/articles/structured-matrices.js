/* Small, deterministic SVG scenes: all geometry is derived from timeline progress.
   No animation framework, model download, or background autoplay is required. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = x => Math.max(0, Math.min(1, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  const part = (t, a, b) => ease(clamp((t - a) / (b - a)));
  const colors = ['var(--sm-teal)', 'var(--sm-violet)', 'var(--sm-amber)', 'var(--sm-blue)'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function el(tag, attrs = {}, text) {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function surface(host, height, description) {
    const w = host.clientWidth;
    const svg = el('svg', {viewBox: `0 0 ${w} ${height}`, height, role: 'img', 'aria-label': description});
    svg.append(el('title', {}, description));
    host.replaceChildren(svg);
    return {svg, w};
  }
  function text(svg, x, y, label, cls = '', anchor = 'middle') {
    const n = el('text', {x, y, class: cls, 'text-anchor': anchor}, label); svg.append(n); return n;
  }
  function line(svg, x1, y1, x2, y2, attrs = {}) {
    const n = el('line', {x1, y1, x2, y2, class:'sm-rule', ...attrs}); svg.append(n); return n;
  }
  function tile(svg, x, y, s, label, color = colors[0], opacity = .13, emphasis = false) {
    const g = el('g');
    g.append(el('rect', {x, y, width:s-3, height:s-3, rx:4, fill:color, 'fill-opacity':opacity}));
    if (emphasis) g.append(el('rect', {x:x+.5,y:y+.5,width:s-4,height:s-4,rx:4,fill:'none',stroke:color,'stroke-width':1.5}));
    g.append(el('text',{x:x+(s-3)/2,y:y+(s-3)/2+4,'text-anchor':'middle',class:'sm-number'},label));
    svg.append(g); return g;
  }
  function button(label, fn) {
    const b = document.createElement('button'); b.type='button'; b.textContent=label; b.addEventListener('click',fn); return b;
  }
  function player(figure, render, {duration=4200, initial=1, label='Progress', modes}={}) {
    const host=figure.querySelector('.sm-stage'), controls=figure.querySelector('.sm-controls');
    const caption=figure.querySelector('.sm-caption');
    let p=initial, running=false, raf=0, start=0;
    const play=button('Replay',()=>{
      if(running){stop();return;}
      if(reduced.matches){p=1;paint();return;}
      if(p>=1)p=0;
      running=true; play.textContent='Pause'; start=performance.now()-p*duration; raf=requestAnimationFrame(tick);
    });
    play.className='sm-play';
    const range=document.createElement('input');range.type='range';range.min=0;range.max=1000;range.step=1;
    range.setAttribute('aria-label',`${figure.querySelector('h3').textContent}: ${label.toLowerCase()}`);
    const wrap=document.createElement('label');wrap.className='sm-scrubber';
    const lab=document.createElement('span');lab.textContent=label;wrap.append(lab,range);
    const status=document.createElement('span');status.className='sr-only';status.setAttribute('aria-live','polite');
    if(modes) {
      const group=document.createElement('div');group.className='sm-modes';group.setAttribute('role','group');group.setAttribute('aria-label','Matrix structure');
      modes.forEach((m,i)=>{
        const b=button(m.label,()=>{stop();m.select();group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));p=reduced.matches?1:0;paint();if(!reduced.matches){running=true;play.textContent='Pause';start=performance.now();raf=requestAnimationFrame(tick);}});
        b.setAttribute('aria-pressed',String(i===0));group.append(b);
      });controls.append(group);
    }
    controls.append(play,wrap,status);controls.hidden=false;
    function paint(){range.value=Math.round(p*1000);figure.dataset.progress=p.toFixed(3);render(host,p,caption);if(!running)play.textContent=p>=1?'Replay':'Play';}
    function stop(){running=false;cancelAnimationFrame(raf);play.textContent=p>=1?'Replay':'Play';status.textContent=`Animation paused at ${Math.round(p*100)} percent.`;}
    function tick(now){p=clamp((now-start)/duration);paint();if(p<1&&running)raf=requestAnimationFrame(tick);else{stop();status.textContent='Animation complete.';}}
    range.addEventListener('input',()=>{stop();p=Number(range.value)/1000;paint();});
    new ResizeObserver(()=>paint()).observe(host);
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&running)stop();}).observe(figure);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    reduced.addEventListener('change',()=>{if(reduced.matches){stop();p=1;paint();}});
    paint();
  }

  function sharing(figure) {
    let mode='dense';
    const names={dense:'Dense',toeplitz:'Toeplitz',circulant:'Circulant'};
    player(figure,(host,p,caption)=>{
      const narrow=host.clientWidth<520;
      const {svg,w}=surface(host,narrow?365:250,`${names[mode]} matrix: sixteen entries generated from ${mode==='dense'?16:mode==='toeplitz'?7:4} stored parameters.`);
      const s=42, matrixX=narrow?(w-168)/2:w-192, matrixY=narrow?160:39;
      const paletteX=narrow?(w-224)/2:16, paletteY=40;
      const count=mode==='dense'?16:mode==='toeplitz'?7:4;
      const cols=narrow?8:4, ps=28;
      text(svg,paletteX,paletteY-16,'STORED PARAMETERS','sm-small','start');
      const parameterLabel=k=>mode==='dense'?String.fromCharCode(97+k):mode==='toeplitz'?String.fromCharCode(97+k):`c${k}`;
      for(let k=0;k<count;k++) tile(svg,paletteX+(k%cols)*ps,paletteY+Math.floor(k/cols)*ps,ps,parameterLabel(k),colors[k%4],.13);
      text(svg,narrow?w/2:paletteX,narrow?125:198,`${count} learned values`,'sm-number',narrow?'middle':'start');
      if(!narrow){text(svg,w/2,111,'→','sm-large');text(svg,w/2,137,'expand','sm-small');}
      text(svg,matrixX+84,matrixY-15,'THE 4 × 4 MATRIX','sm-small');
      const t=part(p,0,.8);
      for(let i=0;i<4;i++)for(let j=0;j<4;j++){
        const k=mode==='dense'?i*4+j:mode==='toeplitz'?i-j+3:(i-j+4)%4;
        const targetX=matrixX+j*s,targetY=matrixY+i*s;
        tile(svg,targetX,targetY,s,'','var(--sm-ink)',.025);
        const sx=paletteX+(k%cols)*ps,sy=paletteY+Math.floor(k/cols)*ps;
        const local=part(t,0.025*(i+j),.8+0.025*(i+j));
        const g=tile(svg,mix(sx,targetX,local),mix(sy,targetY,local),mix(ps,s,local),parameterLabel(k),colors[k%4],.1+.07*local);
        g.setAttribute('opacity',.25+.75*local);
      }
      text(svg,matrixX+84,matrixY+191,'16 entries','sm-small');
      figure.dataset.mode=mode;figure.dataset.parameters=count;
      caption.textContent=mode==='dense'?'Dense: each entry has its own parameter. The small palette is simply another way to store the same sixteen values.':mode==='toeplitz'?'Toeplitz: entries on the same diagonal share a parameter. Sixteen entries, but only seven independently learned values.':'Circulant: each row is a cyclic shift. Four learned values determine all sixteen entries. Repeated labels identify shared parameters.';
    },{duration:2400,modes:Object.keys(names).map(key=>({label:names[key],select:()=>{mode=key;}}))});
  }

  function circular(figure) {
    const c=[2,1,0,-1],x=[1,2,3,4];
    player(figure,(host,p,caption)=>{
      const {svg,w}=surface(host,285,'Circular convolution. Shift the same four weights, multiply by the fixed input, and sum for each output.');
      const size=Math.min(54,(w-32)/4),left=(w-size*4)/2;
      const phase=p*3, row=Math.min(3,Math.floor(phase+1e-7)), fraction=phase-row;
      // Hold each row before moving; the wrapping entry follows a separate arc.
      const shift=part(fraction,.35,.85), liveRow=Math.min(3,row+(shift>.5?1:0));
      text(svg,16,17,'CYCLIC WEIGHTS','sm-small','start');
      text(svg,w-16,17,`output y${liveRow}`,'sm-small','end');
      for(let j=0;j<4;j++){
        const k=(row-j+4)%4;
        let px=left+j*size,py=64;
        if(j<3)px+=shift*size;
        else{px=mix(left+3*size,left,shift);py-=38*Math.sin(Math.PI*shift);}
        tile(svg,px,py,size,String(c[k]),colors[k],.18);
        if(shift===0)text(svg,left+j*size+(size-3)/2,139,'×','sm-small');
        tile(svg,left+j*size,155,size,String(x[j]),'var(--sm-ink)',.05);
      }
      text(svg,16,155+size+27,'FIXED INPUT x','sm-small','start');
      const coeff=x.map((_,j)=>c[(liveRow-j+4)%4]);
      const sum=coeff.reduce((acc,v,j)=>acc+v*x[j],0);
      const expression=coeff.map((v,j)=>`${v<0?'('+v+')':v}×${x[j]}`).join(' + ');
      text(svg,w/2,265,`${expression} = ${sum}`,'sm-number');
      figure.dataset.row=liveRow;figure.dataset.output=sum;
      caption.textContent=`Row ${liveRow}: [${coeff.join(', ')}] · [${x.join(', ')}] = ${sum}. The input stays fixed; the weights wrap around. Colors follow the original weights, not their positions.`;
    },{initial:0,duration:7200,label:'Row'});
  }

  function kronecker(figure) {
    const a=[1,2,-1,0],b=[1,2,3,4];
    player(figure,(host,p,caption)=>{
      const {svg,w}=surface(host,410,'Build a Kronecker product. Each entry of A scales a complete copy of B to create one output block.');
      const s=34, ax=w/2-105,bx=w/2+37,top=26,ox=w/2-80,oy=218,os=40;
      text(svg,ax+s,17,'A','sm-number');text(svg,bx+s,17,'B','sm-number');text(svg,w/2,65,'⊗','sm-large');
      a.forEach((v,k)=>tile(svg,ax+(k%2)*s,top+Math.floor(k/2)*s,s,String(v),colors[k],.16));
      b.forEach((v,k)=>tile(svg,bx+(k%2)*s,top+Math.floor(k/2)*s,s,String(v),'var(--sm-ink)',.05));
      text(svg,w/2,122,'4 parameters + 4 parameters','sm-small');
      text(svg,w/2,199,'A ⊗ B','sm-number');
      for(let q=0;q<4;q++){
        const t=part(p,q/4,(q+.85)/4), qr=Math.floor(q/2),qc=q%2;
        for(let k=0;k<4;k++){
          const r=Math.floor(k/2),col=k%2,tx=ox+(qc*2+col)*os,ty=oy+(qr*2+r)*os;
          tile(svg,tx,ty,os,'','var(--sm-ink)',.025);
          if(t>0){const g=tile(svg,mix(bx+col*s,tx,t),mix(top+r*s,ty,t),mix(s,os,t),String(t<.6?b[k]:a[q]*b[k]),colors[q],.16);g.setAttribute('opacity',Math.min(1,t*4));}
        }
      }
      const active=Math.min(3,Math.floor(p*4));
      text(svg,w/2,163,p>=1?'The completed Kronecker product':`${a[active]} × B → block ${active+1}`,'sm-small');
      text(svg,w/2,403,'8 stored parameters · 16 generated entries','sm-small');
      caption.textContent='Each colored block is a scaled copy of B. The zero in A creates a zero block; −1 reverses the signs. In a fast layer, we apply the two small matrices without materializing this large one.';
      figure.dataset.product=JSON.stringify(Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>a[Math.floor(i/2)*2+Math.floor(j/2)]*b[(i%2)*2+j%2])));
    },{duration:6400,initial:0,label:'Build'});
  }

  function butterfly(figure) {
    player(figure,(host,p,caption)=>{
      const {svg,w}=surface(host,315,'An eight-input butterfly network with three pairwise mixing stages. Follow the influence of the first input as it reaches all eight outputs.');
      const xs=Array.from({length:4},(_,i)=>mix(33,w-33,i/3)), ys=Array.from({length:8},(_,i)=>57+i*27);
      const progress=p*3;
      for(let layer=0;layer<3;layer++){
        const t=part(progress,layer+.12,layer+.88),stride=1<<layer;
        for(let i=0;i<8;i++)for(const j of [i,i^stride]){
          const active=i<(1<<layer), attrs={stroke:active?colors[0]:'var(--sm-line)','stroke-width':active?1.7:1,opacity:active?.32:1};
          // One straight path per coefficient; both incoming values feed each 2×2 mix.
          const path=el('path',{d:`M ${xs[layer]} ${ys[i]} L ${xs[layer+1]} ${ys[j]}`,fill:'none',...attrs});svg.append(path);
          if(active&&t>0){const length=Math.hypot(xs[layer+1]-xs[layer],ys[j]-ys[i]);svg.append(el('path',{d:path.getAttribute('d'),fill:'none',stroke:colors[0],'stroke-width':2,'stroke-dasharray':length,'stroke-dashoffset':length*(1-t)}));}
        }
      }
      for(let layer=0;layer<4;layer++){
        text(svg,xs[layer],23,layer===0?'Input':`Stage ${layer}`,'sm-small');
        for(let i=0;i<8;i++){
          const t=layer===0?1:part(progress,layer-.88,layer-.12), active=i<(1<<layer);
          svg.append(el('circle',{cx:xs[layer],cy:ys[i],r:6.5,fill:'var(--sm-paper)',stroke:'var(--sm-line)'}));
          if(active)svg.append(el('circle',{cx:xs[layer],cy:ys[i],r:6.5,fill:colors[0],'fill-opacity':t}));
        }
        text(svg,xs[layer],278,layer===0?'1 input':`${1<<layer} reached`,'sm-small');
      }
      const reached=1<<Math.min(3,Math.floor(progress+.12));
      text(svg,w/2,310,'8 values · 3 stages · 4 pairwise mixes per stage','sm-small');
      caption.textContent='Follow the first input. Each stage doubles the set of outputs it can influence: 1 → 2 → 4 → 8. Lines show dependencies, not numerical weights. Every stage still mixes all eight values.';
      figure.dataset.reached=reached;
    },{duration:6300,initial:0,label:'Stages'});
  }

  function monarch(figure) {
    player(figure,(host,p,caption)=>{
      const {svg,w}=surface(host,340,'Monarch routing: mix within rows, transpose, mix within the new rows, and transpose back.');
      const s=51, gx=(w-153)/2,gy=88,t=p*4;
      const first=part(t,0,.75),shuffle=part(t,1,1.85),second=part(t,2,2.75),restore=part(t,3,3.85);
      const movement=shuffle*(1-restore);
      const stage=Math.min(3,Math.floor(t));
      const titles=['1. Mix within groups · R','2. Transpose · Pᵀ','3. Mix the new groups · L','4. Restore order · P'];
      text(svg,w/2,24,titles[stage],'sm-number');
      text(svg,w/2,48,['Each row is one dense block.','Move (row, column) to (column, row).','Each group now spans the original rows.','Bring the mixed values back to their positions.'][stage],'sm-small');
      for(let r=0;r<3;r++)svg.append(el('rect',{x:gx-12,y:gy+r*s-6,width:177,height:49,rx:5,fill:'var(--sm-ink)','fill-opacity':.035}));
      for(let i=0;i<9;i++){
        const row=Math.floor(i/3),col=i%3,px=gx+mix(col,row,movement)*s,py=gy+mix(row,col,movement)*s;
        const g=tile(svg,px,py,s-6,`${String.fromCharCode(65+row)}${col+1}`,colors[row],.16);
        if((stage===0&&first>0)||(stage===2&&second>0)){
          const op=stage===0?Math.sin(first*Math.PI):Math.sin(second*Math.PI);
          g.append(el('rect',{x:px,y:py,width:s-9,height:s-9,rx:4,fill:'none',stroke:colors[row],'stroke-width':2,opacity:op}));
        }
      }
      for(let i=0;i<4;i++)svg.append(el('rect',{x:(w-164)/2+i*44,y:275,width:32,height:3,rx:1.5,fill:i===stage?colors[0]:'var(--sm-line)'}));
      text(svg,w/2,310,'9 values · two sets of three 3 × 3 blocks','sm-small');
      caption.textContent='Routing schematic: A, B, and C mark the original groups; labels track positions, not unchanged numerical values. Each block multiplication mixes values within a row. After transposing, each row contains one value from each original group.';
      figure.dataset.permutation=JSON.stringify(Array.from({length:9},(_,i)=>movement>.5?(i%3)*3+Math.floor(i/3):i));
    },{duration:8000,initial:0,label:'Operation'});
  }

  const scenes={sharing,circular,kronecker,butterfly,monarch};
  document.querySelectorAll('[data-sm]').forEach(figure=>{
    const initialize=scenes[figure.dataset.sm];
    if(initialize)initialize(figure);
  });
})();
