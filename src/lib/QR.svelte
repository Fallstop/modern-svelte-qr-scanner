<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/env";
	import { fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	import Dialog from "./Dialog.svelte";

	import { saveValue, getValue } from "$lib/store";
	import { chooseCamera } from "$lib/cameraSelection";
	import type { Camera } from "./instascan/camera";
	import {mediaErrorToMessage} from "$lib/mapErrorToHumanMessage"
import GearIcon from "./icons/GearIcon.svelte";

	const dispatch = createEventDispatcher();

	export let scannerInitialized = false;
	let cameraAspectRatio = 1.6;
	let camerasInitialized: boolean = false;

	// Whether to scan continuously for QR codes. If false, use scanner.scan() to manually scan.
	// If true, the scanner emits the "scan" event when a QR code is scanned. Default true.
	let continuous = true;

	// Whether to include the scanned image data as part of the scan result. See the "scan" event
	// for image format details. Default false.
	let captureImage = false;

	// Only applies to continuous mode. Whether to actively scan when the tab is not active.
	// When false, this reduces CPU usage when the tab is not active. Default true.
	export let backgroundScan = true;

	// Only applies to continuous mode. The period, in milliseconds, before the same QR code
	// will be recognized in succession. Default 5000 (5 seconds).
	export let refractoryPeriod = 5000;

	// Only applies to continuous mode. The period, in rendered frames, between scans. A lower scan period
	//  increases CPU usage but makes scan response faster. Default 1 (i.e. analyze every frame).
	export let scanPeriod = 1;

	export let previewWidth_px = 800;
	export let previewHeight_px = 450;

	export let mediaErrorMessage = "";

	// Decides the style of the modal for the camera selection dialog.
	export let smallModalXThreshold: number = 400;

	let displayCameraSelectionDialog = false;

	let camerasAvailable: Camera[] = [];
	let selectedCameraID: string = getValue("selectedCameraID");

	let scanner;

	let videoPreviewElm: HTMLVideoElement;
	let videoPreviewStyleTags: string = "";

	let chosenCamera: Camera;
	let mirror: boolean;

	async function cameraStart() {
		const camerasPermState = (
			await navigator?.permissions?.query({ name: "geolocation" })
		)?.state;

		if (browser && camerasPermState) {
			const { Instascan } = await import("./instascan/index");
			Instascan.Camera.setMediaErrorCallback(createMediaError);
			camerasAvailable = await Instascan.Camera.getCameras();

			if (camerasAvailable.length > 0) {
				
				// When permissions are denied, it creates a fake camera
				if (camerasAvailable[0].name === null) {
					return
				}


				camerasInitialized = true;
				[chosenCamera, mirror] = chooseCamera(
					camerasAvailable,
					selectedCameraID
				);
				
				chosenCamera.aspectRatio = cameraAspectRatio;
				scanner = new Instascan.Scanner({
					video: videoPreviewElm,
					continuous,
					mirror,
					captureImage,
					backgroundScan,
					refractoryPeriod,
					scanPeriod,
				});
				scanner.addListener("scan", function (qrContent: string) {
					dispatch("scan", {
						qrContent,
					});
				});
				scanner.addListener("active", function () {
					scannerInitialized = true;
				});
				let stream = await scanner.start(chosenCamera);
			} else {
				camerasInitialized = false;
				console.error("No cameras found.");
			}
		}
	}

	function cameraStop() {
		if (scanner) {
			scanner.stop();
		} else {
			console.error("No scanner to stop");
		}
	}

	onMount(() => {
		if (browser) {
			cameraStart();
		}
	});

	function onSettingsClick() {
		displayCameraSelectionDialog = !displayCameraSelectionDialog;
	}

	function cameraSelect(event: CustomEvent) {
		cameraStop();
		cameraStart();
		selectedCameraID = event.detail.id;
		saveValue("selectedCameraID", selectedCameraID);
		displayCameraSelectionDialog = false;
	}

	function createMediaError(err) {
		mediaErrorMessage = mediaErrorToMessage(err);
		camerasInitialized = false;
		scannerInitialized = true;
	}

	function updateVideoAspectRatio() {
		videoPreviewStyleTags = (videoPreviewElm?.videoWidth || 0) < (videoPreviewElm?.videoHeight) || 0
			? "width: var(--previewWidth);"
			: "height: var(--previewHeight);"
	}

	setInterval(updateVideoAspectRatio, 100);
</script>

<div
	class="video-container"
	style={`--previewWidth:${previewWidth_px}px;--previewHeight:${previewHeight_px}px;`}
>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		id="cam-preview"
		bind:this={videoPreviewElm}
		hidden={!scannerInitialized || !camerasInitialized}
		style={videoPreviewStyleTags}
	/>
	{#if scannerInitialized}
		<button class="floating-action-button" on:click={onSettingsClick}>
			<GearIcon/>
		</button>
	{/if}

	<Dialog
		bind:camerasAvailable
		bind:displayCameraSelectionDialog
		on:camera={cameraSelect}
		bind:chosenCamera
		bind:smallModalXThreshold
	/>

	{#if !scannerInitialized}
		<div transition:fade|local class="transition-wrapper">
			<slot name="loading" />
		</div>
	{:else if !camerasInitialized}
		<div transition:fade|local class="transition-wrapper">
			<slot name="failedToInitialize" />
		</div>
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
		overflow: hidden;

		#cam-preview {
			background: #222222;
		}
		.floating-action-button {
			position: absolute;
			right: 5%;
			bottom: 5%;
			border: none;
			background: none;
			cursor: pointer;
			z-index: 2;
			:global(svg) {
				color: rgba(255, 255, 255, 0.8);
				filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
			}
		}
		.transition-wrapper {
			height: 100%;
			width: 100%;
		}
	}
</style>
