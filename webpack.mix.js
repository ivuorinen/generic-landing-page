const mix = require('laravel-mix');
require('mix-tailwindcss');

mix
    .setResourceRoot('src')
    .setPublicPath('dist')
    .browserSync()
    .disableSuccessNotifications();

mix
    .js('src/app.js', 'dist')
    .sass('src/app.scss', 'dist')
    .tailwind()
    .copy('src/index.html', 'dist');
