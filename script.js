// script.js

const webcamFeed = document.getElementById('webcamFeed');
const captureButton = document.getElementById('captureButton');
const hiddenCanvas = document.getElementById('hiddenCanvas');
const statusMessageDiv = document.getElementById('statusMessage');
const sendPhotoButton = document.getElementById('sendPhotoButton');

let capturedImageBlob = null; // To store the captured image as a Blob
let isFaceApiModelsLoaded = false;

// Load face-api.js models (only need the face detection model for this)
async function loadModels() {
    try {
        // Load the SSD MobileNet v1 model for face detection
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'); // Adjust path if needed
        console.log('Face-api.js SSD MobileNet v1 model loaded.');
        isFaceApiModelsLoaded = true;
        updateStatus('Models loaded. Starting webcam...');
        startWebcam(); // Start webcam after models are loaded
    } catch (error) {
        console.error('Error loading face-api.js models:', error);
        updateStatus('Error loading models. Please check the console.');
    }
}

// Access the webcam
async function startWebcam() {
    if (!webcamFeed) {
        updateStatus("Webcam video element not found.");
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamFeed.srcObject = stream;
        webcamFeed.onloadedmetadata = () => {
             updateStatus('Webcam started. Ready to capture.');
             captureButton.disabled = false; // Enable capture button once webcam is ready
        }
    } catch (error) {
        console.error('Error accessing webcam:', error);
        updateStatus('Could not access webcam. Please ensure permissions are granted.');
    }
}

// Update status message on the page
function updateStatus(message, isError = false) {
    if (statusMessageDiv) {
        statusMessageDiv.innerText = message;
        statusMessageDiv.style.color = isError ? 'red' : '#333';
    }
}


// Capture image from webcam feed
captureButton.addEventListener('click', async () => {
    if (!isFaceApiModelsLoaded) {
        updateStatus('Models not loaded yet. Please wait.');
        return;
    }
    if (!webcamFeed || !webcamFeed.srcObject) {
        updateStatus('Webcam feed not available.', true);
        return;
    }

    updateStatus('Capturing and checking for face...');
    sendPhotoButton.disabled = true; // Disable send button during processing

    const context = hiddenCanvas.getContext('2d');
    hiddenCanvas.width = webcamFeed.videoWidth;
    hiddenCanvas.height = webcamFeed.videoHeight;
    context.drawImage(webcamFeed, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // Get the image data as a Blob
    hiddenCanvas.toBlob(async blob => {
        if (!blob) {
             updateStatus('Failed to capture image.', true);
             return;
        }
        capturedImageBlob = blob;
        console.log('Image captured from webcam.');

        // Create an Image element from the captured blob for face-api
        const capturedImageForFaceApi = await faceapi.fetchImage(URL.createObjectURL(capturedImageBlob));

        // --- Perform Face Detection ---
        try {
            // Use detectSingleFace to find the most confident face
            const detection = await faceapi.detectSingleFace(capturedImageForFaceApi, new faceapi.SsdMobilenetv1Options());

            if (detection) {
                updateStatus('Face detected! Photo is ready to send.');
                sendPhotoButton.disabled = false; // Enable send button
                console.log('Face detection successful:', detection);

                // Optional: Draw detection on a temporary canvas or the video feed
                // (More complex to draw persistently on a video feed)

            } else {
                updateStatus('No face detected. Please adjust and try again.', true);
                capturedImageBlob = null; // Discard the captured image if no face
                sendPhotoButton.disabled = true; // Ensure send button is disabled
                 console.log('No face detected.');
            }
        } catch (error) {
            console.error('Error during face detection:', error);
            updateStatus('Error during face detection. Please check console.', true);
            capturedImageBlob = null; // Discard on error
            sendPhotoButton.disabled = true;
        }


    }, 'image/png'); // You can change the image format if needed
});


// Event listener for the Send Photo button
sendPhotoButton.addEventListener('click', async () => {
    if (capturedImageBlob) {
        updateStatus('Sending photo to API...');
        sendPhotoButton.disabled = true;

        // --- Code to Send the Photo to API ---
        const formData = new FormData();
        formData.append('selfie', capturedImageBlob, 'selfie.png'); // 'selfie' is the field name for your API

        // Replace with your actual API endpoint URL
        const apiEndpoint = '/api/kyc/submit-selfie'; // Example endpoint

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                updateStatus('Photo sent successfully! API Response: ' + JSON.stringify(result), false);
                 console.log('API Success:', result);
                // Handle successful API response (e.g., show next step)

            } else {
                 const errorResult = await response.json();
                 updateStatus('Failed to send photo to API. Status: ' + response.status + ', Message: ' + (errorResult.message || response.statusText), true);
                 console.error('API Error:', response.status, errorResult);
                 // Handle API errors
            }

        } catch (error) {
            console.error('Error during API call:', error);
            updateStatus('An error occurred while sending photo.', true);
        } finally {
            sendPhotoButton.disabled = false; // Re-enable button
            // You might clear the captured image or require a new capture here
             capturedImageBlob = null; // Clear blob after sending
             updateStatus('Ready to capture new selfie.'); // Reset status
        }

    } else {
        updateStatus('No valid photo captured yet.', true);
    }
});


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements (already done at the top scope)
    // Initial status update
    updateStatus('Loading models...');
    captureButton.disabled = true; // Disable capture until webcam is ready

    // Load models and then start webcam
    loadModels();
    // Webcam is started inside loadModels after success
});