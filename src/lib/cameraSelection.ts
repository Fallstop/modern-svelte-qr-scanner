export function chooseCamera(cameras: any[], selectedCameraID: string) {
    console.log(cameras);
    let chosenCamera;
    if (typeof selectedCameraID === "undefined") {
        chosenCamera = cameras[0];
        console.log(
            "Camera not selected, choosing default"
        );
    } else {
        cameras.forEach((camera) => {
            if (camera.id === selectedCameraID) {
                chosenCamera = camera;
                console.log("Found camera", camera.id);
            }
        });
        if (typeof chosenCamera === "undefined") {
            chosenCamera = cameras[0];
            console.log("failed to find camera");
        }
    }
    selectedCameraID = chosenCamera.id;
    return chosenCamera;
}