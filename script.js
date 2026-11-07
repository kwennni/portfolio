

document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("theme-btn");

  const setTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add("dark");
      themeBtn.textContent = "Toggle Light Mode";
    } else {
      document.body.classList.remove("dark");
      themeBtn.textContent = "Toggle Dark Mode";
    }
  };

  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme) {
    setTheme(savedTheme === "dark");
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme(true);
  }

  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    themeBtn.textContent = isDark ? "Toggle Light Mode" : "Toggle Dark Mode";
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  });


  const photoInput = document.getElementById("photo-input");
  const avatarImg = document.getElementById("avatar-img");
  const avatarIcon = document.getElementById("avatar-icon");
  const resetAvatarBtn = document.getElementById("reset-avatar-btn");

  const showAvatar = (dataUrl) => {
    if (dataUrl) {
      avatarImg.src = dataUrl;
      avatarImg.hidden = false;
      avatarIcon.hidden = true;
      resetAvatarBtn.style.display = "inline-block";
    } else {
      avatarImg.removeAttribute("src");
      avatarImg.hidden = true;
      avatarIcon.hidden = false;
      resetAvatarBtn.style.display = "none";
    }
  };

  const savedAvatar = localStorage.getItem("portfolio-avatar");
  if (savedAvatar) {
    showAvatar(savedAvatar);
  }

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      showAvatar(dataUrl);
      try {
        localStorage.setItem("portfolio-avatar", dataUrl);
      } catch (err) {
   
      }
    };
    reader.readAsDataURL(file);
  });

  resetAvatarBtn.addEventListener("click", () => {
    photoInput.value = "";
    localStorage.removeItem("portfolio-avatar");
    showAvatar(null);
  });
  const scrollProgress = document.getElementById("scroll-progress");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollProgress && docHeight > 0) {
      const progressPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${progressPercent}%`;
    }
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
    if (backToTopBtn) {
      if (scrollTop > 280) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  const typingText = document.getElementById("typing-text");
  const phrases = [
    "1st Year BSIT Student",
    "UIC IT Student",
    "Aspiring UI/UX Designer"
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const runTypewriter = () => {
    if (!typingText) return;
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      typingText.textContent = currentPhrase.substring(0, charIdx);
      typingSpeed = 50;
    } else {
      charIdx++;
      typingText.textContent = currentPhrase.substring(0, charIdx);
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 350;
    }

    setTimeout(runTypewriter, typingSpeed);
  };
  runTypewriter();
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const emailAddress = document.getElementById("email-address");
  const copyStatus = document.getElementById("copy-status");
  const toast = document.getElementById("toast");
  let statusTimeout = null;
  let toastTimeout = null;

  const showToast = (message) => {
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
      }, 2500);
    }
  };

  const showCopyMessage = (text) => {
    if (copyStatus) {
      copyStatus.textContent = text;
      clearTimeout(statusTimeout);
      statusTimeout = setTimeout(() => {
        copyStatus.textContent = "";
      }, 3000);
    }
    showToast(text);
  };

  if (copyEmailBtn && emailAddress) {
    copyEmailBtn.addEventListener("click", () => {
      const textToCopy = emailAddress.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => showCopyMessage("Email copied to clipboard!"))
          .catch(() => fallbackCopy(textToCopy));
      } else {
        fallbackCopy(textToCopy);
      }
    });
  }

  const fallbackCopy = (text) => {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand("copy");
      showCopyMessage("Email copied to clipboard!");
    } catch (err) {
      showCopyMessage(`Email: ${text}`);
    }
    document.body.removeChild(tempInput);
  };

  const BgSymbols = ["✿", "✦", "✧", "❀", "🌸", "⋆", "✨"];

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.addEventListener("click", (e) => {
      const target = e.target.closest("button, .card, .avatar, a, .skill-pill, .badge, .status-pill");
      if (!target) return;

      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < 6; i++) {
        const kineme = document.createElement("span");
        kineme.classList.add("click-kineme");
        kineme.textContent = BgSymbols[Math.floor(Math.random() * BgSymbols.length)];
        kineme.style.left = `${x}px`;
        kineme.style.top = `${y}px`;

        const angle = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5) * 0.4;
        const distance = 32 + Math.random() * 26;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 18;

        kineme.style.setProperty("--dx", `${dx}px`);
        kineme.style.setProperty("--dy", `${dy}px`);

        document.body.appendChild(kineme);

        setTimeout(() => {
          kineme.remove();
        }, 650);
      }
    });
  }
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
