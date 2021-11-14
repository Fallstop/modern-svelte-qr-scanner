<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/env";
	import { createEventDispatcher } from "svelte";

	import Dialog from "./dialog.svelte";

	import { saveValue, getValue } from "$lib/store";
	import { chooseCamera } from "$lib/cameraSelection";
	import type { Camera } from "./instascan/camera";
import { writable } from "svelte/store";

	const dispatch = createEventDispatcher();

	export let scannerInitialized = false;
	export let cameraAspectRatio = 1.6;
	let camerasInitialized: boolean = null;

	// Whether to scan continuously for QR codes. If false, use scanner.scan() to manually scan.
	// If true, the scanner emits the "scan" event when a QR code is scanned. Default true.
	export let continuous = true;

	// Whether to horizontally mirror the video preview. This is helpful when trying to
	// scan a QR code with a user-facing camera. Default true.
	export let mirror = true;

	// Whether to include the scanned image data as part of the scan result. See the "scan" event
	// for image format details. Default false.
	export let captureImage = false;

	// Only applies to continuous mode. Whether to actively scan when the tab is not active.
	// When false, this reduces CPU usage when the tab is not active. Default true.
	export let backgroundScan = true;

	// Only applies to continuous mode. The period, in milliseconds, before the same QR code
	// will be recognized in succession. Default 5000 (5 seconds).
	export let refractoryPeriod = 5000;

	// Only applies to continuous mode. The period, in rendered frames, between scans. A lower scan period
	// increases CPU usage but makes scan response faster. Default 1 (i.e. analyze every frame).
	export let scanPeriod = 1;

	export let previewWidth_px = 800;
	export let previewHeight_px = 450;

	let displayCameraSelectionDialog = false;

	let camerasAvailable: Camera[] = [];
	let selectedCameraID: string = getValue("selectedCameraID");

	let scanner;

	async function cameraStart() {
		const camerasPermState = (
			await navigator?.permissions?.query({ name: "geolocation" })
		)?.state;

		console.log("sate:", camerasPermState);
		if (browser && camerasPermState) {
			const { Instascan } = await import("./instascan/index");
			scanner = new Instascan.Scanner({
				video: document.getElementById("cam-preview"),
				continuous,
				mirror,
				captureImage,
				backgroundScan,
				refractoryPeriod,
				scanPeriod,
			});
			scanner.addListener("scan", function (qrContent: string) {
				console.log("Scanned QR Code");
				dispatch("scan", {
					qrContent,
				});
			});
			scanner.addListener("active", function () {
				console.log("Started QR Code Scanner");
				scannerInitialized = true;
			});
			Instascan.Camera.getCameras()
				.then(function (cameras) {
					camerasAvailable = cameras;
					if (cameras.length > 0) {
						camerasInitialized = true;
						let chosenCamera = chooseCamera(
							cameras,
							selectedCameraID
						);
						saveValue("selectedCameraID", selectedCameraID);
						chosenCamera.aspectRatio = cameraAspectRatio;
						scanner.start(chosenCamera);
					} else {
						camerasInitialized = false;
						console.error("No cameras found.");
					}
				})
				.catch(function (e) {
					console.error(e);
				});
		}
	}

	function cameraStop() {
		scanner.stop();
	}

	onMount(() => {
		cameraStart();
	});

	function onSettingsClick() {
		displayCameraSelectionDialog = true;
	}

	function cameraSelect(event: CustomEvent) {
		cameraStop();
		cameraStart();
		selectedCameraID = event.detail.id;
		saveValue("selectedCameraID", selectedCameraID);
		displayCameraSelectionDialog = false;
	}
</script>

<div class="video-container" style={`--previewWidth:${previewWidth_px}px;--previewHeight:${previewHeight_px}px;`}>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video id="cam-preview" hidden={!scannerInitialized}>asd</video>
	{#if scannerInitialized}
		<button class="floating-action-button" on:click={onSettingsClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				fill="currentColor"
				class="bi bi-gear-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
				/>
			</svg>
		</button>
	{/if}

	<Dialog
		bind:camerasAvailable
		bind:displayCameraSelectionDialog
		on:camera={cameraSelect}
	/>

	{#if !scannerInitialized}
		<slot name="loading" />
	{:else if camerasInitialized === false}
		<slot name="failedToInitialize" />
	{/if}
</div>

<style lang="scss">
	.video-container {
		width: min-content;
		height: min-content;
		box-sizing: border-box;
		position: relative;
		width: var(--previewWidth);
		height: var(--previewHeight);

		#cam-preview {
			background-color: grey;
			width: var(--previewWidth);
			height: var(--previewHeight);
		}
		.floating-action-button {
			position: absolute;
			right: 5%;
			bottom: 5%;
			border: none;
			background: none;
			cursor: pointer;
			z-index: 2;
			svg {
				color: rgba(255, 255, 255, 0.8);
				filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
			}
		}
	}
</style>
