# Modern Svelte QR Scanner
This is a work-in-progress component library to enable QR-code scanning.

### Origin

This is based on `instascan`, and is designed as a more batteries included version of [QRScanner](https://github.com/Pedroglp/svelte-qr-scanner). It has the source of `instascan` and `fsm-as-promised` bundled inside, as they both have modifications to work with Svelte.


## Install
Just open your project and use the command line to install:

```bash
yarn add modern-svelte-qr-scanner -D             # if you are using yarn
npm install modern-svelte-qr-scanner --save-dev  # if you are using npm
```

## Usage

Assuming you have a svelte/sveltekit app up and running, just paste in the following example

```html
<script lang="ts">
    import QR from "modern-svelte-qr-scanner";

    let previewWidth;
    let mediaErrorMessage = "";

    function onQRScan(event: CustomEvent) {
        alert(event.detail.qrContent);
    }
</script>
<div class="qr-container">
    <div class="qr-wrapper" bind:clientWidth={w}>
        <QR
            on:scan={onQRScan}
            previewWidth_px={w}
            previewHeight_px={w}
            bind:mediaErrorMessage
        >
            <div slot="loading" class="loading">
                <span>Loading Animation, but text</span>
            </div>
            <div slot="failedToInitialize" class="failed-to-initialize">
                Failed to initialize camera.<br>
                Error: {mediaErrorMessage}
            </div>
        </QR>
    </div>
</div>
```

## API Reference

### Slots

| Slot Name          | Description                                       |
|--------------------|---------------------------------------------------|
| loading            | Displayed while the cameras are initializing.     |
| failedToInitialize | Displayed when the current camera fails to start. |


### Props (Options)

| Prop                 | Type    | Default | Read-only | Description                                                                                                                                                  |
|----------------------|---------|---------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| scannerInitialized   | boolean | false   | x         | Whether the QR code scanner has loaded yet.                                                                                                                  |
| backgroundScan       | boolean | true    |           | Whether to actively scan when the tab is not active. When false, this reduces CPU usage when the tab is not active.                                          |
| refractoryPeriod     | number  | 5000    |           | The period, in milliseconds, before the same QR code will be recognized in succession. Default 5000 (5 seconds).                                             |
| scanPeriod           | number  | 1       |           | The period, in rendered frames, between scans. A lower scan period increases CPU usage but makes scan response faster. Default 1 (i.e. analyze every frame). |
| previewWidth_px      | number  | 800     |           | The width of the video preview. Bind this value to the width of the parent to make the scanner responsive.                                                   |
| previewHeight_px     | number  | 450     |           | The height of the video preview. Bind this value to the width of the parent / wanted_aspect_ratio to make the scanner responsive.                            |
| mediaErrorMessage    | string  | ""      | x         | Human readable error message, updates when there is a new error. Useful displayed in the failedToInitialize slot.                                            |
| smallModalXThreshold | number  | 400     |           | The width threshold to move the camera selection from a traditional center of screen modal, to being pined to the top.                                       |

### Events

| Event ID | Description                        | Data Structure     |
|----------|------------------------------------|--------------------|
| scan     | Emitted when a QR code is scanned. | {"qrContent": "x"} |

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

## Known Errors
1. svelte-select not being included
For some reason, sometimes you might have to install `svelte-select` manually with a fresh project.

fix:
```bash
yarn add modern-svelte-qr-scanner -D             # if you are using yarn
npm install modern-svelte-qr-scanner --save-dev  # if you are using npm
```

2. Library's requiring bundling
When using SvelteKit, you must include some of the older library's in the optimizeDeps option.

fix: Add them to the your `svelte.config.js`.
```js
const config = {
  ...,
  kit: {
     ...,
     vite: {
       ...,
      optimizeDeps: {
        include: [
          "events",
          "uuid",
          "visibilityjs",
          "stampit",
          "lodash",
        ]
      },
     }
  },
};
```