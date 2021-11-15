<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly, fade } from "svelte/transition";
    import Select from 'svelte-select';


    import {clickOutside} from '$lib/util';
    import {detectMobileCameras, CameraDirection, cameraDirectionGuess} from "$lib/cameraSelection"

    import type { Camera } from "$lib/instascan/camera";

    const dispatch = createEventDispatcher();

    export let camerasAvailable: Camera[];

    export let displayCameraSelectionDialog: boolean;

    export let chosenCamera: Camera;



    const cameraSelectCallback: CallableFunction = (id: string) =>
        cameraSelect(id);

    function cameraSelect(event) {
        let id = event.detail.value
        dispatch("camera", {
            id,
        });
    }

    function getUserCameraList(camerasAvailable: Camera[]) {
        if (detectMobileCameras(camerasAvailable)) {
            return camerasAvailable.map(camera=>({
                "label": cameraDirectionGuess(camera)===CameraDirection.Front ? "Front Camera" : "Back Camera",
                "value": camera.id
            }))
        } else {
            return camerasAvailable.map(camera=>({
                "label": camera.name,
                "value": camera.id
            }))
        }
    }

    function closeDialog() {
        displayCameraSelectionDialog = false;
    }

    $: selectedCamera = {
		"value": chosenCamera?.id,
		"label": chosenCamera?.name
	}
</script>

{#if displayCameraSelectionDialog}
    <div class="dialog-container" transition:fade>
        <div
            class="dialog-content"
            transition:fly={{ y: 200, duration: 500 }}
            use:clickOutside on:click_outside={closeDialog}
        >
            <h3>Select a camera</h3>
            <Select items={getUserCameraList(camerasAvailable)} value={selectedCamera} on:select={cameraSelect}></Select>
        </div>
    </div>
{/if}

<style lang="scss">
    .dialog-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.363);
        display: flex;
        justify-content: center;
        align-items: center;
        .dialog-content {
            background-color: white;
            padding: 0.5em 1em;
            border-radius: 1rem;
            width: 50%;
            h3 {
                margin: 0 0.2rem 0;
                font-size: 1.2rem;
            }

            .camera-container {
                border: none;
                display: block;
                background-color: #eeeeee;
                font-size: 0.9rem;
                cursor: pointer;
            }
        }
    }
</style>
