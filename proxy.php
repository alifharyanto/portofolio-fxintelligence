<?php
// proxy.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = "https://api.freetts.com/speak";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>
