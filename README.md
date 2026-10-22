# generic-landing-page

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fivuorinen%2Fgeneric-landing-page.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fivuorinen%2Fgeneric-landing-page?ref=badge_shield)

Static page that shows the hostname it is served from as its heading and title,
decoding internationalized domains (`xn--…`) to Unicode.

`src/index.html` is the whole site: CSS and JavaScript are inline and there is no build step.
Copy it into any web root. Pushes to `main` deploy it to GitHub Pages.

## Development

```sh
npm ci           # install test and lint tooling
npm run lint     # eslint
npm test         # vitest
```

## License

MIT, see [LICENSE](LICENSE).
