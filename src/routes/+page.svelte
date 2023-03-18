<script>
    import { onMount, beforeUpdate } from 'svelte';
    import { Canvas, Layer } from 'svelte-canvas';
    import Header from '../libs/Header.svelte';
    import { drawParkingSpaces } from '../utils/drawParkingSpaces';
    import { calculateSpaces } from '../utils/parkingHelpers';
    import { jsPDF } from 'jspdf';
    import html2canvas from 'html2canvas';
    import panzoom from 'panzoom';

    let canvasElement;
    let panzoomInstance;

    
    let width = '';
    let length = '';
    let totalSpaces = '';
    let errorMsg = '';
    let widthUnit = 'meters';
    let lengthUnit = 'meters';
    let vehicleType = 'standard';
    let accessibleSpaces = '';
    let accessibleSpacesPercentage = '';
    let orientation = 'parallel';
    let levels = 1;

    let ramps = 'yes';
    let elevators = 'yes';
    let staircases = 'yes';

    const vehicleSize = {
        compact: { width: 2.4, length: 4.8 },
        standard: { width: 2.75, length: 5.4 },
        oversized: { width: 3.0, length: 6.0 },
    };

let canvasWidth = 600;
let canvasHeight = 400;

function setCanvasSize() {
  // You can replace 'window.innerWidth' and 'window.innerHeight' with the dimensions of a specific container if needed
  canvasWidth = window.innerWidth * 0.8;
  canvasHeight = window.innerHeight * 0.8;
}


const carSize = vehicleSize.standard.length;
const doorSpace = 1; // Space needed to open car doors in meters
const drivingSpace = 3; // Space needed for cars to drive in and out in meters


  const parkingOrientations = {
    parallel: 1,
    perpendicular: 2,
    angled: 1.5,
  };

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

// Export the parking layout as an image (PNG)
async function exportAsImage() {
  const canvas = document.querySelector('canvas');
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'parking-layout.png';
  link.click();
}

// Export the parking layout as a PDF
async function exportAsPDF() {
  const canvas = document.querySelector('canvas');
  const imgData = await new Promise((resolve) => {
    html2canvas(canvas).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    });
  });

  const pdf = new jsPDF('landscape');
  pdf.addImage(imgData, 'PNG', 10, 10, 280, 190);
  pdf.save('parking-layout.pdf');
}



  function handleCalculateSpaces() {

  const result = calculateSpaces(
    parseFloat(width),
    parseFloat(length),
    vehicleType,
    parseFloat(accessibleSpacesPercentage),
    parseInt(levels),
    orientation,
    parkingOrientations,
    vehicleSize,
  );

  console.log('Result:', result);

  totalSpaces = result.totalSpaces;
  errorMsg = result.errorMsg;
  accessibleSpaces = result.accessibleSpaces;
}


  let render = ({ context: ctx, width, height }) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  if (totalSpaces !== '') {
    const parkingArea = {
      width: widthUnit === 'meters' ? parseFloat(width) : parseFloat(width) * 0.3048,
      length: lengthUnit === 'meters' ? parseFloat(length) : parseFloat(length) * 0.3048,
      widthScaleFactor: width / parseFloat(width),
      heightScaleFactor: height / parseFloat(length),
    };

    const result = {
      totalSpaces,
      accessibleSpaces,
    };

    // Add orientationConfig as an argument here
    drawParkingSpaces(ctx, parkingArea, result.totalSpaces, result.accessibleSpaces, vehicleType, orientation, vehicleSize, width, height, orientationConfig);
  }
};


let canvasContainer;

 

onMount(() => {
  if (canvasContainer) {
   panzoomInstance = panzoom(canvasContainer, {
      maxZoom: 4,
      minZoom: 0.5,
      zoomSpeed: 0.065,
      smoothScroll: false,
      filterKey: function () {
        return true;
      },
    });
  }
  setCanvasSize();
});


beforeUpdate(() => {
  setCanvasSize();
});

function zoomIn() {
  if (panzoomInstance) {
    panzoomInstance.zoomIn();
  }
}

function zoomOut() {
  if (panzoomInstance) {
    panzoomInstance.zoomOut();
  }
}

function resetZoom() {
  if (panzoomInstance) {
    panzoomInstance.zoomAbs(0, 0, 1);
  }
}


if (typeof window !== 'undefined') {
  window.addEventListener('resize', setCanvasSize);
}

</script>
<Header title="Park Space Calculator" />
<div class="container">
  <form>
    <h2>General Information</h2>
    <div class="panel">
      <label for="unit">Unit:</label>
      <div class="unit-options">
        <input type="radio" id="meters" name="unit" value="meters" bind:group="{widthUnit}" checked>
        <label for="meters">Meters</label>
        <input type="radio" id="feet" name="unit" value="feet" bind:group="{widthUnit}">
        <label for="feet">Feet</label>
      </div>
      
      <label for="levels">Number of Levels: {levels} </label> 
      <div class="range-slider">
        <input type="range" id="levels" bind:value="{levels}" min="1" max="40" step="1" required />
        
      </div>

      <label for="ramps">Ramps:</label>
      <div class="ramps-options">
        
        <input type="radio" id="ramps-yes" name="ramps" value="yes" bind:group="{ramps}" checked>
        <label for="ramps-yes">Yes</label>
        <input type="radio" id="ramps-no" name="ramps" value="no" bind:group="{ramps}">
        <label for="ramps-no">No</label>
      </div>

      <label for="elevators">Elevators:</label>
      <div class="elevators-options">
        <input type="radio" id="elevators-yes" name="elevators" value="yes" bind:group="{elevators}" checked>
        <label for="elevators-yes">Yes</label>
        <input type="radio" id="elevators-no" name="elevators" value="no" bind:group="{elevators}">
        <label for="elevators-no">No</label>
      </div>

      <label for="staircases">Staircases:</label>
      <div class="staircases-options">
        <input type="radio" id="staircases-yes" name="staircases" value="yes" bind:group="{staircases}" checked>
        <label for="staircases-yes">Yes</label>
        <input type="radio" id="staircases-no" name="staircases" value="no" bind:group="{staircases}">
        <label for="staircases-no">No</label>
      </div>
    </div>

    <h2>Parking Space Information</h2>
    <div class="panel">
      <label for="vehicleType">Vehicle Type:</label>
      <select id="vehicleType" bind:value="{vehicleType}">
        <option value="compact">Compact</option>
        <option value="standard">Standard</option>
        <option value="oversized">Oversized</option>
      </select>

      <label for="orientation">Parking Orientation:</label>
      <select id="orientation" bind:value="{orientation}">
        <option value="parallel">Parallel</option>
        <option value="perpendicular">Perpendicular</option>
        <option value="angled">Angled</option>
      </select>

      <label for="accessibleSpacesPercentage">Accessible Parking Spaces: {accessibleSpacesPercentage} %:</label>
      <input type="range" id="accessibleSpacesPercentage" bind:value="{accessibleSpacesPercentage}" min="0" max="100" step="1" required />
      <label for="width">Width:</label>
      <input type="number" id="width" bind:value="{width}" min="0" step="0.01" required />

      <label for="length">Length:</label>
      <input type="number" id="length" bind:value="{length}" min="0" step="0.01" required />
    </div>

    <button on:click={handleCalculateSpaces}>Calculate</button>

    {#if errorMsg !== ''}
      <p class="error">{errorMsg}</p>
    {/if}
  </form>
</div>


{#if totalSpaces !== ''}
  <div class="result">
    <h2>Total Parking Spaces: {totalSpaces}</h2>
    <button on:click={exportAsImage}>Export as Image</button>
    <button on:click={exportAsPDF}>Export as PDF</button>
    <button on:click={zoomIn}>Zoom In</button>
    <button on:click={zoomOut}>Zoom Out</button>
    <button on:click={resetZoom}>Reset Zoom</button>
    <div bind:this="{canvasContainer}">
      <Canvas bind:width="{canvasWidth}" bind:height="{canvasHeight}" bind:this="{canvasElement}">
        <Layer {render} />
      </Canvas>
    </div>
  </div>
{/if}


<style>
  @import '../utils/styles.css';
</style>