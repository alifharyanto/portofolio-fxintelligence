<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$input = json_decode(file_get_contents('php://input'), true);
$type = $input['type'] ?? '';
$question = trim($input['question'] ?? '');

if ($type === 'ai') {
    $api_key = '#fx294421231intelligenceAPI.0012112708#';
    $postData = json_encode([
        'question' => $question,
        'api_key' => $api_key
    ]);

    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => $postData,
            'timeout' => 30
        ]
    ];

    $context  = stream_context_create($options);
    $response = @file_get_contents('http://127.0.0.1:8000/fxintelligence-1.0-lite', false, $context);

    if ($response === FALSE) {
        http_response_code(500);
        echo json_encode(['answer' => '❌ Tidak bisa terhubung ke server Python']);
        exit;
    }

    header('Content-Type: application/json');
    echo $response;
    exit;
}
else {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Request tidak valid']);
    exit;
}

?>
