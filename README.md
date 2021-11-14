# Modern Svelte QR Scanner
This is a work-in-progress component library to enable QR-code scanning

### Origin

This is based on `instascan`, and is designed as a more batteries included version of [QRScanner](https://github.com/Pedroglp/svelte-qr-scanner). It has the source of `instascan` and `fsm-as-promised` bundled inside, as they both have modifications to work with Svelte.


## Install
Just open your project and use the command line to install:

```bash
yarn add svelte-range-slider-pips -D             # if you are using yarn
npm install svelte-range-slider-pips --save-dev  # if you are using npm
```

## Usage

Assuming you have a svelte/sveltekit app up and running, just import and 

## Developing Library

Once you've created a project and installed dependencies with `yarn`, start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

# Building

To create a production version of the library, simply run the `package` script:

```bash
yarn package
```