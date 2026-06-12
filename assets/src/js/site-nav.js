import { Collapse } from "bootstrap";

/**
 * Mobile open/close + scroll-state toggle (transparent → white after threshold).
 */
export function initSiteNav() {
	const nav = document.querySelector(".site-nav");
	const collapseEl = document.getElementById("mainNavMenu");
	const toggler = document.querySelector(".site-nav__toggler");

	if (!nav || !collapseEl || !toggler) {
		return;
	}

	// ── Mobile open/close ────────────────────────────────────────────────────
	const openLabel =
		toggler.getAttribute("data-label-open") ||
		toggler.getAttribute("aria-label") ||
		"Menü öffnen";
	const closeLabel =
		toggler.getAttribute("data-label-close") || "Menü schließen";

	const setOpen = (isOpen) => {
		nav.classList.toggle("is-open", isOpen);
		toggler.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
		document.documentElement.classList.toggle("site-nav-open", isOpen);
	};

	collapseEl.addEventListener("show.bs.collapse", () => setOpen(true));
	collapseEl.addEventListener("hidden.bs.collapse", () => setOpen(false));

	collapseEl.querySelectorAll(".site-nav__link").forEach((link) => {
		link.addEventListener("click", () => {
			const instance = Collapse.getInstance(collapseEl);
			if (instance && collapseEl.classList.contains("show")) {
				instance.hide();
			}
		});
	});

	// ── Scroll state: transparent at top → white after threshold (desktop) ───
	const desktopMq = window.matchMedia("(min-width: 992px)");

	const scrollThreshold = () => {
		const raw = getComputedStyle(nav)
			.getPropertyValue("--site-nav-scroll-threshold")
			.trim();
		const parsed = parseFloat(raw);
		return Number.isFinite(parsed) ? parsed : 100;
	};

	const updateScrollState = () => {
		if (!desktopMq.matches) {
			nav.classList.remove("is-scrolled");
			return;
		}
		nav.classList.toggle("is-scrolled", window.scrollY > scrollThreshold());
	};

	updateScrollState();
	window.addEventListener("scroll", updateScrollState, { passive: true });
	desktopMq.addEventListener("change", updateScrollState);
}
