<?
/*
Edited by Scott Buchanan on 12-27-08
Things Changed -
- Made file functions into comments to become unused
- Added two vars and mail function

For further help on changes, please contact my
email.
scott@inthebrilliantblue.com
*/

$mathPercentage = $_POST["mathPercentage"];
$totalLetters = $_POST["totalLetters"];
$lettersCorrect = $_POST["lettersCorrect"];
$mathTime = $_POST["mathTime"];
$endGameField = $_POST["endGameField"];
$id = $_POST["id"];


if($endGameField)
{
$rawString = explode("^",$endGameField);
$label = "";
$cnt = 1;
$masterCnt = 1;
$recallTimesArray = Array();

	for($i=1; $i<count($rawString); $i++) //Scip first line because it is blank
	{		
		if($cnt == 13)
		{
		$cnt = 1;
		$masterCnt ++;
		}

		$setName = "Trial ";
		$labelCnt = $masterCnt;
		if($masterCnt < 3) // Mark practice data separately from real data 
		{
		$setName = "Practice set ";
		}
		else
		{
		$labelCnt = $masterCnt - 2;
		}
		
		if($cnt == 1)
		{
		$allstring .= "\n****************** $setName $labelCnt ******************\n";
		}

		switch($cnt)
		{
		case 1:$label = "Equations: "; break;
		case 2:$label = "Shown Answers: "; break;
		case 3:$label = "Correct Answers: "; break;
		case 4:$label = "Student Answers: "; break;
		case 5:$label = "Student Was Correct: "; break;
		case 6:$label = "Letters Shown: "; break;
		case 7:$label = "Students Letters: "; break;
		case 8:$label = "Time on Problem screen: "; break;
		case 9:$label = "Time on Answer Screen: "; break;
		case 10:$label = "Times on Recall screen: "; $recallTimesArray = getRecallTimes($recallTimesArray,$rawString[$i]); break;
		case 11:$label = "Session Letters Correct: "; break;
		case 12:$label = "Session Math Percentage: "; break;
		default: break;
		}
	$allstring .= $label . $rawString[$i] . "\n";
	$cnt ++;
	}


$headstring = "******************OVERALL DATA******************\n";
$headstring .= "Test Date: " . date("m/d/Y") . "\n";
$headstring .= "Test Time: " . date("h:i:s") . "\n";
$headstring .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
$headstring .= "Final math percentage: " . $mathPercentage . "\n";
$headstring .= "Total problems shown: " . $totalLetters . "\n";
$headstring .= "Total letters correct: " . $lettersCorrect . "\n";
$headstring .= "Average time given: " . $mathTime . "\n";
$headstring .= "Average Recall Screen Time: " .getAverage($recallTimesArray) . "\n";
$headstring .= "Student ID: " . $id . "\n";

$allstring = $headstring . $allstring;

$subject = "OSPAN " . $id ;
$from = "erin@olemiss.edu";
mail("buchananlab@gmail.com", $subject, $allstring, $from);

/* Original Program writes to file, mail function sends
$filename = "../scores/" . $id . "-OSPAN.txt";
$handle = fopen($filename, 'w+');
fwrite($handle, $allstring);
fclose($handle);
*/
}






function getAverage($theArray)
{
$theCount = count($theArray);
$num = 0;
	for($i=0; $i<$theCount; $i++)
	{
	$num = $num + $theArray[$i];
	}
$y = round($num / $theCount,3);
return $y;
}




function getRecallTimes($theArray,$theString)
{
$stringArray = explode("-", $theString);
	for($i=0; $i<count($stringArray); $i++)
	{
	array_push($theArray,$stringArray[$i]);
	}
return $theArray;
}







?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
<HEAD>
<TITLE> OSPAN </TITLE>
<META NAME="Generator" CONTENT="EditPlus">
<META NAME="Author" CONTENT="">
<META NAME="Keywords" CONTENT="">
<META NAME="Description" CONTENT="">
</HEAD>

<BODY>
<div style="margin-top:50px; cursor:default;">
<table width="80%" border="4" cellspacing="0" cellpadding="8" align="center" bordercolor="#000000" height="80%">
  <tr>
    <td valign="middle" bgcolor="#CCCCCC" align="center">
	    <div style="font: 22pt verdana; font-weight:bold;">The test is over.<br>
          <br>
          Please wait for further instructions.<br>
          <br>
          <br>
          <a href="javascript:window.close()">Close this window</a>.</div>
	</td>
  </tr>
</table>
</div>
</BODY>
</HTML>
