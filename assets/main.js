const app=document.getElementById('app');
let cleanup=null;
function route(){
  if(cleanup){cleanup();cleanup=null;}
  const h=location.hash||'#/';
  const map={'#/':'t-home','#/blog':'t-blog','#/about':'t-about','#/blog/color-codes':'t-post'};
  const id=map[h]||'t-home';
  app.innerHTML='';app.appendChild(document.getElementById(id).content.cloneNode(true));
  document.querySelectorAll('aside nav a').forEach(a=>{
    const on=a.getAttribute('href')===h||(h.startsWith('#/blog')&&a.getAttribute('href')==='#/blog');
    on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
  window.scrollTo(0,0);
  if(id==='t-post') cleanup=initPost();
}
addEventListener('hashchange',route);

function hex2(n){return n.toString(16).padStart(2,'0').toUpperCase()}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0,l=(mx+mn)/2;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);
    h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];}

function initPost(){
  const $=id=>document.getElementById(id);
  const R=$('r'),G=$('g'),B=$('b');
  let marker,mode='cube',spin=true,raf;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){spin=false;$('spin').setAttribute('aria-pressed','false');}

  // three.js scene
  const canvas=$('cube');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(40,4/3,.1,100);cam.position.set(0,0,4.2);
  const group=new THREE.Group();scene.add(group);
  group.rotation.set(.5,-.7,0);

  const N=18,pos=[],col=[],cubePos=[],hslPos=[];
  for(let i=0;i<N;i++)for(let j=0;j<N;j++)for(let k=0;k<N;k++){
    const r=i/(N-1),g=j/(N-1),b=k/(N-1);
    col.push(r,g,b);cubePos.push(r-.5,g-.5,b-.5);
    const [h,s,l]=rgb2hsl(r*255,g*255,b*255);const a=h*Math.PI/180;
    hslPos.push(Math.cos(a)*s*.6,l-.5,Math.sin(a)*s*.6);
  }
  const geo=new THREE.BufferGeometry();
  const posArr=new Float32Array(cubePos);
  geo.setAttribute('position',new THREE.BufferAttribute(posArr,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:.035,vertexColors:true}));
  group.add(pts);

  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1)),
    new THREE.LineBasicMaterial({color:0x445566}));
  group.add(edges);
  const cyl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(.6,.6,1,48,1,true)),
    new THREE.LineBasicMaterial({color:0x445566}));cyl.visible=false;group.add(cyl);

  marker=new THREE.Mesh(new THREE.TorusGeometry(.06,.012,8,32),new THREE.MeshBasicMaterial({color:0xffffff}));
  scene.add(marker);

  let target=cubePos;
  function markerPos(){
    const r=+R.value/255,g=+G.value/255,b=+B.value/255;
    let v;
    if(mode==='cube') v=new THREE.Vector3(r-.5,g-.5,b-.5);
    else{const [h,s,l]=rgb2hsl(r*255,g*255,b*255),a=h*Math.PI/180;v=new THREE.Vector3(Math.cos(a)*s*.6,l-.5,Math.sin(a)*s*.6);}
    return group.localToWorld(v);
  }
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  resize();addEventListener('resize',resize);

  let drag=null;
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;
    group.rotation.y+=(e.clientX-drag.x)*.01;group.rotation.x+=(e.clientY-drag.y)*.01;drag={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('pointerup',()=>drag=null);

  function loop(){
    if(spin&&!drag) group.rotation.y+=.004;
    let moving=false;
    for(let i=0;i<posArr.length;i++){const d=target[i]-posArr[i];if(Math.abs(d)>1e-4){posArr[i]+=reduce?d:d*.08;moving=true;}}
    if(moving) geo.attributes.position.needsUpdate=true;
    group.updateMatrixWorld();
    marker.position.copy(markerPos());marker.lookAt(cam.position);
    renderer.render(scene,cam);raf=requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{
    mode=btn.dataset.mode;target=mode==='cube'?cubePos:hslPos;
    edges.visible=mode==='cube';cyl.visible=mode==='hsl';
    document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b===btn));
  }));
  $('spin').addEventListener('click',e=>{spin=!spin;e.currentTarget.setAttribute('aria-pressed',spin);});

  function update(){
    const r=+R.value,g=+G.value,b=+B.value;
    $('ro').textContent=r;$('go').textContent=g;$('bo').textContent=b;
    $('sw').style.background=`rgb(${r},${g},${b})`;
    $('hr').textContent=hex2(r);$('hg').textContent=hex2(g);$('hb').textContent=hex2(b);
    $('rgb').textContent=`rgb(${r}, ${g}, ${b})`;
    const [h,s,l]=rgb2hsl(r,g,b);
    $('hsl').textContent=`hsl(${Math.round(h)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  }
  [R,G,B].forEach(i=>i.addEventListener('input',update));update();

  return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);renderer.dispose();};
}
route();
