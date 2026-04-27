(() => {
    const STORAGE_THEME = "cps-theme";
    const STORAGE_HISTORY = "cps-history";
    const MAX_HISTORY = 14;

    const state = {
        hex: "#4F46E5",
        rgb: "rgb(79, 70, 229)",
        hsl: "hsl(243, 76%, 59%)",
        history: [],
    };

    function initTheme() {
        const toggle = document.querySelector("#theme-toggle");
        const saved = localStorage.getItem(STORAGE_THEME);
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = saved || (systemDark ? "dark" : "light");

        document.body.dataset.theme = theme;

        if (toggle) {
            toggle.textContent = theme === "dark" ? "◐" : "☼";
            toggle.addEventListener("click", () => {
                const current = document.body.dataset.theme === "dark" ? "light" : "dark";
                document.body.dataset.theme = current;
                toggle.textContent = current === "dark" ? "◐" : "☼";
                localStorage.setItem(STORAGE_THEME, current);
            });
        }
    }

    function initLanguageSwitch() {
        const select = document.querySelector("#lang-switch");
        if (!select) return;
        select.addEventListener("change", (event) => {
            const target = event.target;
            if (target instanceof HTMLSelectElement) {
                window.location.href = target.value;
            }
        });
    }

    function hexToRgb(hex) {
        const clean = hex.replace("#", "");
        const full = clean.length === 3
            ? clean.split("").map((c) => c + c).join("")
            : clean;

        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);

        return { r, g, b, text: `rgb(${r}, ${g}, ${b})` };
    }

    function rgbToHex(r, g, b) {
        return `#${[r, g, b]
            .map((n) => n.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase()}`;
    }

    function rgbToHsl(r, g, b) {
        const rr = r / 255;
        const gg = g / 255;
        const bb = b / 255;

        const max = Math.max(rr, gg, bb);
        const min = Math.min(rr, gg, bb);
        const delta = max - min;

        let h = 0;
        const l = (max + min) / 2;
        const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        if (delta !== 0) {
            if (max === rr) h = 60 * (((gg - bb) / delta) % 6);
            if (max === gg) h = 60 * ((bb - rr) / delta + 2);
            if (max === bb) h = 60 * ((rr - gg) / delta + 4);
        }

        const hh = Math.round(h < 0 ? h + 360 : h);
        const ss = Math.round(s * 100);
        const ll = Math.round(l * 100);

        return { h: hh, s: ss, l: ll, text: `hsl(${hh}, ${ss}%, ${ll}%)` };
    }

    function hslToRgb(h, s, l) {
        const ss = s / 100;
        const ll = l / 100;
        const c = (1 - Math.abs(2 * ll - 1)) * ss;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = ll - c / 2;
        let rr = 0;
        let gg = 0;
        let bb = 0;

        if (h >= 0 && h < 60) {
            rr = c;
            gg = x;
        } else if (h < 120) {
            rr = x;
            gg = c;
        } else if (h < 180) {
            gg = c;
            bb = x;
        } else if (h < 240) {
            gg = x;
            bb = c;
        } else if (h < 300) {
            rr = x;
            bb = c;
        } else {
            rr = c;
            bb = x;
        }

        const r = Math.round((rr + m) * 255);
        const g = Math.round((gg + m) * 255);
        const b = Math.round((bb + m) * 255);
        return { r, g, b };
    }

    function shiftLuminance(hex, amount) {
        const { r, g, b } = hexToRgb(hex);
        const hsl = rgbToHsl(r, g, b);
        const lightness = Math.max(0, Math.min(100, hsl.l + amount));
        const rgb = hslToRgb(hsl.h, hsl.s, lightness);
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    function contrastColor(hex) {
        const { r, g, b } = hexToRgb(hex);
        const y = (r * 299 + g * 587 + b * 114) / 1000;
        return y > 160 ? "#0F1113" : "#FFFFFF";
    }

    function buildHarmony(hex, type) {
        const { r, g, b } = hexToRgb(hex);
        const { h, s, l } = rgbToHsl(r, g, b);

        function byHue(delta) {
            const rgb = hslToRgb((h + delta + 360) % 360, s, l);
            return rgbToHex(rgb.r, rgb.g, rgb.b);
        }

        switch (type) {
            case "complementary":
                return [hex, byHue(180)];
            case "analogous":
                return [byHue(-30), hex, byHue(30)];
            case "triad":
                return [hex, byHue(120), byHue(240)];
            case "tetradic":
                return [hex, byHue(90), byHue(180), byHue(270)];
            case "monochromatic":
                return [shiftLuminance(hex, -25), shiftLuminance(hex, -10), hex, shiftLuminance(hex, 15), shiftLuminance(hex, 30)];
            default:
                return [hex];
        }
    }

    function renderPalette(targetId, colors) {
        const root = document.querySelector(`#${targetId}`);
        if (!root) return;

        root.innerHTML = "";

        colors.forEach((hex) => {
            const item = document.createElement("button");
            item.className = "palette-item";
            item.style.background = hex;
            item.style.color = contrastColor(hex);
            item.type = "button";
            item.textContent = hex;
            item.addEventListener("click", () => {
                copyText(hex);
                trackEvent("copy_palette_color", { color: hex });
            });
            root.appendChild(item);
        });
    }

    function addToHistory(hex) {
        state.history = state.history.filter((item) => item !== hex);
        state.history.unshift(hex);
        state.history = state.history.slice(0, MAX_HISTORY);
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify(state.history));
        renderHistory();
    }

    function renderHistory() {
        const root = document.querySelector("#history");
        if (!root) return;
        root.innerHTML = "";

        state.history.forEach((hex) => {
            const button = document.createElement("button");
            button.className = "swatch";
            button.style.background = hex;
            button.type = "button";
            button.title = hex;
            button.addEventListener("click", () => updateColor(hex));
            root.appendChild(button);
        });
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (_) {
            const area = document.createElement("textarea");
            area.value = text;
            document.body.appendChild(area);
            area.select();
            document.execCommand("copy");
            document.body.removeChild(area);
        }
    }

    function updateColor(hex) {
        const { r, g, b, text: rgb } = hexToRgb(hex);
        const { text: hsl } = rgbToHsl(r, g, b);

        state.hex = hex;
        state.rgb = rgb;
        state.hsl = hsl;

        const chip = document.querySelector("#color-chip");
        const hexValue = document.querySelector("#hex-value");
        const rgbValue = document.querySelector("#rgb-value");
        const hslValue = document.querySelector("#hsl-value");

        if (chip) chip.style.background = hex;
        if (hexValue) hexValue.textContent = hex;
        if (rgbValue) rgbValue.textContent = rgb;
        if (hslValue) hslValue.textContent = hsl;

        const harmonyType = (document.querySelector("#harmony-select")?.value) || "complementary";
        renderPalette("harmony-palette", buildHarmony(hex, harmonyType));

        const light = [10, 20, 30, 40, 50].map((step) => shiftLuminance(hex, step));
        const dark = [10, 20, 30, 40, 50].map((step) => shiftLuminance(hex, -step));
        renderPalette("light-scale", light);
        renderPalette("dark-scale", dark);

        addToHistory(hex);
    }

    function exportAsJson() {
        const payload = {
            selected: {
                hex: state.hex,
                rgb: state.rgb,
                hsl: state.hsl,
            },
            harmony: buildHarmony(state.hex, (document.querySelector("#harmony-select")?.value) || "complementary"),
            lightScale: [10, 20, 30, 40, 50].map((step) => shiftLuminance(state.hex, step)),
            darkScale: [10, 20, 30, 40, 50].map((step) => shiftLuminance(state.hex, -step)),
            history: state.history,
            generatedAt: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        downloadFile(url, "palette.json");
        URL.revokeObjectURL(url);
        trackEvent("export_palette_json", { color: state.hex });
    }

    function exportAsPng() {
        const colors = buildHarmony(state.hex, (document.querySelector("#harmony-select")?.value) || "complementary");
        const width = 720;
        const height = 240;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, width, height);

        const block = width / colors.length;
        colors.forEach((hex, i) => {
            ctx.fillStyle = hex;
            ctx.fillRect(i * block, 0, block, 160);
            ctx.fillStyle = "#ffffff";
            ctx.font = "700 20px Space Grotesk";
            ctx.fillText(hex, i * block + 20, 205);
        });

        const url = canvas.toDataURL("image/png");
        downloadFile(url, "palette.png");
        trackEvent("export_palette_png", { color: state.hex });
    }

    function downloadFile(url, name) {
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
    }

    function trackEvent(name, params = {}) {
        if (typeof window.gtag === "function") {
            window.gtag("event", name, params);
        }
    }

    function initCopyButtons() {
        document.querySelectorAll("[data-copy]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const key = btn.getAttribute("data-copy");
                const value = key === "hex" ? state.hex : key === "rgb" ? state.rgb : state.hsl;
                await copyText(value);
                trackEvent("copy_color_code", { format: key, color: state.hex });
            });
        });
    }

    function initDropzone() {
        const dropzone = document.querySelector("#dropzone");
        const fileInput = document.querySelector("#file-input");
        const canvas = document.querySelector("#image-canvas");
        const loading = document.querySelector("#loading-state");

        if (!(dropzone instanceof HTMLElement) || !(fileInput instanceof HTMLInputElement) || !(canvas instanceof HTMLCanvasElement)) {
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const processFile = (file) => {
            if (!file || !file.type.startsWith("image/")) return;

            if (loading instanceof HTMLElement) loading.hidden = false;

            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                if (loading instanceof HTMLElement) loading.hidden = true;
            };

            const reader = new FileReader();
            reader.onload = () => {
                img.src = typeof reader.result === "string" ? reader.result : "";
            };
            reader.readAsDataURL(file);

            trackEvent("upload_image", { type: file.type });
        };

        dropzone.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", () => processFile(fileInput.files?.[0]));

        ["dragenter", "dragover"].forEach((evt) => {
            dropzone.addEventListener(evt, (event) => {
                event.preventDefault();
                dropzone.classList.add("is-dragover");
            });
        });

        ["dragleave", "drop"].forEach((evt) => {
            dropzone.addEventListener(evt, (event) => {
                event.preventDefault();
                dropzone.classList.remove("is-dragover");
            });
        });

        dropzone.addEventListener("drop", (event) => {
            const dt = event.dataTransfer;
            processFile(dt?.files?.[0]);
        });

        canvas.addEventListener("click", (event) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = Math.floor((event.clientX - rect.left) * scaleX);
            const y = Math.floor((event.clientY - rect.top) * scaleY);
            const data = ctx.getImageData(x, y, 1, 1).data;
            const hex = rgbToHex(data[0], data[1], data[2]);
            updateColor(hex);
            trackEvent("pick_color", { color: hex });
        });
    }

    function initActions() {
        document.querySelector("#harmony-select")?.addEventListener("change", () => {
            updateColor(state.hex);
            trackEvent("change_harmony", { type: document.querySelector("#harmony-select")?.value || "complementary" });
        });

        document.querySelector("#export-json")?.addEventListener("click", exportAsJson);
        document.querySelector("#export-png")?.addEventListener("click", exportAsPng);
    }

    function initAdSense() {
        const hasAds = document.querySelector(".adsbygoogle");
        if (hasAds && window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (_) {
            }
        }
    }

    function initMobileMenu() {
        const menuToggle = document.querySelector("#menu-toggle");
        const mobileMenu = document.querySelector("#mobile-menu");
        const menuOverlay = document.querySelector("#menu-overlay");
        const navLinks = document.querySelectorAll(".mobile-nav-link");

        if (!menuToggle || !mobileMenu || !menuOverlay) return;

        function closeMenu() {
            menuToggle.classList.remove("is-active");
            mobileMenu.classList.remove("is-active");
            menuOverlay.classList.remove("is-active");
            menuToggle.setAttribute("aria-expanded", "false");
        }

        function toggleMenu() {
            const isActive = menuToggle.classList.toggle("is-active");
            mobileMenu.classList.toggle("is-active");
            menuOverlay.classList.toggle("is-active");
            menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
        }

        menuToggle.addEventListener("click", toggleMenu);
        menuOverlay.addEventListener("click", closeMenu);

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuToggle.classList.contains("is-active")) {
                closeMenu();
            }
        });
    }

    function bootstrap() {
        initTheme();
        initLanguageSwitch();
        initMobileMenu();
        initCopyButtons();
        initDropzone();
        initActions();

        try {
            const persisted = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]");
            state.history = Array.isArray(persisted) ? persisted : [];
        } catch (_) {
            state.history = [];
        }

        renderHistory();
        updateColor(state.hex);
        initAdSense();
    }

    document.addEventListener("DOMContentLoaded", bootstrap);
})();
