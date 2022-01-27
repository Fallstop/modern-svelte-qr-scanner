export let mediaErrorCallback: CallableFunction = null;


function cameraName(label) {
  let clean = label.replace(/\s*\([0-9a-f]+(:[0-9a-f]+)?\)\s*$/, '');
  return clean || label || null;
}

export class MediaError extends Error {
  type: any;
  constructor(type) {
    super(`Cannot access video stream (${type}).`);
    this.type = type;
  }
}

export class Camera {
  id: any;
  name: string;
  aspectRatio: number;
  _stream: MediaStream;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.aspectRatio = 1;
    this._stream = null;
    console.log("creating camera")
  }

  async start() {
    let constraints = {
      audio: false,
      video: {
        mandatory: {
          sourceId: this.id,
          minWidth: 600,
          maxWidth: 1920,
          minAspectRatio: this.aspectRatio
        },
        optional: []
      }
    };

    this._stream = await Camera._wrapErrors(async () => {
      return await navigator.mediaDevices.getUserMedia(constraints);
    });

    return this._stream;
  }

  stop() {
    if (!this._stream) {
      return;
    }

    for (let stream of this._stream.getVideoTracks()) {
      stream.stop();
    }

    this._stream = null;
  }

  static async getCameras() {
    console.log("Ensuring Access")
    await this._ensureAccess();
    console.log("getting cameras")
    let devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(d => d.kind === 'videoinput')
      .map(d => new Camera(d.deviceId, cameraName(d.label)));
  }

  static async _ensureAccess() {
    return await this._wrapErrors(async () => {
      console.log("yeeta")

      let access = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("yeet")

        for (let stream of access.getVideoTracks()) {

          stream.stop();
        }
    });
  }
  
  static setMediaErrorCallback(callback: CallableFunction) {
    mediaErrorCallback = callback
  }

  static async _wrapErrors(fn) {
    try {
      return await fn();
    } catch (e) {
      if (e.name) {
        if (mediaErrorCallback !== null) {
          mediaErrorCallback(new MediaError(e.name))
        } else {
          console.log("Media Error Callback not found");
          throw new MediaError(e.name);
        }
      } else {
        throw e;
      }
    }
  }
}
