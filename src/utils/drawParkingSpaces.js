import { drawStandardParkingSpace, drawAccessibleParkingSpace, drawParkingArea, drawDrivingLanes,  drawSpaceLabel, } from './parkingHelpers';

export function drawParkingSpaces(ctx, parkingArea, totalSpaces, accessibleSpaces, vehicleType, orientation, vehicleSize, canvasWidth, canvasHeight, orientationConfig) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
    // Set up drawing styles
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 1;
  
    // Calculate the number of rows and columns for parking spaces
    const numRows = Math.floor(parkingArea.length / orientationConfig[orientation].spaceLength);
    const numCols = Math.floor(parkingArea.width / orientationConfig[orientation].spaceWidth);
  
    // Loop through rows and columns to draw parking spaces
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = col * orientationConfig[orientation].spaceWidth * parkingArea.widthScaleFactor;
        const y = row * orientationConfig[orientation].spaceLength * parkingArea.heightScaleFactor;
  
        // Draw the parking space
        ctx.beginPath();
        ctx.rect(x, y, vehicleSize[vehicleType].width * parkingArea.widthScaleFactor, vehicleSize[vehicleType].length * parkingArea.heightScaleFactor);
        ctx.stroke();
  
        // Draw accessible parking space indicator
        if (accessibleSpaces > 0) {
          ctx.font = '20px Arial';
          ctx.fillText('A', x + vehicleSize[vehicleType].width * parkingArea.widthScaleFactor / 2, y + vehicleSize[vehicleType].length * parkingArea.heightScaleFactor / 2);
          accessibleSpaces--;
        }
      }
    }
  }
  