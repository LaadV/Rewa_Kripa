(function(){
  var slides=document.querySelectorAll('.slide');
  var dots=document.querySelectorAll('.dots span');
  var idx=0,timer;
  if(!slides.length)return;
  function show(i){
    slides.forEach(function(s){s.classList.remove('active');});
    dots.forEach(function(d){d.classList.remove('active');});
    slides[i].classList.add('active');
    if(dots[i])dots[i].classList.add('active');
  }
  function start(){timer=setInterval(function(){idx=(idx+1)%slides.length;show(idx);},4500);}
  window.changeSlide=function(s){idx=(idx+s+slides.length)%slides.length;show(idx);clearInterval(timer);start();};
  window.goToSlide=function(i){idx=i;show(i);clearInterval(timer);start();};
  start();
})();
document.querySelectorAll('.filter-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
    this.classList.add('active');
    var f=this.getAttribute('data-filter');
    document.querySelectorAll('.upcoming-card').forEach(function(c){
      c.style.display=(f==='all'||c.getAttribute('data-category')===f)?'block':'none';
    });
  });
});
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var el=document.getElementById(this.getAttribute('href').slice(1));
    if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}
  });
});
