# tablab-i18n <!-- omit in toc -->

[![npm](https://img.shields.io/npm/l/tablab-i18n)](LICENSE)
[![npm](https://img.shields.io/npm/v/tablab-i18n)](https://www.npmjs.com/package/tablab-i18n)
[![npm](https://img.shields.io/npm/dt/tablab-i18n)](https://www.npmjs.com/package/tablab-i18n)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Coverage Status](https://coveralls.io/repos/github/raphael-jorge/tablab-i18n/badge.svg?branch=main)](https://coveralls.io/github/raphael-jorge/tablab-i18n?branch=main)
[![CI](https://github.com/raphael-jorge/tablab-i18n/actions/workflows/ci.yml/badge.svg)](https://github.com/raphael-jorge/tablab-i18n/actions/workflows/ci.yml)

Internationalized messages for [tablab](https://github.com/raphael-jorge/tablab)'s failed write results.

## Table of Content <!-- omit in toc -->

- [Supported locales](#supported-locales)
- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Supported locales

| Locale |  Language  | Localization Function |
| :----: | :--------: | :-------------------: |
| en-US  |  English   |    `localizeEnUs`     |
| pt-BR  | Portuguese |    `localizePtBr`     |

## Install

With [node](https://nodejs.org/en/) installed, run

```shell
npm install tablab-i18n
```

## Usage

The lib exposes the `localize` object and all the localization functions individually.

A localization function is responsible for localizing a collection of write results. It must be called with an array of write result objects. For each object, if it is a failed write result with a failure reason identifier defined by the lib [tablab](https://github.com/raphael-jorge/tablab), its failure message will be updated according to the given locale. Otherwise, the write result object will be kept unchanged.

The `localize` object maps a [supported locale](#supported-locales) to its corresponding localization function. Below is an example of how the `localize` object can be used to localize a collection of write results:

```js
const { Parser, Tab } = require('tablab');
const { localize } = require('tablab-i18n');

const instructions = '0-1';

const tab = new Tab();
const parser = new Parser();

const writeResults = parser
  .parseAll(instructions)
  .map((parsedInstruction) => parsedInstruction.writeOnTab(tab));

const locale = 'en-US'; // any supported locale
localize[locale](writeResults); // localize the failure message of all failed write results
```

Below is an example of how a specific localization function can be used to localize a collection of write results:

```js
const { Parser, Tab } = require('tablab');
const { localizeEnUs } = require('tablab-i18n');

const instructions = '0-1';

const tab = new Tab();
const parser = new Parser();

const writeResults = parser
  .parseAll(instructions)
  .map((parsedInstruction) => parsedInstruction.writeOnTab(tab));

localizeEnUs(writeResults); // localize the failure message of all failed write results (en-US)
```

## License

[MIT](LICENSE)
