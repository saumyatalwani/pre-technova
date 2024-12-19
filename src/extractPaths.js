import axios from "axios";

export default async function extractPath(routeData) {
    const key = import.meta.env.VITE_OLA_MAPS_API_KEY;
    const locations = [];
    const maxPoints = 50; // Limit for lat/lng pairs per request
    const routeChunks = []; // To store chunks of routes

    let currentChunk = '';

    routeData.routes.forEach((route) => {
        route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
                const startLocation = [step.start_location.lng, step.start_location.lat] || [];
                const endLocation = [step.end_location.lng, step.end_location.lat] || [];
                
                // Append start and end points to the current chunk
                const startPoint = `${step.start_location.lat},${step.start_location.lng}`;
                const endPoint = `${step.end_location.lat},${step.end_location.lng}`;

                currentChunk += startPoint + '|';
                currentChunk += endPoint + '|';

                // Add locations to the array
                locations.push(startLocation);
                locations.push(endLocation);

                // Check if the chunk has reached the limit
                const numPoints = currentChunk.split('|').length - 1; // Subtract 1 for trailing pipe
                if (numPoints >= maxPoints) {
                    // Remove trailing pipe and push to routeChunks
                    routeChunks.push(currentChunk.slice(0, -1));
                    currentChunk = ''; // Reset chunk
                }
            });
        });
    });

    // Push the remaining chunk if not empty
    if (currentChunk) {
        routeChunks.push(currentChunk.slice(0, -1));
    }

    // Send requests for each chunk
    const snappedRoutes = [];
    for (const chunk of routeChunks) {
        try {
            const response = await axios.get(
                `https://api.olamaps.io/routing/v1/snapToRoad?points=${chunk}&enhancePath=false&api_key=${key}`
            );
            snappedRoutes.push(response.data);
        } catch (error) {
            console.error('Error while fetching snapped route for chunk:', chunk, error);
        }
    }

    // Extract snapped points
    const coords = [];
    for (const route of snappedRoutes) {
        if (route.snapped_points) {
            route.snapped_points.forEach((point) => {
                const coord = [point.location.lng, point.location.lat];
                coords.push(coord);
            });
        }
    }

    return coords;
}
