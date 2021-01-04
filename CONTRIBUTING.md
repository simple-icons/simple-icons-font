# Contributing to Simple Icons Font

Simple Icons welcomes contributions and corrections. Before contributing, please make sure you have read the guidelines below. If you decide to contribute anything, please do the following:

1. Fork this repository
1. Create [a new branch][github flow] from the latest `develop`
1. Start hacking on the new branch
1. Commit and push to the new branch
1. Make a pull request

## Local Development

### Building Font Locally

- Make sure you have [NodeJS] installed. At least version 12.0.0 is required.
- Install the dependencies using `$ npm install`.
- Build the font using `$ npm run build`.
- The font files can be found in the `font/` directory.

### Testing Font Locally

- Make sure you have [NodeJS] installed. At least version 12.0.0 is required.
- Install the dependencies using `$ npm install`.
- Build the font and the test page using `$ npm test`.
- Your browser will be opened at `http://localhost:8000/` where all icons should be displayed.

---

# Versioning

This package is being versioned analog to the `simple-icons` package, the details of which can be found in [the contributing guidelines][simple-icons versioning].

Additionally, patches may be used for non-breaking improvements to the font and major releases may be used to introduce breakings changes beyond removed icons.

[github flow]: https://guides.github.com/introduction/flow/
[nodejs]: https://nodejs.org/en/download/
[simple-icons versioning]: https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md#versioning
