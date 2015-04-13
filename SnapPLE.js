//Snap Protocol Language Enabler

var gradingLog = {
	testCount: 0,
	qID: null,
	addTest: function(blockSpec, input, expOut) {
		this.testCount += 1;
		this["" + this.testCount] = {"blockSpec": blockSpec,"input": input, "expOut": expOut, "output": null, "feedback": null};
		return this.testCount;
	},
	deleteTest: function(testID) {
		delete this["" + testID];
	},
	finishTest: function(testID, output, feedback) {
		if (this["" + testID] !== undefined) {
			this["" + testID]["output"] = output;
			if (feedback !== undefined) {
				this["" + testID]["feedback"] = feedback;
			}
		} else {
			throw "gradingLog.finishTest: TestID is invalid.";
		}
		if (testID < this.testCount) {
			var glog = this;
			//SET TIME OUT TO ALLOW COMPLETION
			setTimeout(function() {testBlock(glog, testID+1)},1);
		} else {
			setTimeout(function() {evaluateLog()},1);
		}
		// return this["" + testID];
	},
	testFinished: function(testID) {
		var test = this["" + testID];
		return (test["output"] !== null);
	}
};


function getSprite(index) {
	try {
		var sprite = world.children[0].sprites.contents[index];
		if (sprite === undefined) {
			throw "No sprite at index: " + index;
		}
		return sprite;
	} catch(e) {
		console.log("getSprite(): " + e);
		throw e
	}
}

function getScripts(index) {
	try {
		var sprite = getSprite(index);
	} catch(e) {
		throw e
	}
	if (sprite !== undefined) {
		return sprite.scripts.children;
	} else {
		return undefined;
	}
}

function getScript(blockSpec, spriteIndex) {
	//TODO: Consider expanding to grab from additional sprites
	try {
		if (spriteIndex === undefined) {
			var scripts = getScripts(0);
		} else {
			var scripts = getScripts(spriteIndex);
		}
	} catch(e) {
		console.log("getScript(): Attempting to return spriteIndex: 0");
		try {
			var scripts = getScripts(0);
		} catch(e) {
			console.log("No Sprites: Add new Sprite to continue.")

		}
	}
	var validScripts = scripts.filter(function (morph) {
		if (morph.selector) {
			//TODO: consider adding selector type check (morph.selector === "evaluateCustomBlock")
			return (morph.blockSpec === blockSpec);
		}
	});
	return validScripts[0]

}

function setValues(block, values) {
	var valIndex = 0;
	for (var morph of block.children) {
		if (morph.constructor.name === "InputSlotMorph") {
			morph.setContents(values[valIndex]);
			valIndex += 1;
		}
	}
	if (valIndex + 1 !== values.length) {
		//TODO: THROW ERROR FOR INVALID BLOCK DEFINITION
	}
}

function evalReporter(block, outputLog, testID) {
	var stage = world.children[0].stage;
	var proc = stage.threads.startProcess(block, 
					stage.isThreadSafe,
					false,
					function() {
						outputLog.finishTest(testID, readValue(proc));
					});
	return proc
}

//FUNCTION NEEDS TO FIND THE PROCESS AND CHECK IF IT HAS COMPLETED
function readValue(proc) {
	return proc.homeContext.inputs[0];
}
//Old VERSION
// function testBlock(outputLog, blockSpec, input, expOut) {
// 	var block = getScript(blockSpec);
// 	setValues(block, input);
// 	var testID = outputLog.addTest(blockSpec, input, expOut)
// 	var proc = evalReporter(block, outputLog, testID);
// 	return testID
// }

function testBlock(outputLog, testID) {
	if (outputLog[testID] === undefined) {
		throw "testBlock: Output Log Contains no test with ID: " + testID;
	}
	var test = outputLog[testID];
	var block = getScript(test["blockSpec"]);
	setValues(block, test["input"]);
	var proc = evalReporter(block, outputLog, testID);
	return testID; 
}

//TODO: TEST THIS BLOCK
function multiTestBlock(outputLog, blockSpec, inputs, expOuts) {

	if (inputs.length !== expOuts.length) {
		return null;
	}

	var testIDs = new Array(inputs.length);
	if (getScript(blockSpec) === undefined) {

	}
	for (var i=0;i<inputs.length; i++) {
		testIDs[i] = outputLog.addTest(blockSpec, inputs[i], expOuts[i]);
		// testIDs[i] = testBlock(outputLog, blockSpec, inputs[i], expOuts[i])
	}
	testBlock(outputLog, testIDs[0]);
	return testIDs
}

/*
Evaluate the gradingLog, update 
*/
function evaluateLog(testIDs) {
	if (testIDs === undefined) {
		testIDs = [];
		for (var i = 1; i <= gradingLog.testCount; i++) {
		   testIDs.push(i);
		}
	}
	for (var id of testIDs) {
		if (gradingLog[id]["output"] === gradingLog[id]["expOut"]) {
			gradingLog[id]["feedback"] = "Correct!";
		} else {
			gradingLog[id]["feedback"] = "Incorrect Answer; Expected: " + 
				gradingLog[id]["expOut"] + " , Got: " + gradingLog[id]["output"];
		}
	}
	return printLog();
}

function printLog() {
	for (var i = 1; i<=gradingLog.testCount;i++) {
		var testString = "[Test " + i + "]";
		testString += " Block: '" + gradingLog[i]["blockSpec"] + "'";
		testString += " Input: " + gradingLog[i]["input"];
		testString += " Expected Ans: " + gradingLog[i]["expOut"];
		testString += " Got: " + gradingLog[i]["output"];
		testString += " Feedback: " + gradingLog[i]["feedback"];
		console.log(testString);
	}
}
