(function(){
var $=function(i){return document.getElementById(i)};
var a=$('a'),b=$('b'),score={a:0,b:0},last=0,cur=null,first=null;
function tick(){var n=Date.now();if(cur)score[cur]+=(n-last)/1000;last=n}
['a','b'].forEach(function(k){var el=$(k);
 el.addEventListener('focus',function(){tick();cur=k});
 el.addEventListener('blur',function(){tick();cur=null});
 el.addEventListener('input',function(){score[k]+=1.5;if(!first&&el.value)first=k});
 el.addEventListener('mouseenter',function(){tick();if(!cur)cur=k});
 el.addEventListener('mouseleave',function(){if(document.activeElement!==el){tick();cur=null}});
});
var demo=$('demo');
demo.onclick=function(){demo.setAttribute('aria-checked',demo.getAttribute('aria-checked')==='true'?'false':'true')};
var msgs=["Lendo as duas opções com atenção","Consultando 3 especialistas imaginários","Comparando prós e contras que você não listou","Perguntando para a sua intuição (ela não respondeu)","Calculando risco de arrependimento","Pesando o que o seu estômago acha","Reiniciando a análise por segurança","Quase lá. Só mais um pouquinho","Confirmando o que você já sabia"];
var timer=null,total=900,t0=0,done=false;
function fmt(s){s=Math.max(0,Math.ceil(s));return ('0'+Math.floor(s/60)).slice(-2)+':'+('0'+s%60).slice(-2)}
function show(id){['form','run','res'].forEach(function(x){var e=$(x);e.classList.remove('in');if(x!==id)e.classList.add('hidden')});
 var t=$(id);t.classList.remove('hidden');requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add('in')})})}
function finish(){
 if(done)return;done=true;clearInterval(timer);
 var av=a.value.trim(),bv=b.value.trim();
 var pick=score.a===score.b?(first||'a'):(score.a>score.b?'a':'b');
 var w=pick==='a'?av:bv,sa=Math.round(score.a),sb=Math.round(score.b);
 var sum=score.a+score.b,pa=sum?Math.round(score.a/sum*100):50,pb=100-pa;
 if(pick==='a'&&pa<50){pa=50;pb=50}if(pick==='b'&&pb<50){pa=50;pb=50}
 $('winner').innerHTML='';
 var em=document.createElement('em');em.textContent=w;$('winner').appendChild(em);
 $('why').textContent='Você deu mais atenção a “'+w+'” ('+(pick==='a'?sa:sb)+' contra '+(pick==='a'?sb:sa)+' na nossa medição). Ou seja, já queria isso desde o começo. Foi um prazer não ajudar.';
 var att=$('att');att.innerHTML='';
 [['a',av,pa],['b',bv,pb]].forEach(function(r){
  var d=document.createElement('div');if(r[0]===pick)d.className='w';
  var s=document.createElement('span');s.textContent=r[1];
  var bar=document.createElement('div');bar.className='bar';var i=document.createElement('i');bar.appendChild(i);
  var o=document.createElement('output');o.textContent=r[2]+'%';
  d.appendChild(s);d.appendChild(bar);d.appendChild(o);att.appendChild(d);
  setTimeout(function(){i.style.width=r[2]+'%'},350);
 });
 show('res');
}
$('start').onclick=function(){
 tick();$('err').textContent='';
 if(!a.value.trim()||!b.value.trim()){$('err').textContent='Preencha as duas opções para a IA poder decidir.';return}
 total=demo.getAttribute('aria-checked')==='true'?15:900;t0=Date.now();done=false;
 $('log').innerHTML='';$('skipmsg').textContent='';$('eta').textContent=fmt(total);
 show('run');
 var i=-1;
 timer=setInterval(function(){
  var el=(Date.now()-t0)/1000,p=Math.min(el/total,1);
  var shown=p<1?Math.min(99,Math.floor(p*100)):100;
  if(p>.9&&p<1)shown=Math.min(99,90+Math.floor((p-.9)*60));
  $('fill').style.width=shown+'%';$('pct').textContent=shown+'%';
  $('eta').textContent=fmt(total-el);
  var j=Math.min(msgs.length-1,Math.floor(p*msgs.length));
  if(j!==i){i=j;var li=document.createElement('li'),t=document.createElement('b'),m=document.createElement('span');
   t.textContent=fmt(el).replace(/^00:/,'00:');m.textContent=msgs[j];
   li.appendChild(t);li.appendChild(m);$('log').appendChild(li);
   while($('log').children.length>6)$('log').removeChild($('log').firstChild)}
  if(p>=1)finish();
 },250);
};
$('skip').onclick=function(){$('skipmsg').textContent='Pagamento recusado: cartão não encontrado, assim como a sua decisão.'};
$('again').onclick=function(){
 a.value='';b.value='';score={a:0,b:0};first=null;cur=null;
 show('form');setTimeout(function(){a.focus()},300);
};
})();
