/* ===========================================================
   THE FOREX PROGRAM — app.js
   Real auth + progress tracking via Supabase.
=============================================================== */

/* ---------------- Theme (still local — a UI preference, not user data) ---------------- */
(function initTheme(){
  const saved = localStorage.getItem("tfp_theme");
  const theme = saved || "dark";
  document.documentElement.setAttribute("data-theme", theme);
})();

function toggleTheme(){
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("tfp_theme", next);
}

function wireThemeToggle(){
  document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
    btn.addEventListener("click", toggleTheme);
  });
}

/* ---------------- Auth (Supabase) ---------------- */
const AUTH = {
  async signup(name, email, password){
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { name } } // stored as user_metadata
    });
    if(error) return { ok:false, error: error.message };
    return { ok:true, user:data.user };
  },
  async login(email, password){
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if(error) return { ok:false, error: error.message };
    return { ok:true, user:data.user };
  },
  async logout(){
    await supabaseClient.auth.signOut();
  },
  async getSession(){
    const { data } = await supabaseClient.auth.getUser();
    return data.user || null;
  },
  async requireAuth(){
    const user = await AUTH.getSession();
    if(!user){
      window.location.href = "login.html";
      return null;
    }
    return user;
  },
  displayName(user){
    return (user.user_metadata && user.user_metadata.name) || user.email.split("@")[0];
  }
};

/* ---------------- Progress (Supabase table: public.progress) ---------------- */
const PROGRESS = {
  async getAll(userId){
    const { data, error } = await supabaseClient
      .from("progress")
      .select("course_id, done")
      .eq("user_id", userId);
    if(error){ console.error(error); return {}; }
    const map = {};
    data.forEach(row => { map[row.course_id] = row.done; });
    return map;
  },
  async set(userId, courseId, done){
    const { error } = await supabaseClient
      .from("progress")
      .upsert({ user_id:userId, course_id:courseId, done }, { onConflict:"user_id,course_id" });
    if(error) console.error(error);
  },
  percentComplete(map){
    const done = Object.values(map).filter(Boolean).length;
    return Math.round((done / COURSES.length) * 100);
  }
};

/* ---------------- Auth form wiring ---------------- */
function wireSignupForm(){
  const form = document.getElementById("signup-form");
  if(!form) return;
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const name = document.getElementById("su-name").value.trim();
    const email = document.getElementById("su-email").value.trim();
    const password = document.getElementById("su-password").value;
    const msg = document.getElementById("form-msg");
    const submitBtn = form.querySelector("button[type=submit]");

    if(!name || !email || password.length < 6){
      msg.textContent = "Please fill every field — password needs at least 6 characters.";
      msg.className = "form-msg error show";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";
    const result = await AUTH.signup(name, email, password);
    submitBtn.disabled = false;
    submitBtn.textContent = "Create account";

    if(!result.ok){
      msg.textContent = result.error;
      msg.className = "form-msg error show";
      return;
    }

    if(result.user && !result.user.confirmed_at && !result.user.session){
      msg.textContent = "Account created! Check your email to confirm, then log in.";
      msg.className = "form-msg ok show";
      setTimeout(()=>{ window.location.href = "login.html"; }, 1600);
      return;
    }

    msg.textContent = "Account created — redirecting to your dashboard...";
    msg.className = "form-msg ok show";
    setTimeout(()=>{ window.location.href = "dashboard.html"; }, 700);
  });
}

function wireLoginForm(){
  const form = document.getElementById("login-form");
  if(!form) return;
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = document.getElementById("li-email").value.trim();
    const password = document.getElementById("li-password").value;
    const msg = document.getElementById("form-msg");
    const submitBtn = form.querySelector("button[type=submit]");

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";
    const result = await AUTH.login(email, password);
    submitBtn.disabled = false;
    submitBtn.textContent = "Log in";

    if(!result.ok){
      msg.textContent = result.error;
      msg.className = "form-msg error show";
      return;
    }
    msg.textContent = "Welcome back — redirecting...";
    msg.className = "form-msg ok show";
    setTimeout(()=>{ window.location.href = "dashboard.html"; }, 500);
  });
}

function wireLogoutButtons(){
  document.querySelectorAll("[data-logout]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      await AUTH.logout();
      window.location.href = "index.html";
    });
  });
}

/* ---------------- Icon helpers ---------------- */
function playIconSVG(){
  return `<svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7L8 5z" fill="white"/></svg>`;
}
function thumbIconSVG(){
  return `<svg viewBox="0 0 48 48" fill="none"><path d="M6 34 L16 22 L24 28 L34 14 L42 20" stroke="var(--accent)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42" cy="20" r="2.6" fill="var(--accent)"/></svg>`;
}

/* ---------------- Dashboard rendering ---------------- */
async function initDashboard(){
  const grid = document.getElementById("course-grid");
  if(!grid) return;

  const user = await AUTH.requireAuth();
  if(!user) return;

  document.getElementById("dash-name").textContent = AUTH.displayName(user).split(" ")[0];
  document.getElementById("dash-avatar").textContent = AUTH.displayName(user).charAt(0).toUpperCase();

  let progressMap = await PROGRESS.getAll(user.id);

  function paintOverall(){
    const pct = PROGRESS.percentComplete(progressMap);
    document.getElementById("overall-pct").textContent = pct + "%";
    document.getElementById("overall-bar").style.width = pct + "%";
  }
  paintOverall();

  let activeFilter = "All";

  function render(){
    grid.innerHTML = "";
    const list = COURSES.filter(c => activeFilter === "All" || c.level === activeFilter);

    list.forEach(course=>{
      const done = !!progressMap[course.id];
      const card = document.createElement("a");
      card.href = `course.html?id=${course.id}`;
      card.className = "course-card";
      card.innerHTML = `
        <div class="course-thumb">
          ${thumbIconSVG()}
          <span class="lvl">${course.level}</span>
          <div class="play"><div class="play-btn">${playIconSVG()}</div></div>
        </div>
        <div class="course-body">
          <span class="course-index mono">LESSON ${String(course.id).padStart(2,"0")}</span>
          <h4>${course.title}</h4>
          <p>${course.desc}</p>
          <div class="course-meta">
            <div class="progress-mini"><span style="width:${done ? 100 : 0}%"></span></div>
            <span class="status-chip ${done ? "done" : ""}">${done ? "✓ Completed" : "Not started"}</span>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      render();
    });
  });

  render();
}

/* ---------------- Player rendering ---------------- */
async function initPlayer(){
  const titleEl = document.getElementById("lesson-title");
  if(!titleEl) return;

  const user = await AUTH.requireAuth();
  if(!user) return;

  const params = new URLSearchParams(window.location.search);
  let id = parseInt(params.get("id") || "1", 10);
  if(!COURSES.find(c=>c.id === id)) id = 1;

  let progressMap = await PROGRESS.getAll(user.id);

  async function load(courseId){
    const course = COURSES.find(c=>c.id === courseId);
    document.getElementById("lesson-title").textContent = course.title;
    document.getElementById("lesson-desc").textContent = course.desc;
    document.getElementById("lesson-level").textContent = course.level;
    document.getElementById("lesson-crumb").textContent = course.title;
    document.getElementById("watermark").textContent = `${user.email} · THE FOREX PROGRAM`;
    document.getElementById("vimeo-player").src = `https://player.vimeo.com/video/${course.vimeoId}?title=0&byline=0&portrait=0`;

    const markBtn = document.getElementById("mark-complete");
    const isDone = !!progressMap[courseId];
    markBtn.textContent = isDone ? "✓ Marked complete" : "Mark as complete";
    markBtn.classList.toggle("btn-primary", !isDone);
    markBtn.classList.toggle("btn-ghost", isDone);

    markBtn.onclick = async ()=>{
      const nowDone = !progressMap[courseId];
      markBtn.disabled = true;
      await PROGRESS.set(user.id, courseId, nowDone);
      progressMap[courseId] = nowDone;
      markBtn.disabled = false;
      load(courseId);
    };

    // sidebar
    const list = document.getElementById("lesson-list");
    list.innerHTML = "";
    COURSES.forEach(c=>{
      const item = document.createElement("a");
      item.href = `course.html?id=${c.id}`;
      const done = !!progressMap[c.id];
      item.className = `side-item ${c.id === courseId ? "active" : ""} ${done ? "done" : ""}`;
      item.innerHTML = `
        <span class="side-num mono">${done ? "✓" : String(c.id).padStart(2,"0")}</span>
        <span class="side-title">${c.title}</span>`;
      list.appendChild(item);
    });

    const activeItem = list.querySelector(".side-item.active");
    if(activeItem) activeItem.scrollIntoView({ block:"center" });

    // next / prev
    const idx = COURSES.findIndex(c=>c.id === courseId);
    const nextBtn = document.getElementById("next-lesson");
    const prevBtn = document.getElementById("prev-lesson");
    if(idx < COURSES.length - 1){
      nextBtn.style.visibility = "visible";
      nextBtn.onclick = ()=> window.location.href = `course.html?id=${COURSES[idx+1].id}`;
    } else {
      nextBtn.style.visibility = "hidden";
    }
    if(idx > 0){
      prevBtn.style.visibility = "visible";
      prevBtn.onclick = ()=> window.location.href = `course.html?id=${COURSES[idx-1].id}`;
    } else {
      prevBtn.style.visibility = "hidden";
    }
  }

  load(id);
}

/* ---------------- Content-protection (deterrent only) ----------------
   Disables right-click on the video area. This raises casual friction
   only — it cannot stop screen recording and is not real DRM. */
function wireContentGuards(){
  document.querySelectorAll("[data-protected]").forEach(el=>{
    el.addEventListener("contextmenu", e=>e.preventDefault());
  });
}

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  wireThemeToggle();
  wireSignupForm();
  wireLoginForm();
  wireLogoutButtons();
  wireContentGuards();
  if(typeof COURSES !== "undefined"){
    initDashboard();
    initPlayer();
  }
});
