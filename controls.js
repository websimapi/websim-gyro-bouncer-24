export class Controls {
    constructor() {
        this.tilt = 0;
        this.angle = { alpha: 0, beta: 0, gamma: 0 }; // Added to store full orientation
        this.rotationRate = { alpha: 0, beta: 0, gamma: 0 };
        this.isIOS = typeof DeviceOrientationEvent.requestPermission === 'function';
    }
    
    #addEventListeners() {
        window.addEventListener('deviceorientation', (event) => {
            // gamma is the left-to-right tilt in degrees, where right is positive
            let tiltLR = event.gamma;
            // Cap the tilt value for sensitivity control
            this.tilt = Math.max(-45, Math.min(45, tiltLR));
            
            // Store all angles
            this.angle.beta = event.beta;
            this.angle.gamma = event.gamma;
            this.angle.alpha = event.alpha;
        });

        window.addEventListener('devicemotion', (event) => {
            if (event.rotationRate) {
                this.rotationRate.beta = event.rotationRate.beta || 0;
            }
        });
    }

    async requestPermission() {
        if (!this.isIOS) {
            this.#addEventListeners();
            return true; // Non-iOS devices don't need permission
        }

        try {
            const orientationPermission = await DeviceOrientationEvent.requestPermission();
            const motionPermission = await DeviceMotionEvent.requestPermission();
            
            if (orientationPermission === 'granted' && motionPermission === 'granted') {
                this.#addEventListeners();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Permission request for device motion/orientation failed.", error);
            return false;
        }
    }

    getTilt() {
        return this.tilt;
    }

    getAngle() {
        return this.angle;
    }

    getRotationRate() {
        return this.rotationRate;
    }
}