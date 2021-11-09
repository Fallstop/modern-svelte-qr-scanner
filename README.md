# Modern Svelte QR Scanner
This is a work-in-progress component library to enable QR-code scanning

## Origin

This is based on `instascan`, and is designed as a more batteries included version of [QRScanner](https://github.com/Pedroglp/svelte-qr-scanner). It has the source of `instascan` and `fsm-as-promised` bundled inside, as they both have modifications to work with Svelte.

## Developing

Once you've created a project and installed dependencies with `yarn`, start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

## Building

Before creating a production version of the library, simply run the `package` script:

```bash
yarn package
```