<script lang="ts">
    import QR from "$lib/index";
    import "../global.scss"

    function onQRScan(event: CustomEvent) {
        console.log(event)
        alert(event.detail.qrContent)
    }
</script>
<QR on:scan={onQRScan}>
    <div slot="loading">
        yeet
    </div>
    <div slot="failedToInitialize">
        Failed to initialize camera
    </div>
</QR>