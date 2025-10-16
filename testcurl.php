<?php
if(function_exists('curl_version')) {
    $info = curl_version();
    echo "cURL aktif! SSL: " . (($info['features'] & CURL_VERSION_SSL) ? "Ya" : "Tidak");
} else {
    echo "cURL tidak aktif!";
}
