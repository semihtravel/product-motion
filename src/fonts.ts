import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadPlayfairDisplay } from '@remotion/google-fonts/PlayfairDisplay';

const inter = loadInter();
const playfair = loadPlayfairDisplay();

export const FONT_INTER = inter.fontFamily;
export const FONT_PLAYFAIR = playfair.fontFamily;

export const FONT_FAMILY_BODY = `${inter.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
export const FONT_FAMILY_HEADLINE = `${playfair.fontFamily}, Georgia, "Times New Roman", serif`;
