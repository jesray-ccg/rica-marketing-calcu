/**
 * @fileoverview PostCSS configuration for CSS processing
 */

export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'cssnano': {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    },
  },
}
