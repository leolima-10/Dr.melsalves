// Ponto único de importação do GSAP. Os plugins só são registrados no navegador: este módulo
// também é carregado no build do SSG (Node), onde não existe window.
import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText, DrawSVGPlugin, MotionPathPlugin);
}

// useLayoutEffect no cliente (aplica o estado inicial antes da pintura); useEffect no servidor.
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const DESKTOP_MOTION = '(prefers-reduced-motion: no-preference) and (min-width: 861px)';
export const FINE_POINTER = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)';

export { gsap, ScrollTrigger, Flip, SplitText, DrawSVGPlugin, MotionPathPlugin };
