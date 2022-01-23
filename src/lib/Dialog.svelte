<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly, fade } from "svelte/transition";
    import Select from 'svelte-select';


    import {detectMobileCameras, CameraDirection, cameraDirectionGuess} from "$lib/cameraSelection"

    import type { Camera } from "$lib/instascan/camera";
import CloseIcon from "./icons/CloseIcon.svelte";

    const dispatch = createEventDispatcher();


    export let camerasAvailable: Camera[];

    export let displayCameraSelectionDialog: boolean;

    export let chosenCamera: Camera;
    export let previewWidth_px: number;

    $: compactMode = previewWidth_px <= 400;

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
    <div class="dialog-container" class:compact="{compactMode}" transition:fade on:click|self={closeDialog}>
        <div
            class="dialog-content" class:compact="{compactMode}"
            transition:fly={{ y: 200, duration: 500 }}
        >
            <div class="close-icon" on:click={closeDialog}>
                <CloseIcon/>
            </div>
            <h3>Select a camera</h3>
            {#if camerasAvailable.length > 0}
                <Select items={getUserCameraList(camerasAvailable)} on:select={cameraSelect} value={selectedCamera} isSearchable={false} isClearable={false} inputAttributes={{style: "padding: 0;"}}></Select>
            {:else}
                <p>No cameras detected</p>
            {/if}
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
        &:not(.compact) {
            display: flex;
            align-items: flex-start;
            justify-content: center;
        }
        .dialog-content {
            background-color: white;
            padding: 0.5em 1em;
            text-align: center;
            position: relative;
            &:not(.compact) {
                border-radius: 1rem;
                width: 50%;
                margin-top: 2em;

            }
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
            .close-icon {
                position: absolute;
                top: 0.5em;
                right: 0.5em;
                cursor: pointer;
                transition: all 0.1s ease-in-out;
                &:hover {
                    filter: drop-shadow(0 0 0.5rem #000);
                }
            }
        }
    }
</style>
