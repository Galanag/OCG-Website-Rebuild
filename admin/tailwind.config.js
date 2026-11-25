/** Tailwind CSS build configuration for the OCG admin application. */
module.exports = {
  content: ['./admin/index.php', './admin/src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        ocg: { forest: '#123b2b', green: '#1d5a3e', red: '#a7252d', gold: '#c7a55a' }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};