# Contribution guide

## 1. Versioning
This package is being versioned analog to the `simple-icons` package.
This ensures that installing a version of this package also uses the icons of the `simple-icons` package with the same
version.

Please keep in mind to update the version of this package using the `npm version` command **after** a new version of
`simple-icons` is being released.


## 2. Building

1. Building the font
	```bash
	npm run build
	```

1. Building the test page
	```bash
	npm run build:testpage
	```
	
**NOTE:** Using `npm version` or `npm publish` will call the `prepublish` hook which will also build the project
automatically.
