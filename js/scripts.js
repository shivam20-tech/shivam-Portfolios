
    /* ── Cursor ── */
    const dot = document.getElementById('cDot');
    const ring = document.getElementById('cRing');
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e=>{
      mx=e.clientX; my=e.clientY;
      dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop(){ rx+=(mx-rx)*0.1; ry+=(my-ry)*0.1;
      ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.project-card,.certificate,.cert-toggle').forEach(el=>{
      el.addEventListener('mouseenter',()=>ring.classList.add('big'));
      el.addEventListener('mouseleave',()=>ring.classList.remove('big'));
    });

    /* ── Dark mode toggle ── */
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved preference
    const saved = localStorage.getItem('theme');
    if (saved) html.setAttribute('data-theme', saved);

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    /* ── Mobile nav ── */
    const toggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    toggle.addEventListener('click',()=>navbar.classList.toggle('active'));
    document.querySelectorAll('#navbar a').forEach(a=>a.addEventListener('click',()=>navbar.classList.remove('active')));

    /* ── Scroll reveal ── */
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on'); });
    },{threshold:0.1});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

    /* ── Active nav ── */
    const secs = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('nav a');
    const nObs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          links.forEach(a=>a.classList.remove('active'));
          const l=document.querySelector(`nav a[href="#${e.target.id}"]`);
          if(l) l.classList.add('active');
        }
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    secs.forEach(s=>nObs.observe(s));

    /* ── Certificates toggle ── */
    function toggleCerts(){
      const wrap = document.getElementById('certs-wrap');
      const btn  = document.querySelector('.cert-toggle');
      wrap.classList.toggle('open');
      btn.classList.toggle('open');
      btn.setAttribute('aria-expanded', btn.classList.contains('open'));
    }
    document.querySelector('.cert-toggle').addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleCerts(); }
    });

    console.log('✦ Shivam Mistry — Portfolio loaded');
