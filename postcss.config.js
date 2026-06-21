// Tailwind v4 uses @tailwindcss/postcss package, not 'tailwindcss' directly
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};
