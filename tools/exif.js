const fs = require('fs');
const exif = require('exif').ExifImage;


async function get_img_unique_id(x) {
    try {
        // Attempt to read EXIF data
        return new Promise((resolve, reject) => {
            new exif({ image : x }, (error, exifData) => {
                if (error) {
                    reject('Error: ' + error.message); // Reject the promise if there's an error
                } else {
                    resolve(exifData.exif.ImageUniqueID); // Resolve the promise with the media ID
                }
            });
        });
    } catch (error) {
        throw new Error('Error: ' + error.message); // Throw an error to be caught by the caller
    }
}

async function handleImage(x) {
    try {
        let mediaId = await get_img_unique_id(x);
        return mediaId; // Return the ID to be used in further processing
    } catch (error) {
        console.error("Error handling image:", error);
        return null; // Handle errors or return a default/fallback value
    }
}

async function processImage() {
    let mediaId = await handleImage('image.jpg');
    if (mediaId) {
        console.log('Media ID retrieved:', mediaId);
        // You can now pass this mediaId to other functions or use it as needed
        furtherProcessing(mediaId);
    } else {
        console.log('Failed to retrieve Media ID');
    }
}

function furtherProcessing(id) {
    console.log('Processing media with ID:', id);
    // Implement further actions with the media ID
}

processImage();
