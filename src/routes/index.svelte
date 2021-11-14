<script lang="ts">
    import QR from "$lib/index";
    import "../global.scss"

    let w;

    function onQRScan(event: CustomEvent) {
        console.log(event)
        alert(event.detail.qrContent)
    }
</script>
<div class="qr-container">
    <div class="qr-wrapper" bind:clientWidth={w}>
        <QR on:scan={onQRScan} previewWidth_px={w} previewHeight_px={w} cameraAspectRatio={1} >
            <div slot="loading">
                yeet
            </div>
            <div slot="failedToInitialize">
                Failed to initialize camera
            </div>
        </QR>
    </div>
</div>


<style lang="scss">
    .qr-container {
        width: 100vw;
        display: flex;
        justify-content: center;
    }
    .qr-wrapper {
        width: 100vw;
        max-width: 600px;
    }
</style>