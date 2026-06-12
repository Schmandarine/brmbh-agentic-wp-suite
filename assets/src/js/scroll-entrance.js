import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll entrances — hide targets on load, reveal on enter (no visible→hide flash).
 *
 * from()/fromTo() + immediateRender:false applies the "from" state when the
 * trigger fires, so users see: visible → hidden → animate in. Fix: gsap.set()
 * once up front, then .to() with ScrollTrigger (or immediate .to if in view).
 */
export function initScrollEntrances() {
	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
		document.documentElement.classList.add( 'gsap-ready' );
		return;
	}

	const fadeUps = gsap.utils.toArray( '[data-fade-up]' );
	const staggerItems = gsap.utils.toArray( '[data-stagger-item]' );
	const allTargets = [ ...fadeUps, ...staggerItems ];

	if ( allTargets.length ) {
		gsap.set( allTargets, { autoAlpha: 0, y: 40 } );
	}

	const reveal = ( targets, vars = {} ) => {
		gsap.to( targets, {
			autoAlpha: 1,
			y: 0,
			duration: 0.6,
			ease: 'power2.out',
			...vars,
		} );
	};

	fadeUps.forEach( ( el ) => {
		if ( ScrollTrigger.isInViewport( el, 0.15 ) ) {
			reveal( el, { delay: 0.05 } );
			return;
		}
		reveal( el, {
			scrollTrigger: {
				trigger: el,
				start: 'top 85%',
				once: true,
			},
		} );
	} );

	gsap.utils.toArray( '[data-stagger-group]' ).forEach( ( container ) => {
		const items = gsap.utils.toArray( '[data-stagger-item]', container );
		if ( ! items.length ) {
			return;
		}

		const play = () =>
			reveal( items, {
				stagger: 0.1,
			} );

		if ( ScrollTrigger.isInViewport( container, 0.15 ) ) {
			play();
			return;
		}

		ScrollTrigger.create( {
			trigger: container,
			start: 'top 85%',
			once: true,
			onEnter: play,
		} );
	} );

	document.documentElement.classList.add( 'gsap-ready' );
}
