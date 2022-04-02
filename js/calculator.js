/* File: calculator.js */

// When web page loads, call the 2nd parameter.

window.addEventListener("load",  listenForEvents, false);

// Point HTML input fields to JavaScript variables

var inputBalance = document.getElementById("balance");
var inputRate = document.getElementById("rate");
var inputButton = document.getElementById("input-calculate");
var spanOrigBalance = document.getElementById("result-div-balance");
var spanMaxBalance = document.getElementById("result-div-best");
var spanOneRate = document.getElementById("one-rate");
var spanTwoRate = document.getElementById("two-rate");
var spanOneFee = document.getElementById("one-fee");
var spanTwoFee = document.getElementById("two-fee");
var spanSavings = document.getElementById("result-div-savings");

// Call this function when the web page fully loads.

function listenForEvents() {	
	
	//calculate()
	
	// When 'Calculate' button is clicked, call 2nd parameter.
	inputButton.addEventListener("click", calculate);
	
	//inputBalance.addEventListener("input", calculate );
	//inputRate.addEventListener("input", calculate );
}

// Calculate

function calculate() {
	
	// Get data to analyze, from input fields
	
	var balance = parseFloat( inputBalance.value ) || 0;
	var rate = parseFloat( inputRate.value ) || 0; // null, undefined, Nan

  // Check that rate is valid

	if ( rate == 0 ) {
			alert( "0 is not a valid interest rate.");
	} else {
		
		// convert entered rate into decimal
		rate = rate / 100;		
	
		// return product of parameters
		var fee = calculateFee( balance, rate );
		// 10.005 (float)

		// Save a two decimal version for do-while comparisons.
		var feeTwoDecimals = roundToSecondDecimal(fee);
		// 10.01 (string)
		
		//console.log( "0: " + balance + " x " + rate + " = " + fee );
		
		analyze(balance, rate, feeTwoDecimals);
		
	}
}

// Figure out best balance

function analyze( balance, rate, feeTwoDecimals) {
		
	// do-while variables
	var newBalance = balance;
	var newFee, newFeeTwoDecimals, savings;
	var counter = 1;	// to avoid an infinite do-while loop.
	var limit = 1000; // supports 1000.5 * 0.1%
	var calculations = [];
	
	// Add 0.01 to the balance and check if the fee goes up
	
	do {
		// Add a cent to the balance
		newBalance = addTwoFloats(newBalance, 0.01)
		//newBalance = newBalance + 0.01; // causes error
		
		// Figure out the product of parameters
		newFee = calculateFee(newBalance, rate);
		// 10.0150
		
		// save two decimal version of newFee
		newFeeTwoDecimals = roundToSecondDecimal(newFee);
		//console.log( "feeTwoDecimals: " + typeof(feeTwoDecimals) );
		
		//newFeeTwoDecimals = accounting.toFixed(newFee, 2);
		// accounting.toFixed: 10.01
		
		// we want: 10.02 (rounded to nearest second decimal)
		// but JavaScript's built-in rounding functions only
		// round to the nearest integer.
		
		troubleshoot( newBalance, rate, newFee, newFeeTwoDecimals, counter );
		
		// update the do-while loop counter
		counter++;
		
		/* break out of the loop when newFeeTwoDecimals > feeTwoDecimals 
		or when you've tried 100 times.
		*/
	} while (   (newFeeTwoDecimals == feeTwoDecimals)
					 		&& (counter < limit) )
	
	// set the max they can transfer
	var maxBalance = newBalance - .01
	
	savings = maxBalance - balance;

	// update the page
	updateResults( feeTwoDecimals, balance, maxBalance, inputRate.value, feeTwoDecimals, savings, calculations);
	
	//console.log( calculations )
}


function troubleshoot( newBal, rate, newFe, newFeeTwoDecimals, counter ) {
	console.log( counter + ": " + 
							newBal +
							" x " + rate + " = " + 
							newFeeTwoDecimals +
							" [4: " +
							newFe +
							"]"
	);
}

function addTwoFloats(one, two) {
	var temp = Math.round (one * 100) +
		 				 Math.round (two * 100);
	return temp / 100;
	
}

function roundToSecondDecimal( f ) {
	return Math.round( f * 100 ) / 100;
}

function calculateFee(b, r) {
  return b * r;
}


// Update the page's span tags after each calculation

function updateResults( feeTwoDecimals, balance, maxBalance, inputRate, maxFee, savings, calculations) {
	
	spanOrigBalance.innerHTML = accounting.formatMoney( balance )
	spanMaxBalance.innerHTML = accounting.formatMoney( maxBalance )
	// use the percentage entered in the input field. not the decimal used for calculations.
	spanOneRate.innerHTML = inputRate;
	spanTwoRate.innerHTML = inputRate;
	spanOneFee.innerHTML = feeTwoDecimals;
	spanTwoFee.innerHTML = feeTwoDecimals;
	spanSavings.innerHTML = accounting.formatMoney( savings );
	
	/*
	for ( var i = 0; i < calculations.length; i++ )
		preCalculations.innerHTML += calculations[i] + "\n"
	*/
}
