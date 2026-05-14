// ============================================================
//  RESUME ANALYZER — script.js
//  No paid API. Pure JS logic. Day 3 project.
// ============================================================

// --- CONFIG ---
const KEYWORDS = [
  "javascript", "python", "react", "node", "html", "css", "git", "sql",
  "api", "rest", "typescript", "docker", "aws", "linux", "mongodb",
  "express", "github", "agile", "problem-solving", "communication",
  "teamwork", "leadership", "full-stack", "frontend", "backend",
  "database", "deployment", "testing", "debugging", "redux", "graphql"
];

const WEAK_VERBS = [
  "did", "made", "worked", "helped", "used", "got", "had", "went",
  "was", "were", "been", "did some", "helped with"
];

const STRONG_VERBS = [
  "built", "developed", "designed", "implemented", "led", "optimized",
  "created", "launched", "automated", "reduced", "increased", "delivered",
  "architected", "improved", "deployed", "integrated", "engineered",
  "streamlined", "maintained", "collaborated", "managed", "shipped"
];

// ============================================================
//  MAIN FUNCTION
// ============================================================
function analyzeResume() {
  const text = document.getElementById("resume-input").value.trim();

  if (text.length < 50) {
    alert("Please paste more complete resume content.");
    return;
  }

  const lower = text.toLowerCase();
  const wordCount = lower.split(/\s+/).length;

  // ---- 1. CONTACT INFO (0-15 pts) ----
  let contact = 0;
  if (/@\w+\.\w+/.test(text))         contact += 5;  // email
  if (/linkedin\.com/i.test(text))     contact += 4;  // linkedin
  if (/github\.com/i.test(text))       contact += 4;  // github
  if (/\+?\d[\d\s\-()]{7,}/.test(text)) contact += 2; // phone
  const contactScore = Math.min(contact, 15);

  // ---- 2. SUMMARY / OBJECTIVE (0-15 pts) ----
  let summary = 0;
  if (/summary|objective|profile|about me/i.test(text)) summary += 8;
  const summaryMatch = text.match(/summary[\s\S]{0,500}/i);
  if (summaryMatch && summaryMatch[0].split(/\s+/).length > 25) summary += 7;
  const summaryScore = Math.min(summary, 15);

  // ---- 3. SKILLS (0-20 pts) ----
  let skills = 0;
  if (/skills|technologies|tech stack|tools/i.test(text)) skills += 6;
  const foundKeywords = KEYWORDS.filter(k => lower.includes(k));
  skills += Math.min(foundKeywords.length * 1.4, 14);
  const skillsScore = Math.min(Math.round(skills), 20);

  // ---- 4. EXPERIENCE (0-25 pts) ----
  let exp = 0;
  if (/experience|work history|employment|internship/i.test(text)) exp += 6;
  const strongFound = STRONG_VERBS.filter(v => lower.includes(v));
  exp += Math.min(strongFound.length * 2.5, 12);
  const hasMetrics = /\d+%|\d+ users|\d+ projects|\d+x|increased|decreased|reduced|improved by/i.test(text);
  if (hasMetrics) exp += 7;
  const expScore = Math.min(Math.round(exp), 25);

  // ---- 5. EDUCATION (0-10 pts) ----
  let edu = 0;
  if (/education|university|college|degree|bachelor|master|b\.tech|b\.e\.|diploma|school/i.test(text)) edu += 10;
  const eduScore = Math.min(edu, 10);

  // ---- 6. COMPLETENESS / LENGTH (0-15 pts) ----
  let completeness = 0;
  if (wordCount >= 100) completeness += 5;
  if (wordCount >= 250) completeness += 5;
  if (wordCount >= 450) completeness += 5;
  const completenessScore = Math.min(completeness, 15);

  // ---- TOTAL ----
  const total = contactScore + summaryScore + skillsScore + expScore + eduScore + completenessScore;

  // ---- GRADE ----
  let grade, desc, color;
  if (total >= 80) {
    grade = "Excellent 🎉"; desc = "Your resume is strong and ready to send. Keep polishing."; color = "#1D9E75";
  } else if (total >= 65) {
    grade = "Good"; desc = "Solid resume — a few targeted improvements will make it stand out."; color = "#639922";
  } else if (total >= 45) {
    grade = "Needs Work"; desc = "You're on the right track but missing some key recruiter signals."; color = "#BA7517";
  } else {
    grade = "Weak"; desc = "Several important sections are missing. Follow the suggestions below."; color = "#D85A30";
  }

  // ============================================================
  //  RENDER RESULTS
  // ============================================================

  // Score circle
  document.getElementById("score-number").textContent = total;
  document.getElementById("score-number").style.color = color;
  document.getElementById("score-circle").style.borderColor = color;
  document.getElementById("score-grade").textContent = grade;
  document.getElementById("score-grade").style.color = color;
  document.getElementById("score-desc").textContent = desc;

  // Progress bars
  const barDefs = [
    { label: "Contact info", score: contactScore, max: 15 },
    { label: "Summary",      score: summaryScore, max: 15 },
    { label: "Skills",       score: skillsScore,  max: 20 },
    { label: "Experience",   score: expScore,     max: 25 },
    { label: "Education",    score: eduScore,     max: 10 },
    { label: "Length",       score: completenessScore, max: 15 },
  ];

  document.getElementById("bars").innerHTML = barDefs.map(b => {
    const pct = Math.round((b.score / b.max) * 100);
    const barColor = pct >= 70 ? "#1D9E75" : pct >= 40 ? "#BA7517" : "#D85A30";
    return `
      <div class="bar-row">
        <span class="bar-label">${b.label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:0%; background:${barColor};"
               data-target="${pct}"></div>
        </div>
        <span class="bar-val">${b.score}/${b.max}</span>
      </div>`;
  }).join("");

  // Animate bars after render
  setTimeout(() => {
    document.querySelectorAll(".bar-fill").forEach(el => {
      el.style.width = el.dataset.target + "%";
    });
  }, 50);

  // Suggestions
  const tips = [];

  if (contactScore < 10)
    tips.push({ type: "bad", icon: "❌", text: "Add your email, LinkedIn, and GitHub. These are the FIRST things recruiters check." });
  else
    tips.push({ type: "good", icon: "✅", text: "Contact information looks complete." });

  if (summaryScore < 10)
    tips.push({ type: "warn", icon: "💡", text: "Add a 3–4 line professional summary at the top. This is your elevator pitch to the recruiter." });

  if (skillsScore < 12)
    tips.push({ type: "warn", icon: "⚡", text: "Expand your skills section. List specific tools, frameworks, and languages you know." });

  if (!hasMetrics)
    tips.push({ type: "bad", icon: "📊", text: "No measurable results found. Add numbers: 'Reduced load time by 30%', 'Built app used by 500+ users', 'Completed 5+ projects'." });
  else
    tips.push({ type: "good", icon: "✅", text: "Great — you've included measurable results. Recruiters love numbers." });

  if (strongFound.length < 3)
    tips.push({ type: "warn", icon: "✍️", text: `Use strong action verbs. Try: ${STRONG_VERBS.slice(0,5).join(", ")}. Avoid weak words like 'did', 'made', 'helped'.` });
  else
    tips.push({ type: "good", icon: "✅", text: `Good action verbs detected: ${strongFound.slice(0,4).join(", ")}.` });

  if (eduScore === 0)
    tips.push({ type: "bad", icon: "🎓", text: "Add your education section. Include degree name, institution, and graduation year." });

  if (wordCount < 200)
    tips.push({ type: "bad", icon: "📄", text: `Resume seems short (${wordCount} words). Aim for 350–600 words to cover all key sections.` });

  if (!/github\.com/i.test(text))
    tips.push({ type: "warn", icon: "🔗", text: "No GitHub link found. Add your GitHub profile — for developers, this is non-negotiable." });

  document.getElementById("suggestions").innerHTML = tips.map(t =>
    `<div class="tip ${t.type}">
       <span class="tip-icon">${t.icon}</span>
       <span>${t.text}</span>
     </div>`
  ).join("");

  // Keywords
  const missingKws = KEYWORDS.filter(k => !lower.includes(k)).slice(0, 12);
  document.getElementById("keywords").innerHTML =
    foundKeywords.slice(0, 10).map(k => `<span class="kw found">${k}</span>`).join("") +
    missingKws.slice(0, 8).map(k => `<span class="kw missing">${k}</span>`).join("");

  // Switch views
  document.getElementById("input-section").style.display = "none";
  document.getElementById("results-section").style.display = "block";

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
//  RESET
// ============================================================
function reset() {
  document.getElementById("resume-input").value = "";
  document.getElementById("input-section").style.display = "block";
  document.getElementById("results-section").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
