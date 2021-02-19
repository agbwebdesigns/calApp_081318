<?php 
	
	header('Content-type: application/json');

	$json= file_get_contents('php://input');    //this gets the json file sent from query.js and saves it into the $json variable
	$json_decoded= json_decode($json, true);    //this decodes the json to an array and saves the result in the $json_decoded variable
	$json_encoded= json_encode($json_decoded);
	echo $json_encoded;
	

	$json_array= [
		"month" => 10,
		"startDay" => 3,
	];

	//echo array_shift($json_array);

	if(isset($_POST['data']))  {
		echo "yes";
		//echo $currentMonth;
		//echo $startDay;
	}

	//echo json_encode($jsonInfo);


?>