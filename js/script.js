document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio UI loaded");

  /* Smooth scrolling */
  const scrollLinks = document.querySelectorAll(".scroll-to");
  const scrollToTarget = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    const offset = 72; // adjust for sticky header
    const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  scrollLinks.forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const targetId = href.substring(1);
      scrollToTarget(targetId);
    });
  });

  /* Intersection-based fade-in */
  const fadeInEls = document.querySelectorAll(".fade-in, section.section");
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  fadeInEls.forEach((el) => fadeObserver.observe(el));

  /* Nav active state on scroll */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const linkId = href.startsWith("#") ? href.substring(1) : null;
            link.classList.toggle("active", linkId === id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));

  /* Nav toggle (mobile) */
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-links");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("open");
      });
    });
  }

  /* Project filtering */
  const filterButtons = document.querySelectorAll(".project-filters .chip");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").split(",").map((t) => t.trim());
        if (filter === "all" || tags.includes(filter)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* Skill hover interaction */
  const skillChips = document.querySelectorAll(".skill-chip");
  const skillHoverCard = document.getElementById("skill-hover-card");

  const skillHints = {
    Python: "Python powers my Chevron AI agents, VBTrain, Slack Snipe Bot, and data engineering pipelines.",
    "C++": "C/C++ underpins systems coursework including operating systems and computer system organization.",
    Java: "Java appears in systems and backend-focused coursework in my CS degree.",
    R: "R supports statistical analysis and data exploration in my academic projects.",
    JavaScript: "JavaScript powers GS Watch modules at Chevron, Pricedle, and this portfolio.",
    SQL: "SQL supports data models and backends across Chevron internships and PostgreSQL-backed VBTrain.",
    Azure: "Azure hosts VBTrain on Container Apps and underpins OpenAI and data work across Chevron internships.",
    AWS: "AWS hosts Slack Snipe Bot and appears alongside GCP and Azure in my cloud toolkit.",
    Databricks: "Databricks and Unity Catalog powered chemical data models and Synapse-to-Databricks migration at Chevron.",
    Docker: "Docker supports containerized deployments like VBTrain on Azure Container Apps.",
    PostgreSQL: "PostgreSQL stores player stats and app data for production VBTrain.",
    Git: "Git is how I collaborate on Chevron work, open-source projects, and this portfolio.",
    "OpenAI API": "OpenAI API drives agentic migration, security QC agents, chemical exception handling, and VBTrain feedback.",
    "Machine Learning": "Machine learning is central to my Chevron AI agent work and VBTrain sports analytics.",
    "Computer Vision": "Computer vision drives my AV perception pipeline (OpenCV, YOLOv8) and VBTrain film analysis.",
    "Data Engineering": "Data engineering spans Unity Catalog modeling, fuzzy-matching pipelines, and enterprise migrations at Chevron.",
    OpenCV: "OpenCV powers lane detection and collision avoidance, plus VBTrain technique evaluation from match footage.",
    HTML: "HTML, CSS, and JavaScript form the foundation of this portfolio and projects like Pricedle.",
    CSS: "CSS brings the interactive, responsive UI to life across my web projects.",
    Leadership: "I'm President and Captain of Cornell Men's Volleyball Club and collaborate across Chevron AI teams.",
    Cybersecurity: "Cybersecurity connects to Chevron Global Security AI — GS Watch and multi-agent QC frameworks.",
  };

  const defaultSkillTitle = "Hover a skill to see where I’ve used it.";

  skillChips.forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      const skill = chip.getAttribute("data-skill");
      skillChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      if (!skillHoverCard) return;
      const titleEl = skillHoverCard.querySelector(".skill-hover-title");
      const bodyEl = skillHoverCard.querySelector(".skill-hover-body");
      if (titleEl && bodyEl) {
        titleEl.textContent = skill;
        bodyEl.textContent = skillHints[skill] || defaultSkillTitle;
      }
    });

    chip.addEventListener("mouseleave", () => {
      chip.classList.remove("active");
      if (!skillHoverCard) return;
      const titleEl = skillHoverCard.querySelector(".skill-hover-title");
      const bodyEl = skillHoverCard.querySelector(".skill-hover-body");
      if (titleEl && bodyEl) {
        titleEl.textContent = defaultSkillTitle;
        bodyEl.innerHTML =
          'For example, <strong>Computer Vision</strong> powers my AV collision avoidance system and VBTrain sports analytics platform.';
      }
    });
  });

  /* Theme toggle */
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const applyTheme = (theme) => {
    if (theme === "light") {
      root.dataset.theme = "light";
    } else {
      root.dataset.theme = "dark";
    }
  };

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.dataset.theme === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      window.localStorage.setItem("theme", next);
      // swap icon style
      themeToggle.innerHTML = "";
      const span = document.createElement("span");
      span.className = next === "light" ? "icon-moon" : "icon-sun";
      themeToggle.appendChild(span);
    });
    // initialize icon
    const span = document.createElement("span");
    const initialTheme = storedTheme || "dark";
    span.className = initialTheme === "light" ? "icon-moon" : "icon-sun";
    themeToggle.innerHTML = "";
    themeToggle.appendChild(span);
  }

  /* Scroll-to-top visibility */
  const toTop = document.getElementById("to-top");
  if (toTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 280) {
        toTop.classList.add("visible");
      } else {
        toTop.classList.remove("visible");
      }
    });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
