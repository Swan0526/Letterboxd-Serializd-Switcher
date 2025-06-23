(function () {
  // On s'assure de ne pas lancer le script dans une iframe
  if (window.self !== window.top) {
    return;
  }

  const isLetterboxd = location.hostname.includes("letterboxd.com");
  const isSerializd = location.hostname.includes("serializd.com");

  if (!isLetterboxd && !isSerializd) {
    return;
  }

  function createSwitchButton() {
    if (document.getElementById("sz-lb-switch-button")) {
      return;
    }

    const parentContainer = isLetterboxd
      ? document.querySelector(".navitems")
      : document.querySelector(".navbar-nav");

    if (!parentContainer) {
      setTimeout(createSwitchButton, 500);
      return;
    }

    // Création du bouton (lien <a>)
    const buttonLink = document.createElement("a");
    buttonLink.id = "sz-lb-switch-button";

    if (isLetterboxd) {
      // --- PARTIE LETTERBOXD (INCHANGÉE) ---
      const container = document.createElement("li");
      buttonLink.href = "https://www.serializd.com/";
      buttonLink.textContent = "TV Shows";
      buttonLink.className = "navlink";

      container.className = "navitem";
      container.appendChild(buttonLink);

      const filmsLink = parentContainer.querySelector('a[href="/films/"]');
      if (filmsLink) {
        const filmsLi = filmsLink.closest("li");
        filmsLi.insertAdjacentElement("afterend", container);
      } else {
        parentContainer.appendChild(container);
      }
    } else if (isSerializd) {
      // --- PARTIE SERIALIZD (CORRIGÉE) ---

      // 1. On crée un <div> conteneur, pas un <li>
      const container = document.createElement("div");
      // On copie les styles du conteneur du bouton "Discover" pour un alignement parfait
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.marginLeft = "10px"; // Espace entre les boutons
      container.style.marginRight = "10px"; // Espace entre les boutons

      buttonLink.href = "https://letterboxd.com/";
      buttonLink.textContent = "Films";
      buttonLink.className =
        "common-button common-button-outline btn btn-primary";

      container.appendChild(buttonLink);

      // 2. On cherche le bouton "Discover"
      const discoverLink = parentContainer.querySelector('a[href="/discover"]');
      if (discoverLink) {
        // 3. On prend son parent <div> comme ancre (et non un <li> qui n'existe pas)
        const discoverContainer = discoverLink.parentElement;
        discoverContainer.insertAdjacentElement("afterend", container);
      } else {
        // Solution de secours si "Discover" n'est pas trouvé
        parentContainer.appendChild(container);
      }
    }
  }

  function observeDOMChanges() {
    const observer = new MutationObserver(() => {
      if (!document.getElementById("sz-lb-switch-button")) {
        createSwitchButton();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSwitchButton);
  } else {
    createSwitchButton();
  }

  observeDOMChanges();
})();