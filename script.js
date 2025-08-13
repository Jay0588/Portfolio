// WebWiz static interactions

// Helpers
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

// Theme toggle
(function themeToggle(){
  const btn = $("#theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });
})();

// Mobile nav
(function mobileNav(){
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  $$("#nav-links a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
})();

// Custom cursor
(function cursor(){
  const dot = $("#cursor-dot");
  const ring = $("#cursor-ring");
  window.addEventListener("mousemove", (e) => {
    const { clientX:x, clientY:y } = e;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    ring.animate({ transform: `translate(${x}px, ${y}px)` }, { duration: 450, fill: "forwards" });
  });
})();

// Particles background (canvas) — connects nodes with lines
(function particles(){
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let w, h, raf;
  let nodes = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(120, Math.floor(w*h/15000));
    nodes = Array.from({length: count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
    }));
  }

  function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "rgba(8,10,22,0.9)";
    ctx.fillRect(0,0,w,h);

    // move
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    // lines
    for (let i=0;i<nodes.length;i++){
      for (let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist = Math.hypot(dx,dy);
        if (dist < 120){
          const alpha = 1 - dist/120;
          ctx.strokeStyle = `rgba(34,211,238,${alpha*0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // dots
    ctx.fillStyle = "rgba(34,211,238,0.7)";
    for (const p of nodes){
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); });
  resize(); draw();
})();

// Scroll reveal using IntersectionObserver
(function revealOnScroll(){
  const items = $$(".reveal");
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries){
      if (e.isIntersecting){
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();

// Project data (same as React version)
const PROJECTS = [
  { title: "Spark Trading Comapany Ltd.", url: "https://sparktrading.co.ke", img: "images/braceletbar.jpg", tags: ["Portfolio"], tech: ["Next.js","Tailwind","Stripe"] },
  { title: "Juhu Enterprise Ltd.", url: "https://juhuenterprise.com", img: "images/juhu.jpg", tags: ["Business","Portfolio"], tech: ["React","Motion"] },
];

// Stack items
const STACK = ["Next.js","React","TypeScript","Tailwind","Node.js","Express","PostgreSQL","MongoDB","Supabase","Shopify","WordPress","Stripe"];

// Render projects
(function renderProjects(){
  const grid = document.getElementById("projects");
  function card(p){
    const techTags = p.tech.map(t=>`<span class="tag">${t}</span>`).join("");
    return `<a href="${p.url}" target="_blank" rel="noreferrer" class="card project">
      <div class="thumb" style="background-image:url('${p.img}'); background-size:cover; background-position:center;"></div>
      <div class="meta">
        <div class="row" style="display:flex; align-items:center; justify-content:space-between;">
          <h3 style="margin:0;">${p.title}</h3><span style="opacity:.8;">↗</span>
        </div>
        <div class="tags">${techTags}</div>
      </div>
    </a>`;
  }
  grid.innerHTML = PROJECTS.map(card).join("");

  // filtering
  const chips = $$(".chip");
  const filter = (tag) => {
    const items = PROJECTS.filter(p=> tag==="All" ? true : p.tags.includes(tag));
    grid.innerHTML = items.map(card).join("");
  };
  chips.forEach(ch => ch.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    ch.classList.add("active");
    filter(ch.dataset.tag);
  }));
})();

// Render stack
(function renderStack(){
  const grid = document.getElementById("stack-grid");
  grid.innerHTML = STACK.map(s=>`<div class="stack-item">${s}</div>`).join("");
})();

// Testimonial rotator
(function testimonials(){
  const quotes = [
    { quote: "WebWiz transformed our idea into a blazing-fast site that actually converts.", who: "— A. Mehta", role: "Founder, D2C Brand" },
    { quote: "Their attention to detail and performance tuning is next-level.", who: "— R. Kapoor", role: "COO, Tech Startup" },
    { quote: "Pixel-perfect UI, clean code, and great communication.", who: "— S. Iyer", role: "Creative Director" },
  ];
  let i=0;
  const q = document.getElementById("quote");
  const w = document.getElementById("who");
  const r = document.getElementById("role");

  setInterval(()=>{
    i = (i+1) % quotes.length;
    // simple fade
    q.style.opacity = 0; w.style.opacity = 0; r.style.opacity = 0;
    setTimeout(()=>{
      q.textContent = "“" + quotes[i].quote + "”";
      w.textContent = quotes[i].who;
      r.textContent = quotes[i].role;
      q.style.opacity = 1; w.style.opacity = 1; r.style.opacity = 1;
    }, 250);
  }, 4000);
})();

// Contact form (no backend)
(function form(){
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    status.classList.remove("hidden");
  });
})();

// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();
