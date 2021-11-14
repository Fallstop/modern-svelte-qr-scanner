<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly, fade } from "svelte/transition";
    import {clickOutside} from './util';

    import type { Camera } from "./instascan/camera";

    const dispatch = createEventDispatcher();

    export let camerasAvailable: Camera[];

    export let displayCameraSelectionDialog: boolean;

    const cameraSelectCallback: CallableFunction = (id: string) =>
        cameraSelect(id);

    function cameraSelect(id) {
        console.log(id);
        dispatch("camera", {
            id,
        });
    }

    function closeDialog() {
        displayCameraSelectionDialog = false;
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
            {#each camerasAvailable as camera}
                <button
                    class="camera-container"
                    on:click={cameraSelectCallback(camera.id)}
                    >{camera.name}</button
                >
            {/each}
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
