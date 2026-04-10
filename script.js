// Slider
(function(){
  var slides, dots, idx=0, timer;
  function init(){
    slides = document.querySelectorAll('.slide');
    dots   = document.querySelectorAll('.dots span');
    if(!slides.length) return;
    start();
  }
  function show(i){
    slides.forEach(function(s){s.classList.remove('active');});
    dots.forEach(function(d){d.classList.remove('active');});
    if(slides[i]) slides[i].classList.add('active');
    if(dots[i])   dots[i].classList.add('active');
  }
  function start(){ timer = setInterval(function(){ idx=(idx+1)%slides.length; show(idx); }, 4500); }
  window.changeSlide = function(s){ idx=(idx+s+slides.length)%slides.length; show(idx); clearInterval(timer); start(); };
  window.goToSlide   = function(i){ idx=i; show(i); clearInterval(timer); start(); };
  // Init after DOM ready — needed because slider is built by JS
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); } else { setTimeout(init, 50); }
})();

// Filter tabs (upcoming-trip.html)
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');
      var f = this.getAttribute('data-filter');
      document.querySelectorAll('.upcoming-card').forEach(function(c){
        c.style.display = (f==='all' || c.getAttribute('data-category')===f) ? 'block' : 'none';
      });
    });
  });
});
