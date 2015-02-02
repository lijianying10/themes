# Themes for book homepages

This repository contains all the themes for book landing pages on [gitbook.com](https://www.gitbook.com).

If you want to publish your themes to be usable by all gitbook.com users, feel free to do a Pull-Request. Documentation on templating can be found in the [GitBook's documentation](http://help.gitbook.io/book/themes.html).

## How to test and publish a theme?

1. Fork this repository
2. Create a new folder for your theme, example: `mytheme`
3. Add your theme to the `list.json` file
4. Create a file `index.html` and `style.less` in your theme folder
5. Test it:
	1. Run `npm install` to install dependencies
	2. Run `grunt`, it will start a preview server
	3. Open your browser `http://localhost:3000/you/yourbook/mytheme`
5. Create a pull-request from your fork!
