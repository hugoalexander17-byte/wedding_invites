// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// CERRAR MENU AL DAR CLICK EN UN LINK
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (mainNav) {
      mainNav.classList.remove("open");
    }
  });
});

// INVITADOS POR FAMILIA
const guestData = {
  // Agrega mas familias aqui
  dominguez: {
    familia: "Familia Dom\u00ednguez",
    cupos: 3,
    personas: [
      "Hugo Rodolfo Dom\u00ednguez Ahrenz",
      "Ana Lidia Castellanos de Dom\u00ednguez",
      "Ana Lidia Dom\u00ednguez Castellanos"
    ]
  },
  "sapon-dominguez": {
    familia: "Familia Sap\u00f3n Dom\u00ednguez",
    cupos: 2,
    personas: [
      "Francisco Sap\u00f3n Portela",
      "Joseline Dom\u00ednguez de Sap\u00f3n"
    ]
  }
};

const showElement = element => {
  if (!element) return;
  element.hidden = false;
  element.classList.remove("is-hidden");
};

const hideElement = element => {
  if (!element) return;
  element.hidden = true;
  element.classList.add("is-hidden");
};

const buildGuestLink = id => {
  const origin = window.location.origin;
  const basePath = window.location.pathname.replace(/admin\.html$/i, "index.html");
  return `${origin}${basePath}?id=${encodeURIComponent(id)}`;
};

const copyLink = url => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(url);
  }

  const temp = document.createElement("textarea");
  temp.value = url;
  temp.setAttribute("readonly", "");
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  return Promise.resolve();
};

const renderGuestPage = () => {
  const guestSection = document.getElementById("guestAccessSection");
  if (!guestSection) return;

  const guestInfo = document.getElementById("guestInfo");
  const guestFamilyName = document.getElementById("guestFamilyName");
  const guestCupos = document.getElementById("guestCupos");
  const guestList = document.getElementById("guestList");
  const guestError = document.getElementById("guestError");
  const guestEmpty = document.getElementById("guestEmpty");

  const params = new URLSearchParams(window.location.search);
  const guestId = params.get("id");

  if (!guestId) {
    hideElement(guestInfo);
    hideElement(guestError);
    showElement(guestEmpty);
    return;
  }

  const guest = guestData[guestId];
  if (!guest) {
    hideElement(guestInfo);
    hideElement(guestEmpty);
    showElement(guestError);
    return;
  }

  hideElement(guestError);
  hideElement(guestEmpty);
  showElement(guestInfo);

  if (guestFamilyName) guestFamilyName.textContent = guest.familia;
  if (guestCupos) guestCupos.textContent = `Invitaciones asignadas: ${guest.cupos}`;
  if (guestList) {
    guestList.innerHTML = "";
    guest.personas.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      guestList.appendChild(li);
    });
  }
};

const renderAdminPanel = () => {
  const adminCards = document.getElementById("adminCards");
  if (!adminCards) return;

  adminCards.innerHTML = "";

  Object.entries(guestData).forEach(([id, data]) => {
    const link = buildGuestLink(id);
    const card = document.createElement("article");
    card.className = "admin-card glass-card";
    card.innerHTML = `
      <div class="admin-card-top">
        <div>
          <p class="admin-label">ID</p>
          <p class="admin-value">${id}</p>
        </div>
        <div>
          <p class="admin-label">Cupos</p>
          <p class="admin-value">${data.cupos}</p>
        </div>
      </div>
      <h3 class="admin-family">${data.familia}</h3>
      <p class="admin-link-label">Link generado</p>
      <div class="admin-link-row">
        <input class="admin-link" type="text" value="${link}" readonly />
        <button class="btn btn-primary btn-sm admin-copy" type="button" data-link="${link}">Copiar link</button>
      </div>
      <div class="admin-actions">
        <a class="btn btn-secondary btn-sm" href="${link}" target="_blank" rel="noreferrer">Abrir link</a>
        <span class="copy-feedback" aria-live="polite"></span>
      </div>
      <ul class="admin-list"></ul>
    `;

    const list = card.querySelector(".admin-list");
    data.personas.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });

    adminCards.appendChild(card);
  });
};

const renderAdminPage = () => {
  renderAdminPanel();

  const adminCards = document.getElementById("adminCards");
  const adminToggle = document.getElementById("adminToggle");
  const adminPanelBody = document.getElementById("adminPanelBody");

  if (adminCards) {
    adminCards.addEventListener("click", event => {
      const button = event.target.closest(".admin-copy");
      if (!button) return;
      const link = button.dataset.link;
      const feedback = button.closest(".admin-card").querySelector(".copy-feedback");

      copyLink(link)
        .then(() => {
          if (!feedback) return;
          feedback.textContent = "Copiado";
          setTimeout(() => {
            feedback.textContent = "";
          }, 1600);
        })
        .catch(() => {});
    });
  }

  if (adminToggle && adminPanelBody) {
    adminToggle.addEventListener("click", () => {
      const isHidden = adminPanelBody.classList.toggle("is-hidden");
      adminToggle.textContent = isHidden ? "Mostrar panel" : "Ocultar panel";
    });
  }
};

const isAdminPage = /admin\.html$/i.test(window.location.pathname);
if (isAdminPage) {
  renderAdminPage();
} else {
  renderGuestPage();
}

// CUENTA REGRESIVA
const weddingDate = new Date("2026-04-19T16:00:00").getTime();
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const difference = weddingDate - now;

  if (difference <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
if (daysEl) {
  setInterval(updateCountdown, 1000);
}

// PARALLAX
const parallaxSections = document.querySelectorAll(".parallax-section");

function updateParallax() {
  const scrollY = window.scrollY;

  parallaxSections.forEach(section => {
    const target = section.querySelector(".parallax-bg, .parallax-media");
    if (!target) return;
    const speed = parseFloat(section.dataset.speed) || 0.2;
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const offset = (scrollY - sectionTop) * speed;

    target.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
  });
}

window.addEventListener("scroll", updateParallax);
window.addEventListener("load", updateParallax);

// SUBIR IMÁGENES A SLOTS
const imageUploads = document.querySelectorAll(".img-upload");

imageUploads.forEach(input => {
  input.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    const targetId = input.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      target.style.backgroundImage = `url('${e.target.result}')`;
      target.classList.add("has-image");
      target.innerHTML = "";
    };
    reader.readAsDataURL(file);
  });
});

// CAMBIAR FONDOS DE SECCIONES
const bgUploads = document.querySelectorAll(".bg-upload");

bgUploads.forEach(input => {
  input.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    const targetSectionId = input.dataset.target;
    const section = document.getElementById(targetSectionId);
    if (!section) return;

    const bgLayer = section.querySelector(".parallax-bg");
    if (!bgLayer) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      bgLayer.style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
  });
});

// AUDIO DE FONDO
const bgAudio = document.getElementById("bgAudio");

if (bgAudio) {
  const tryPlay = () => {
    bgAudio.play().catch(() => {});
  };

  window.addEventListener("load", tryPlay);

  const resumeOnGesture = () => {
    tryPlay();
    document.removeEventListener("click", resumeOnGesture);
    document.removeEventListener("touchstart", resumeOnGesture);
  };

  document.addEventListener("click", resumeOnGesture);
  document.addEventListener("touchstart", resumeOnGesture);
}

// RSVP POR WHATSAPP
const rsvpSubmit = document.getElementById("rsvpSubmit");
const rsvpFamily = document.getElementById("rsvpFamily");
const rsvpCupos = document.getElementById("rsvpCupos");
const rsvpGuestList = document.getElementById("rsvpGuestList");
const rsvpError = document.getElementById("rsvpError");
const rsvpUnavailable = document.getElementById("rsvpUnavailable");
const rsvpInfo = document.getElementById("rsvpInfo");
const rsvpSelectAll = document.getElementById("rsvpSelectAll");
const rsvpOptions = document.getElementById("rsvpOptions");

const getGuestIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const setGuestListEnabled = enabled => {
  if (!rsvpGuestList) return;
  rsvpGuestList.classList.toggle("is-disabled", !enabled);
  rsvpGuestList.querySelectorAll("input[type=\"checkbox\"]").forEach(input => {
    input.disabled = !enabled;
  });
  if (rsvpSelectAll) {
    rsvpSelectAll.disabled = !enabled;
  }
};

const updateSelectAllLabel = () => {
  if (!rsvpGuestList || !rsvpSelectAll) return;
  const checks = Array.from(rsvpGuestList.querySelectorAll("input[type=\"checkbox\"]"));
  const allChecked = checks.length > 0 && checks.every(input => input.checked);
  rsvpSelectAll.textContent = allChecked ? "Desmarcar todos" : "Seleccionar todos";
};

if (rsvpSubmit) {
  const guestId = getGuestIdFromUrl();
  const guest = guestId ? guestData[guestId] : null;

  if (!guest) {
    if (rsvpInfo) hideElement(rsvpInfo);
    if (rsvpUnavailable) showElement(rsvpUnavailable);
    if (rsvpOptions) rsvpOptions.classList.add("is-disabled");
    setGuestListEnabled(false);
    rsvpSubmit.disabled = true;
  } else {
    if (rsvpUnavailable) hideElement(rsvpUnavailable);
    if (rsvpInfo) showElement(rsvpInfo);
    if (rsvpFamily) rsvpFamily.textContent = guest.familia;
    if (rsvpCupos) rsvpCupos.textContent = `${guest.cupos} lugares asignados`;
    if (rsvpGuestList) {
      rsvpGuestList.innerHTML = "";
      guest.personas.forEach((name, index) => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        label.className = "rsvp-guest-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "rsvp-choice";
        checkbox.id = `rsvpGuest_${index}`;
        checkbox.value = name;
        const span = document.createElement("span");
        span.textContent = name;
        label.appendChild(checkbox);
        label.appendChild(span);
        li.appendChild(label);
        rsvpGuestList.appendChild(li);
      });
      updateSelectAllLabel();
      setGuestListEnabled(true);
    }
  }

  if (rsvpSelectAll && rsvpGuestList) {
    rsvpSelectAll.addEventListener("click", () => {
      const checks = Array.from(rsvpGuestList.querySelectorAll("input[type=\"checkbox\"]"));
      const allChecked = checks.length > 0 && checks.every(input => input.checked);
      checks.forEach(input => {
        input.checked = !allChecked;
      });
      updateSelectAllLabel();
      setGuestListEnabled(true);
    });
  }

  if (rsvpOptions) {
    rsvpOptions.addEventListener("change", event => {
      const selected = event.target && event.target.name === "rsvpResponse" ? event.target.value : null;
      if (!selected) return;
      if (selected === "yes") {
        setGuestListEnabled(true);
      } else {
        setGuestListEnabled(false);
        if (rsvpGuestList) {
          rsvpGuestList.querySelectorAll("input[type=\"checkbox\"]").forEach(input => {
            input.checked = false;
          });
        }
      }
      updateSelectAllLabel();
      setGuestListEnabled(true);
    });
  }

  if (rsvpGuestList) {
    rsvpGuestList.addEventListener("change", updateSelectAllLabel);
  }

  rsvpSubmit.addEventListener("click", () => {
    if (!guest) return;
    if (rsvpError) hideElement(rsvpError);

    const selected = document.querySelector("input[name=\"rsvpResponse\"]:checked");
    if (!selected) {
      if (rsvpError) {
        rsvpError.textContent = "Por favor selecciona si asistir\u00e1s o no antes de confirmar.";
        showElement(rsvpError);
      }
      return;
    }

    const response = selected.value === "yes" ? "S\u00ed asistiremos" : "No podremos asistir";

    if (selected.value === "yes") {
      const checked = Array.from(rsvpGuestList.querySelectorAll("input[type=\"checkbox\"]:checked"))
        .map(input => input.value);

      if (checked.length === 0) {
        if (rsvpError) {
          rsvpError.textContent = "Por favor selecciona al menos un invitado que asistir\u00e1.";
          showElement(rsvpError);
        }
        return;
      }

      const message = [
        "Confirmaci\u00f3n de asistencia",
        "",
        `Familia: ${guest.familia}`,
        `Invitaci\u00f3n: ${guestId}`,
        "",
        `Lugares asignados: ${guest.cupos}`,
        "",
        "De los cuales asistir\u00e1n:",
        ...checked.map(name => `* ${name}`),
        "",
        `Respuesta: ${response}`
      ].join("\n");

      const phoneNumber = "50256246970";
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, "_blank");
      return;
    }

    const message = [
      "Confirmaci\u00f3n de asistencia",
      "",
      `Familia: ${guest.familia}`,
      `Invitaci\u00f3n: ${guestId}`,
      "",
      `Lugares asignados: ${guest.cupos}`,
      "",
      `Respuesta: ${response}`
    ].join("\n");

    const phoneNumber = "50256246970";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  });
}
// BOTON VOLVER ARRIBA
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}





















