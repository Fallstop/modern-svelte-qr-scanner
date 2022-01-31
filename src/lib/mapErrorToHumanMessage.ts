const errorMap = {
    "Cannot access video stream (NotAllowedError).": "Can't access video stream, try choosing another camera",
    "Cannot access video stream (NotReadableError).": "Selected camera busy, try choosing another.",
    "Cannot access video stream (NotFoundError).": "No Cameras Found.",
    "Camera Permission denied": "You have denied camera permissions, to use the camera, allow it in your browser settings.",
    "WebAssembly Not Supported": "Your browser does not support WebAssembly. Please use the latest version of Chrome, Firefox or Safari.",
}

export function mediaErrorToMessage(err: Error): string {
    console.error("Media Error:",err.message)
    if (errorMap[err.message]) {
        return errorMap[err.message]
    } else {
        return `Unknown Error (${err.message})`
    }
}


