export function generateTrackingNumber() {
    const timestamp = Date.now().toString(36); // Convert timestamp to base-36
    const randomSuffix = Math.random().toString(36).substr(2, 5).toUpperCase(); // Random suffix
    return `${timestamp}-${randomSuffix}`; // Example: "l6cxds-4XYF9"
  }




