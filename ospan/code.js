//**********************GLOBALS*********************

var currentMode = "id"; //Tells you which screen you should see
var currentRecallNumber = 1; //Goes into boxes in Recall mode
var currentSetSize = 0; //Number of questions in current set
var currentSetQuestion = 0; //Which question in the set they are currently on
var letterArray = Array("F","H","J","K","L","N","P","Q","R","S","T","Y"); //Permanent list of available letters
var currentLetterArray = letterArray; //Temporary list of available letters
var possibleSetSizes = Array(3,4,5,6,7,3,4,5,6,7,3,4,5,6,7); //Available set sizes (3 of each)
var equationList = Array("1/1","2/1","2/2","3/1","3/3","4/1","4/2","4/4","5/1","5/5","6/1","6/2","6/3","6/6","7/1","7/7","8/1","8/2","8/4","8/8","9/1","9/3","9/9","1*2","1*3","2*2","1*4","1*5","3*2","2*3","1*6","1*7","4*2","2*4","1*8","3*3","1*9","5*2","2*5","6*2","4*3","3*4","2*6","7*2","2*7","5*3","3*5","8*2");
//"4*4","2*8","9*2","6*3","3*6","2*9","5*4","4*5","7*3","3*7","8*3","6*4","4*6","3*8","5*5","9*3","3*9","7*4","4*7","6*5","5*6","8*4","4*8","7*5","5*7","9*4","6*6","4*9","8*5","5*8","7*6","6*7","9*5","5*9","8*6","6*8","7*7","9*6","6*9","8*7","7*8","9*7","7*9","8*8","9*8","8*9","9*9")
var permanentEquationList = equationList; //Temporary list of equations
var equationAdditionMax = 9
var hideProblemScreenTime = 8000; //Default, for testing purposes
var problemScreenStartTime = null;
var answerScreenStartTime = null;
var recallClickStartTime = null;
var testingMode = "letter"; //letter,math,both,normal
var clickCameFromButton = false;

//TRACKING
var theEquationTracker = Array();
var shownEquationAnswerTracker = Array();
var correctEquationAnswerTracker = Array();
var studentEquationAnswerTracker = Array();
var studentEquationAnswerCorrectTracker = Array();
var shownEquationLetterTracker = Array();
var letterAnswersTracker = Array(); //Holds the letters user clicks on in recall screen
var timeToAnswerScreenTracker = Array();
var timeToLetterScreenTracker = Array();
var timeOfRecallClicksTracker = Array();
var allAnswers = Array(); //Master answer list. Holds all set answers
var percentageNumeratorTracker = null;
var percentageDenomenatorTracker = null;
var globalCorrectLetterTracker = null;
var globalTotalLetterTracker = null;

//**************************************************






//********************PRACTICE FUNCTIONS**************************

//GLOBALS
var practiceEquationArray = Array("(1*2) + 1","(1/1) - 1","(7*3) - 3","(4*3) + 4","(3/3) + 2","(2*6) - 4","(8*9) - 8","(4*5) - 5","(4*2) + 6","(4/4) + 7","(8*2) - 8","(2*9) - 9","(8/2) + 9","(3*8) - 1","(6/3) + 1","(9/3) -2");
var practiceEquationAnswerArray = Array(3,2,18,16,1,6,64,11,14,12,2,9,7,23,3,7);
var practicePossibleLetterSetSizes = Array(2,2,3,3); //Available set sizes (3 of each)
var practiceLettersShown = 0;
var practiceLetterCurrentSetSize = 0;
var practiceEquationShown = 0;
var practiceMathStartTime = null;
var practiceMathTimeTracker = Array();
var practicePossibleSetSizes = Array(2,2);


function loadLetterPractice()
{
//If all sets have been displayed, go onto math instructions
if(practicePossibleLetterSetSizes.length == 0){testingMode="math"; doChangeMode("practiceMathInstructions1"); return false;}

practiceLetterCurrentSetSize = practicePossibleLetterSetSizes[0];
practicePossibleLetterSetSizes = deleteFromArray(practicePossibleLetterSetSizes,0); //Remove the item from the array
clearRecallScreen(); //Clear out recall screen
shownEquationLetterTracker = Array(); //Clear tracking arrays
letterAnswersTracker = Array();
moveToPracticeLetterScreen();
}



function moveToPracticeLetterScreen()
{
	if(practiceLettersShown < practiceLetterCurrentSetSize)
	{
	var theCurrentLetter = getCurrentLetter();
	practiceLetterDiv.innerText = theCurrentLetter;
	shownEquationLetterTracker[shownEquationLetterTracker.length] = theCurrentLetter;
	practiceLettersShown++;
	doChangeMode("practiceLetter");
	setTimeout("practiceClearLetterScreen()",800);
	}
	else
	{
	practiceLettersShown = 0;
	doChangeMode("recall");
	}
}



function practiceClearLetterScreen()
{
doChangeMode("blank");
setTimeout("moveToPracticeLetterScreen()",500);
}


function moveToMathPracticeScreen()
{
	//If all sets have been displayed, go onto math instructions
	practiceEquationFeedbackDiv.innerText = ""; //Clear out math practice feedback

	if(practiceEquationShown >= practiceEquationArray.length)
	{
	hideProblemScreenTime = computeMathAnswerTime(); //Set math answer time
	doChangeMode("practiceAllInstructions1");
	return false;
	}

	var theCurrentEquation = practiceEquationArray[practiceEquationShown];
	equationDiv.innerText = theCurrentEquation;
	doChangeMode("problem");
	practiceMathStartTime = new Date();
}



function practiceMathShowAnswer()
{
var theDelta = new Date() - practiceMathStartTime;
practiceMathTimeTracker[practiceMathTimeTracker.length] = formatTime(theDelta);
var theShownAnswer = practiceEquationAnswerArray[practiceEquationShown];
equationAnswerDiv.innerText = theShownAnswer;
doChangeMode("answer");
}


function practiceMathShowFeedback(trueOrfalse)
{
var theShownAnswer = practiceEquationAnswerArray[practiceEquationShown];
var theCurrentEquation = practiceEquationArray[practiceEquationShown];
practiceEquationShown++;
var theCorrectAnswer = eval(theCurrentEquation);
var isCorrect = "false";
		if(theShownAnswer == theCorrectAnswer)
		{
		isCorrect = "true";
		}

var theFeedback = "Incorrect";
		if(trueOrfalse == isCorrect)
		{
		theFeedback = "Correct";
		}
practiceEquationFeedbackDiv.innerText = theFeedback;
setTimeout("moveToMathPracticeScreen()",2000);
}


function computeMathAnswerTime()
{
var theSum = 0;
var theItems = practiceMathTimeTracker.length;

	for(var i=0; i<theItems; i++)
	{
	theSum += (practiceMathTimeTracker[i] * 1);
	}

var theAverage = theSum / theItems;
theSum = 0;

	for (var i=0; i<theItems; i++)
	{
	var n = practiceMathTimeTracker[i];
	theSum += Math.pow((n - theAverage),2);
	}

var stndrDeviation = Math.sqrt(theSum / (theItems - 1));
var finalTime = theAverage + (stndrDeviation * 2.5);
finalTime = Math.round(finalTime * 10000) /10000;
finalTime = finalTime * 1000;
return finalTime;
}




function practiceRealInitializeNewSet()
{
	if(practicePossibleSetSizes.length != 0) //Still practice sets to complete
	{
	testingMode = "both";
	currentSetSize = practicePossibleSetSizes[0];
	practicePossibleSetSizes = deleteFromArray(practicePossibleSetSizes,0); //Remove the item from the array
	currentLetterArray = letterArray; //Refill array

	//Clear arrays that track equations/answers shown/given
	theEquationTracker = Array();
	shownEquationAnswerTracker = Array();
	correctEquationAnswerTracker = Array();
	studentEquationAnswerTracker = Array();
	studentEquationAnswerCorrectTracker = Array();
	shownEquationLetterTracker = Array();
	letterAnswersTracker = Array();
	timeToAnswerScreenTracker = Array();
	timeToLetterScreenTracker = Array();
	timeOfRecallClicksTracker = Array();
	moveToProblemScreen();
	clearRecallScreen(); //Clear out recall screen
	}
	else
	{
	doChangeMode("realInstructions1");
	//Clear math percentage trackers
	percentageNumeratorTracker = 0;
	percentageDenomenatorTracker = 0;
	globalCorrectLetterTracker = 0;
	globalTotalLetterTracker = 0;
	}
}


//********************PRACTICE FUNCTIONS**************************








//***********************DO ID CHECK******************************
function doIDCheck()
{
	var testNumberOfSubjects = 180;
	var tempidcode = document.form2.idcode.value.toUpperCase();
	var tempSubCode = tempidcode.substr(1);
	var tempWhichLetter = tempidcode.substr(0,1);

	if(tempWhichLetter != "D" && tempWhichLetter != "E" && tempWhichLetter != "P")
	{
	alert("Invalid code letter. Please try again.");
	document.form2.idcode.focus();
	return false;
	}
	else
	{
		if(((tempSubCode == "" || isNaN(tempSubCode) || tempSubCode > testNumberOfSubjects || tempSubCode < 1)))
		{
		alert("Invalid code number. Please try again.");
		document.form2.idcode.focus();
		return false;
		}
	}
doChangeMode("practiceLetterInstructions1");
}
//***********************DO ID CHECK******************************








//*********************NORMAL FUNCTIONS***************************

function initializeNewSet()
{
	if(possibleSetSizes.length != 0) //Still sets to complete
	{
	testingMode = "normal";
	var aRandNum = getRandomNumber(possibleSetSizes.length -1);
	currentSetSize = possibleSetSizes[aRandNum];
	possibleSetSizes = deleteFromArray(possibleSetSizes,aRandNum); //Remove the item from the array
	currentLetterArray = letterArray; //Refill array
	equationList = permanentEquationList; //Refill array

	//Clear arrays that track equations/answers shown/given
	theEquationTracker = Array();
	shownEquationAnswerTracker = Array();
	correctEquationAnswerTracker = Array();
	studentEquationAnswerTracker = Array();
	studentEquationAnswerCorrectTracker = Array();
	shownEquationLetterTracker = Array();
	letterAnswersTracker = Array();
	timeToAnswerScreenTracker = Array();
	timeToLetterScreenTracker = Array();
	timeOfRecallClicksTracker = Array();
	moveToProblemScreen();
	clearRecallScreen(); //Clear out recall screen
	}
	else
	{
	var endGameString = "";
		for(var i=0; i<allAnswers.length; i++)
		{
		endGameString += "^" + allAnswers[i].join("|");
		}
	document.form1.endGameField.value = endGameString;
	document.form1.id.value = document.form2.idcode.value;
	document.form1.mathTime.value = formatTime(hideProblemScreenTime);
	document.form1.mathPercentage.value = getGlobalMathPercentage();
	document.form1.lettersCorrect.value = globalCorrectLetterTracker;
	document.form1.totalLetters.value = globalTotalLetterTracker;
	document.form1.submit();
	doChangeMode("endGame");
	}
}



function moveToProblemScreen()
{
doEquationAssembly();
doChangeMode("problem");
problemScreenStartTime = new Date();
screenChangeTimer = setTimeout("timeOutProblemScreen()",hideProblemScreenTime);
}



function timeOutProblemScreen()
{
recordTimeToAnswerScreen();
setAnswerScreenStartTime();
studentEquationAnswerTracker[studentEquationAnswerTracker.length] = "blank";
studentEquationAnswerCorrectTracker[studentEquationAnswerCorrectTracker.length] = "incorrect";
moveToLetterScreen();
}



function doEquationAssembly()
{
var theEquation = getMathEquation();
equationDiv.innerText = theEquation[0] + " = ?";
theEquationTracker[theEquationTracker.length] = theEquation[0];
shownEquationAnswerTracker[shownEquationAnswerTracker.length] = theEquation[1];
correctEquationAnswerTracker[correctEquationAnswerTracker.length] = theEquation[2];
}



function getRandomNumber(whichArrayLength)
{
return Math.round(Math.random()*whichArrayLength);
}



function deleteFromArray(whichArray,whichItem)
{
var theNewArray = Array();
	for(var i=0; i<whichArray.length; i++)
	{
		if(i != whichItem)
		{
		theNewArray[theNewArray.length] = whichArray[i];
		}
	}
return theNewArray;
}



function changeScreensViaClick()
{
	if(currentMode == "problem")
	{
		if(!clickCameFromButton) //Used to solve problem of firing twice when button clicked
		{
			if(testingMode == "normal" || testingMode == "both")
			{
			clearTimeout(screenChangeTimer);
			equationAnswerDiv.innerText = shownEquationAnswerTracker[shownEquationAnswerTracker.length -1];
			recordTimeToAnswerScreen();
			doChangeMode("answer");
			setAnswerScreenStartTime();
			}
			else
			{
			practiceMathShowAnswer();
			}
		}
		else
		{
		clickCameFromButton = false; //Used to solve problem of firing twice when button clicked
		}
	}
	else
	{
		//switch(currentMode)
		//{
		//case "id": doIDCheck(); break;
		//case "practiceLetterInstructions1": doChangeMode("practiceLetterInstructions2"); break;
		//case "practiceLetterInstructions2": doChangeMode("practiceLetterInstructions3"); break;
		//case "practiceLetterInstructions3": loadLetterPractice(); break;
		//case "practiceMathInstructions1": doChangeMode("practiceMathInstructions2"); break;
		//case "practiceMathInstructions2": doChangeMode("practiceMathInstructions3"); break;
		//case "practiceMathInstructions3": moveToMathPracticeScreen(); break;
		//case "practiceAllInstructions1": doChangeMode("practiceAllInstructions2"); break;
		//case "practiceAllInstructions2": doChangeMode("practiceAllInstructions3"); break;
		//case "practiceAllInstructions3": practiceRealInitializeNewSet(); break;
		//case "realInstructions1": initializeNewSet(); break;
		//default: break;
		//}
	}
}




function setAnswerScreenStartTime()
{
answerScreenStartTime = new Date();
}


function recordTimeToAnswerScreen()
{
var theDelta = new Date() - problemScreenStartTime;
timeToAnswerScreenTracker[timeToAnswerScreenTracker.length] = formatTime(theDelta);
}



function recordTimeToLetterScreen()
{
var theDelta = new Date() - answerScreenStartTime;
timeToLetterScreenTracker[timeToLetterScreenTracker.length] = formatTime(theDelta);
}



function recordClicksOnRecallScreen()
{
var theDelta = new Date() - recallClickStartTime;
timeOfRecallClicksTracker[timeOfRecallClicksTracker.length] = formatTime(theDelta);
recallClickStartTime = new Date();
}



function formatTime(whatTime)
{
var secs = whatTime / 1000;
	if(secs < 10)
	{
	secs = "0" + secs; //Add zero to seconds for formatting purposes
	}
return secs;
}



function doChangeMode(whatMode)
{
var previousScreen = currentMode + "Screen";
document.getElementById(previousScreen).style.display = "none";
var whatScreen = whatMode + "Screen";
document.getElementById(whatScreen).style.display = "block";
currentMode = whatMode;
}



function checkEquationAnswer(trueOrfalse)
{
	if(testingMode == "normal" || testingMode == "both")
	{
	var answerIsTrue = "true";
		if(shownEquationAnswerTracker[shownEquationAnswerTracker.length -1] != correctEquationAnswerTracker[correctEquationAnswerTracker.length -1])
		{
		answerIsTrue = "false";
		}
	studentEquationAnswerTracker[studentEquationAnswerTracker.length] = answerIsTrue;
	var isCorrect = "incorrect";
		if(trueOrfalse == answerIsTrue)
		{
		isCorrect = "correct";
		}
	studentEquationAnswerCorrectTracker[studentEquationAnswerCorrectTracker.length] = isCorrect;
	moveToLetterScreen();
	}
	else
	{
	practiceMathShowFeedback(trueOrfalse);
	}
}



function moveToLetterScreen()
{
var theCurrentLetter = getCurrentLetter();
shownEquationLetterTracker[shownEquationLetterTracker.length] = theCurrentLetter;
letterDiv.innerText = theCurrentLetter;
recordTimeToLetterScreen();
doChangeMode("letter");
doLetterScreenTimer();
}



function getCurrentLetter()
{
var aRandNum = getRandomNumber(currentLetterArray.length -1);
var currentLetter = currentLetterArray[aRandNum];
currentLetterArray = deleteFromArray(currentLetterArray,aRandNum); //Remove the item from the array
return currentLetter;
}



function doLetterScreenTimer()
{
setTimeout("hideLetterScreen()",800);
}


function hideLetterScreen()
{
currentSetQuestion ++;
	if(currentSetQuestion == currentSetSize)
	{
	doChangeMode("recall");
	recallClickStartTime = new Date();
	currentSetQuestion = 0;
	}
	else
	{
	moveToProblemScreen();
	}
}



function getMathEquation()
{
var aRandNum = getRandomNumber(equationList.length -1); //Get random number of size of the equation array minus 1
var equationPart1 = equationList[aRandNum]; //Get first part of equation from array of equation parts
equationList = deleteFromArray(equationList,aRandNum); //Remove the item from the array
var equationPart2 = getRandomNumber(equationAdditionMax); //Get random value between 1-9 to add to first part of equation
var theOperand = "-"; //Set operand as - sign
	if(getRandomNumber(1) == 1){theOperand = "+";} //50% chance of + for operand, if so set the variable
var finalEquation = "(" + equationPart1 + ") " + theOperand + " " + equationPart2;
var theCorrectAnswer = eval(finalEquation); //Get the equation's correct answer
var theShownAnswer = theCorrectAnswer; //Set shown answer to correct answer
	if(getRandomNumber(1) == 1){theShownAnswer = theShownAnswer + getEquationWrongAnswerOffset();} //50% chance that answer should be wrong. If so, set the variable equal to right answer + offset.
var equationArray = Array(); //Initialize array to be returned by funtion
equationArray[0] = finalEquation; //Add equations as first item of array
equationArray[1] = theShownAnswer; //Add the shown answer as second item of array
equationArray[2] = theCorrectAnswer; //Add correct answer as third item of array
return equationArray;
}




function getEquationWrongAnswerOffset()
{
var aRandNum = getRandomNumber(8) + 1;
	if(getRandomNumber(1) == 1){aRandNum = -aRandNum;}
return aRandNum;
}



//**************RECALL SCREEN******************

function insertNumber(sourceDiv)
{
var theLength = letterAnswersTracker.length;
	if(theLength < 12)
	{
	whatLetter = sourceDiv.id.substring(0,1);
	letterAnswersTracker[theLength] = whatLetter; //Push new letter onto current set letter list 
	recallLetterDisplay.innerText += whatLetter + "	";
	
		//If anything but the "blank" box, then put a number in it
		if(whatLetter != "-")
		{
		sourceDiv.innerText = currentRecallNumber;
		}
	currentRecallNumber++; //Increment number even if they are clicking the blank button
	}
recordClicksOnRecallScreen();
}



function clearRecallScreen()
{
document.getElementById("Frecall").innerText = "";
document.getElementById("Hrecall").innerText = "";
document.getElementById("Jrecall").innerText = "";
document.getElementById("Krecall").innerText = "";
document.getElementById("Lrecall").innerText = "";
document.getElementById("Nrecall").innerText = "";
document.getElementById("Precall").innerText = "";
document.getElementById("Qrecall").innerText = "";
document.getElementById("Rrecall").innerText = "";
document.getElementById("Srecall").innerText = "";
document.getElementById("Trecall").innerText = "";
document.getElementById("Yrecall").innerText = "";
currentRecallNumber = 1; //Reset number
letterAnswersTracker = Array(); //Clear out array
recallLetterDisplay.innerText = ""; //Clear letter display
}



function finishRecall()
{
var letterScoreArray = getCurrentSetLetterScore(shownEquationLetterTracker,letterAnswersTracker);
var lettersCorrect = letterScoreArray[0];
var totalLetters = letterScoreArray[1];
globalCorrectLetterTracker += lettersCorrect;
globalTotalLetterTracker += totalLetters;
recallText.innerText = "You recalled " + lettersCorrect + " letters correctly out of " + totalLetters;

	if(testingMode == "both" || testingMode == "normal")
	{
	var mathScoreArray = getEquationPercentage(studentEquationAnswerCorrectTracker);
	var recallPercent = mathScoreArray[0];
	var numberOfMathErrors = mathScoreArray[1];
	recallMathText.innerText = "You made " + numberOfMathErrors + " math error(s) for this set of trials";
	recallPercentText.innerText = recallPercent;
	var sessionrecallPercent = mathScoreArray[2];

	//Add session tracker arrays to master array
	allAnswers[allAnswers.length] = theEquationTracker;
	allAnswers[allAnswers.length] = shownEquationAnswerTracker;
	allAnswers[allAnswers.length] = correctEquationAnswerTracker;
	allAnswers[allAnswers.length] = studentEquationAnswerTracker;
	allAnswers[allAnswers.length] = studentEquationAnswerCorrectTracker;
	allAnswers[allAnswers.length] = shownEquationLetterTracker;
	allAnswers[allAnswers.length] = letterAnswersTracker;
	allAnswers[allAnswers.length] = timeToAnswerScreenTracker;
	allAnswers[allAnswers.length] = timeToLetterScreenTracker;
	allAnswers[allAnswers.length] = timeOfRecallClicksTracker;
	allAnswers[allAnswers.length] = Array(lettersCorrect + " of " + totalLetters);
	allAnswers[allAnswers.length] = Array(sessionrecallPercent);
	}

doChangeMode("feedback");
//setTimeout("hideFeedbackScreen()",3500)
}


function getCurrentSetLetterScore(shownLetters,answers)
{
var theNewArray = Array();
var numCorrect = 0;

	for(var i=0; i<shownLetters.length; i++)
	{
		if(shownLetters[i] == answers[i])
		{
		numCorrect++;
		}
	}

theNewArray[0] = numCorrect;
theNewArray[1] = shownLetters.length;
return theNewArray;

}



function getEquationPercentage(whatArray)
{
var theNewArray = Array();
var correctCount = 0;
var theLength = whatArray.length;
	for(var i=0; i<theLength; i++)
	{
		if(whatArray[i] == "correct")
		{
		correctCount++;
		}
	}
percentageNumeratorTracker += correctCount;
percentageDenomenatorTracker += theLength;

var thePercent = getGlobalMathPercentage();
var numberOfMathErrors = theLength - correctCount;
var theSessionPercent = Math.round((correctCount / theLength) * 100) + "%";
theNewArray[0] = thePercent;
theNewArray[1] = numberOfMathErrors;
theNewArray[2] = theSessionPercent;
return theNewArray;
}



function getGlobalMathPercentage()
{
var x = Math.round((percentageNumeratorTracker / percentageDenomenatorTracker) * 100) + "%";
return x;
}



function hideFeedbackScreen()
{
doChangeMode("blankFeedback");
setTimeout("hideBlankFeedbackScreen()",1000);
}



function hideBlankFeedbackScreen()
{
	if(testingMode == "letter")
	{
	loadLetterPractice();
	}
	else
	{
		if(testingMode == "both")
		{
		practiceRealInitializeNewSet();
		}
		else
		{
		initializeNewSet();
		}
	}
}


//**************RECALL SCREEN******************



//*************PREVENT RIGHT CLICK*************

function checkKey()
{
	if (event.button == 2 || event.button == 3)
	{
	alert("Right clicking disabled during the test");
	return false;
	}
}

document.onmousedown=checkKey;
document.onmouseup=checkKey;

//*************PREVENT RIGHT CLICK*************