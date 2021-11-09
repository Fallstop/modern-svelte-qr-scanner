<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/env";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let scannerInitialized = false;
	let camerasAvailable: boolean = null;

	onMount(async () => {
		const camerasPermState = (await navigator?.permissions?.query({name:'geolocation'}))?.state
		console.log("sate:",camerasPermState)
		if (browser && camerasPermState) {
			const { Instascan } = await import("./instascan/index");
			let scanner = new Instascan.Scanner({
				video: document.getElementById("cam-preview"),
			});
			scanner.addListener("scan", function (qrContent: string) {
				console.log("Scanned QR Code")
				dispatch("scan", {
					qrContent,
				});
			});
			scanner.addListener("active", function () {
				console.log("Started QR Code Scanner")
				scannerInitialized = true;
			});
			Instascan.Camera.getCameras()
				.then(function (cameras) {
					if (cameras.length > 0) {
						camerasAvailable = true;
						scanner.start(cameras[0]);
					} else {
						camerasAvailable = false;
						console.error("No cameras found.");
					}
				})
				.catch(function (e) {
					console.error(e);
				});
		}
	});
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video id="cam-preview" hidden={!scannerInitialized}/>
{#if !scannerInitialized}
	<slot name="loading">
	</slot>
{:else if camerasAvailable===false}
	<slot name="failedToInitialize">
	</slot>
{/if}