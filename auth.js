(() => {
  const STORAGE_KEY = "mbh_gate_ok";
  const PASS_HASH =
    "f1cbba16a3146dfb7fbc89452f7a0783d55527956fd29fafeb01d9da2faf60fd";

  const unlocked =
    sessionStorage.getItem(STORAGE_KEY) === "1" ||
    localStorage.getItem(STORAGE_KEY) === "1";

  if (unlocked) {
    document.documentElement.classList.add("is-unlocked");
    return;
  }

  document.documentElement.classList.add("is-locked");

  async function sha256Hex(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function mountGate() {
    const gate = document.createElement("div");
    gate.id = "site-gate";
    gate.innerHTML = `
      <div class="site-gate__panel">
        <p class="site-gate__brand">MBH</p>
        <h1 class="site-gate__title">Belépés</h1>
        <p class="site-gate__lede">Add meg a jelszót a tartalom megtekintéséhez.</p>
        <form class="site-gate__form" autocomplete="off">
          <label class="site-gate__label" for="site-gate-pass">Jelszó</label>
          <input id="site-gate-pass" class="site-gate__input" type="password" name="password" required autofocus />
          <p class="site-gate__error" hidden>Hibás jelszó.</p>
          <button class="site-gate__btn" type="submit">Belépés</button>
        </form>
      </div>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("form");
    const input = gate.querySelector("#site-gate-pass");
    const error = gate.querySelector(".site-gate__error");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.hidden = true;
      const hash = await sha256Hex(input.value.trim());
      if (hash !== PASS_HASH) {
        error.hidden = false;
        input.select();
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, "1");
      localStorage.setItem(STORAGE_KEY, "1");
      document.documentElement.classList.remove("is-locked");
      document.documentElement.classList.add("is-unlocked");
      gate.remove();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGate);
  } else {
    mountGate();
  }
})();
