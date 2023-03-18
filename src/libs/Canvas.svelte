<script>
  import { onMount } from 'svelte';
  import { Canvas } from 'svelte-canvas';

  let ctx;

  onMount(() => {
    drawCanvas(ctx);
  });

  function drawCanvas(ctx) {
    const parsedWidth = parseFloat(width);
    const parsedLength = parseFloat(length);
    const carSize = 4; // Average car size in meters
    const doorSpace = 1; // Space needed to open car doors in meters
    const drivingSpace = 3; // Space needed for cars to drive in and out in meters

    // Calculate parking space dimensions
    const parkingSpaceWidth = carSize + doorSpace;
    const parkingSpaceLength = carSize * 2 + doorSpace + drivingSpace;

    // Calculate number of parking spaces that can fit in the area
    const parkingSpaceArea = (parsedWidth - doorSpace) * (parsedLength - drivingSpace);
    const numSpaces = Math.floor(parkingSpaceArea / (carSize * carSize));

    // Draw parking spaces
    const spaceWidth = parkingSpaceWidth * 30; // Scale factor
    const spaceLength = parkingSpaceLength * 30; // Scale factor
    const margin = 20; // Margin between spaces
    const canvasWidth = (spaceWidth + margin) * numSpaces - margin;
    const canvasHeight = spaceLength + margin * 2;

    // Set canvas dimensions
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;

    // Fill background color
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw parking spaces
    ctx.fillStyle = '#CCCCCC';
    for (let i = 0; i < numSpaces; i++) {
      const x = (spaceWidth + margin) * i;
      const y = margin;
      ctx.fillRect(x, y, spaceWidth, spaceLength);
    }
  }
</script>

<Canvas
  {ctx}
  {width}
  {length}
  
  style="border: 2px solid #ccc;"
/>

<style>
  canvas {
    display: block;
  }
</style>
