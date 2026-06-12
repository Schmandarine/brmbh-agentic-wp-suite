import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Collapse } from "bootstrap";
import { initSiteNav } from "./site-nav";
import { initGsapFouc } from "./gsap-fouc";
import { initScrollEntrances } from "./scroll-entrance";

gsap.registerPlugin(ScrollTrigger);

// Scroll-entrance: gsap.set() hides [data-fade-up] first, then .to() on enter.
initScrollEntrances();

// Reveal FOUC-guarded elements once entrance states are set.
initGsapFouc();

// Sticky nav behaviour (scroll state, mobile toggle).
initSiteNav();
