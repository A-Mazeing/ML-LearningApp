import * as tmImage from "@teachablemachine/image";
import {useEffect} from "react";

//Function for Model Loading returns a Model Object
//Input: model URL
export async function LoadModel(modelUrl){
    if (modelUrl) {
       try
       {
           //Model Scripts laden:
           const modelURL = modelUrl + "model.json";
           const metadataURL = modelUrl + "metadata.json";
           return await tmImage.load(modelURL, metadataURL);
       }
       catch (error)
       {
           console.error("Fehler beim Laden des Modells:", error);
       }
       return null;
    }
}

//Funktion für Kamera-Devices -> returned alle KameraDevices
export async function GetCamDevices(){
    try
    {
        //Get all Devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        //Filter nach Cam-Inputs
        return devices.filter((device) => device.kind === "videoinput");
    }
    catch (error)
    {
        console.error("Fehler beim Abrufen der Geräte:", error);
    }
}


export function useSetVideoDevice(videoRef, deviceId) {
    useEffect(() => {
        const setVideoStream = async () => {
            if (!videoRef.current || !deviceId) return;

            try {
                // Stop existing video streams
                if (videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks();
                    tracks.forEach((track) => track.stop());
                }

                // Request new video stream for the device
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: deviceId } },
                });

                videoRef.current.srcObject = stream;
            } catch (error) {
                console.error("Error accessing the video device:", error);
            }
        };

        setVideoStream();

        // Cleanup on unmount or deviceId change
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [videoRef, deviceId]);
}

//Funktion um die Kamera zu verändert, rückt im Array eine Position weiter -> auf das nächste Device Objekt
//Output:
export async function SwitchCam(deviceList, currentDeviceId, videoRef, setCurrentDeviceId) {
    if (deviceList.length > 1) {
        // Finde das aktuelle Gerät im Array
        const currentIndex = deviceList.findIndex((device) => device.deviceId === currentDeviceId);

        if (currentIndex === -1) {
            console.error("Aktuelles Gerät nicht in der Liste gefunden");
            return;
        }

        // Bestimme das nächste Gerät
        const nextIndex = (currentIndex + 1) % deviceList.length;
        const nextDeviceId = deviceList[nextIndex].deviceId;

        try {
            // Kamera wechseln
            const isActive = await SetCam(nextDeviceId, false, videoRef);

            if (isActive) {
                // Aktualisiere die aktuelle DeviceId
                setCurrentDeviceId(nextDeviceId);
                console.log(`Kamera gewechselt zu: ${deviceList[nextIndex].label}`);
            } else {
                console.error("Kamerawechsel fehlgeschlagen");
            }
        } catch (error) {
            console.error("Fehler beim Wechseln der Kamera:", error);
        }
    } else {
        console.warn("Nur eine Kamera verfügbar");
    }
}




