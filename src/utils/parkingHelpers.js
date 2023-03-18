// utils/parkingHelpers.js

export function drawStandardParkingSpace(context, x, y, spaceWidth, spaceLength) {
    // Draw parking slots with dotted lines around them
    context.setLineDash([4, 4]);
    context.strokeStyle = '#999';
    context.strokeRect(x, y, spaceWidth, spaceLength);
  
    // Draw a small 'P' in the center of each parking slot
    context.fillStyle = 'black';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('P', x + spaceWidth / 2, y + spaceLength / 2);
  }
  
  export function drawAccessibleParkingSpace(context, x, y, spaceWidth, spaceLength) {
    // Draw parking slots with dotted lines around them
    context.setLineDash([4, 4]);
    context.strokeStyle = '#999';
    context.strokeRect(x, y, spaceWidth, spaceLength);
  
    // Draw a small 'P' in the center of each parking slot
    context.fillStyle = 'blue';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('P', x + spaceWidth / 2, y + spaceLength / 2);
  }
  
  export function drawParkingArea(context, areaOffsetX, areaOffsetY, areaWidth, areaHeight, drivingSpaceWidth, drivingSpaceLength) {
    context.fillStyle = 'gray';
    context.fillRect(areaOffsetX + drivingSpaceWidth, areaOffsetY + drivingSpaceLength, areaWidth - drivingSpaceWidth, areaHeight - drivingSpaceLength);
  }
  
  export function calculateSpaces(
    parsedWidth,
    parsedLength,
    vehicleType,
    accessibleSpacesPercentage,
    levels,
    orientation,
    parkingOrientations,
    vehicleSize,
  ) {
    const carSize = vehicleSize[vehicleType].length;
    const doorSpace = 1; // Space needed to open car doors in meters
    const drivingSpace = 3; // Space needed for cars to drive in and out in meters
  
    const orientationConfig = {
      parallel: {
        spaceWidth: carSize * 2 + doorSpace + drivingSpace,
        spaceLength: carSize + doorSpace,
        drivingSpaceWidth: drivingSpace,
        drivingSpaceLength: 0,
      },
      perpendicular: {
        spaceWidth: carSize + doorSpace,
        spaceLength: carSize * 2 + doorSpace + drivingSpace,
        drivingSpaceWidth: 0,
        drivingSpaceLength: drivingSpace,
      },
      angled: {
        spaceWidth: (carSize + doorSpace) * 1.5,
        spaceLength: carSize * 2 + doorSpace + drivingSpace,
        drivingSpaceWidth: 0,
        drivingSpaceLength: drivingSpace,
      },
    };
  
    if (isNaN(parsedWidth) || isNaN(parsedLength) || parsedWidth <= 0 || parsedLength <= 0) {
      return {
        totalSpaces: '',
        errorMsg: 'Please enter valid dimensions.',
        accessibleSpaces: '',
      };
    }
  
    const minWidth = carSize + doorSpace;
    const minLength = carSize * 2 + doorSpace + drivingSpace;
  
    if (parsedWidth < minWidth || parsedLength < minLength) {
      return {
        totalSpaces: '',
        errorMsg: `The minimum required dimensions for a parking space are ${minWidth} meters in width and ${minLength} meters in length.`,
        accessibleSpaces: '',
      };
    }
  
    const accessibleWidth = minWidth * 1.5;
    const standardParkingSpaceArea = (parsedWidth - doorSpace) * (parsedLength - drivingSpace) * parkingOrientations[orientation];
    const totalStandardSpaces = Math.floor(standardParkingSpaceArea / (carSize * carSize));
    let accessibleSpaces = Math.round((accessibleSpacesPercentage / 100) * totalStandardSpaces);
    const totalSpaces = totalStandardSpaces * levels;
  
    if (accessibleSpaces > totalSpaces) {
      accessibleSpaces = totalSpaces;
    }
  
    return {
      totalSpaces,
      errorMsg: '',
      accessibleSpaces,
    };
  }

  
  export function drawDrivingLanes(context, offsetX, offsetY, width, height, drivingSpaceWidth, drivingSpaceLength, orientation) {
    context.save();
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.setLineDash([5, 10]);
  
    if (orientation === 'parallel') {
      context.beginPath();
      context.moveTo(offsetX + drivingSpaceWidth, offsetY);
      context.lineTo(offsetX + drivingSpaceWidth, offsetY + height);
      context.stroke();
    } else if (orientation === 'perpendicular' || orientation === 'angled') {
      context.beginPath();
      context.moveTo(offsetX, offsetY + drivingSpaceLength);
      context.lineTo(offsetX + width, offsetY + drivingSpaceLength);
      context.stroke();
    }
  
    context.restore();
  }

  
  export function drawSpaceLabel(context, x, y, width, height, spaceNumber) {
    context.fillStyle = '#000000';
    context.font = 'bold 10px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText(spaceNumber, x + 4, y + 4); // Add some padding (4 pixels) to the top-left corner
  }