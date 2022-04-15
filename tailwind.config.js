module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {},
  variants: {},
  plugins: [
    /* eslint-disable global-require */
    /* eslint-disable import/no-extraneous-dependencies */
    require('@tailwindcss/aspect-ratio'),
    /* eslint-disable global-require */
    /* eslint-disable import/no-extraneous-dependencies */
    require('@tailwindcss/forms'),
    /* eslint-disable global-require */
    /* eslint-disable import/no-extraneous-dependencies */
    require('@tailwindcss/typography'),
  ],
};
