<?

if($confirmdelete)
{
	$confirmdelete = "scores/$confirmdelete";
	if(file_exists($confirmdelete))
	unlink($confirmdelete);
}

if($deleteit)
{
	print "Are you sure you want to delete $deleteit: &nbsp; <a href='$PHP_SELF?viewScore=$viewScore&confirmdelete=$deleteit'><font color='red'><b>Yes</b></font></a> &nbsp; &nbsp; <a href='$PHP_SELF?viewScore=$viewScore'><b>No</b></a><br><br>";
}

$bgcolor = "#000000";

if($viewScore) //Admin looking at scores
{
	$cnt = 1;
	$handle = @opendir("scores") or die("Unable to open this directory");
	while (false!==($file = readdir($handle))) 
	{
		$cellcolor = "#ffffff";
		$tempnum = $cnt/2;
		if (!is_float($tempnum))
		{
		$cellcolor = "#ffffcc";
		}
		
		if ($file != "." && $file != "..") 
		{
		$output .= "<tr bgcolor='$cellcolor'>";
		$output .= "<td><a href='scores/$file'><b>". substr($file,0,strlen($file)-4) . "</b></a></td>";
		$output .= "<td align='right'><a href='" . $PHP_SELF . "?deleteit=" . $file . "&viewScore=1'>Clear File</a></td>";
		$output .= "</tr>";
		$cnt = $cnt + 1;
		}
	}   
	closedir($handle);

$bgcolor = "#ffffff";
}



?>

<html>
<head>
<title>OSPAN SCORES</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<style>
body, table, td
{
font-family: "Verdana, Arial";
font-size: "9pt";
}
</style>
</head>

<body bgcolor="<?=$bgcolor;?>" text="#000000">
<b><a href="index.html">Back to home page</a></b><br>
<br>
<br>
<table cellspacing="0" cellpadding="3" width="348">
  <tr bgcolor='#cccccc'> 
    <td width="202"><b>Student ID</b></td>
    <td width="132" align="right"><b>------</b></td>
  <tr> 
  <tr> 
    <td width="202">&nbsp;</td>
    <td width="132" align="right"></td>
  <tr> 
    <?=$output;?>
</table>


</body>
</html>