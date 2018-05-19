const PPR = (function () {

  const cells = {};
  const width = 500;
  const defaultColor = '#EEEEEE';
  // const cellDensity = 29;
  let cellRows = 50;
  let cellDensity = 114;
  let cellSize = width / cellRows;
  
  let canvas;
  let currNum = 1;
  let totalPrimes = 0;
  let y = 0;
  let x = 0;

  var isPrime = function(n) {
    for (let i = 2, s = Math.sqrt(n); i <= s; i++) {
      if (n % i === 0) {
      	return false;
      }
    }
    return n !== 1;
  }

  var countCellPrimes = function(currNum, x, y) {
    let cellStart = currNum + x;
    let cellCurr = +cellStart;
    let cellPrimes = 0;
    let cell = [cellStart];
    let details = [];
    for (let i = 0; i < cellDensity; i++) {
	  details.push([x, y, cellCurr, isPrime(cellCurr)]);
	  if (isPrime(cellCurr)) {
        ++cellPrimes
      }
      cellCurr += +y;
    }
    let cellRatio = cellPrimes / cellDensity;
    cell.push(cellCurr);
    cell.push(cellPrimes);
    cell.push(cellRatio);
    cell.push(details);
    totalPrimes += cellPrimes;
    cells[x + '-' + y] = cell;
    return cellRatio;
  }

  var showCellDetails = function(e) {
  	const cellX = e.target.attributes.cellx.value;
  	const cellY = e.target.attributes.celly.value;
  	const currNum = e.target.attributes.currnum.value;
  	// const counts = countCellPrimes(currNum, cellX, cellY, true)
  	console.log(this, e, cells[cellX + '-' + cellY]);
  	const details = cells[cellX + '-' + cellY];
  	cellDetails = document.getElementById('cellDetails');
  	cellDetails.innerHTML = '<pre>' +
  		'X: ' + details[0] + '\n' + 
  		'Y: ' + details[1] + '\n' + 
  		'Prime Count: ' + details[2] + '\n' + 
  		'Prime Density: ' + details[3] + '\n' +
  		'\n' +
  		'Is Prime?\n' +
  		details[4].reduce((a, e) => { a += e[2] + ': ' + e[3] + '\n'; return a; }, '') +
  		'</pre>'; 
  };

  var drawRow = function() {
    for (x = 0; x < y; x++) {
      const xPos = (width / 2) + (cellSize * x) - (cellSize * y) / 2;
      const yPos = ((0.89 * cellSize) * y);
      let packPrimePercent = countCellPrimes(currNum, x, y);
      let dotColor = packPrimePercent > 0 ? 'rgba(' + (255 - Math.ceil(packPrimePercent * 512)) + ', 127, 127, 1)' : defaultColor;
      let cell = svg.circle(cellSize)
      	.fill(dotColor)
      	.move(xPos, yPos)
      	.attr('cellx', x)
      	.attr('celly', y)
      	.attr('currnum', currNum);

      cell.click(showCellDetails);
      cell.mouseover(function() {
      	this.stroke({ color: '#000', opacity: 0.5, width: 2 });
      });
      cell.mouseout(function() {
      	this.stroke({ color: '#000', opacity: 0, width: 0 });
      });

    }
    currNum += cellDensity * y;
    y++;
    if (y < cellRows) {
      setTimeout(drawRow, 10);
    } else {
      console.log('Cells:', cells);
      console.log(currNum, totalPrimes);
      // generateImage();
    }
  }

  var generate = function() {
  	cellRows = document.querySelector('#cellParams input[name=cellRows]').value;
  	cellDensity = document.querySelector('#cellParams input[name=cellDensity]').value;
  	cellSize = width / cellRows;
    console.log('Generate!');
	svg = SVG('svgCells').size(1000, 1000);
	svg.clear();
  	currNum = 1;
  	totalPrimes = 0;
  	y = 0;
  	x = 0;
	drawRow();
  }
  
  var generateImage = function() {
	// var dataURL = canvas.toDataURL();
 //    let canvasLink = document.getElementById('canvasLink');
 //    document.getElementById('canvasImg').src = dataURL;
 //    canvasLink.href = dataURL;
 //    canvasLink.download = 'PPR-' + cellDensity + '-' + cellRows + '.png';
  }


  return {
    generate: generate,
    generateImage: generateImage
  };

})();

// PPR.generate();