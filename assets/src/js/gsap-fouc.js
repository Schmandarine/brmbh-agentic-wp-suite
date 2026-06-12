/**
 * Unlocks head FOUC CSS (html.gsap-init).
 * Run after initHeroAnimation() so hero copy gets gsap.set() before visibility is restored.
 */
export function initGsapFouc() {
	document.documentElement.classList.add('gsap-init');
}
