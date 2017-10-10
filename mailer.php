<?php
$input = json_decode(file_get_contents("php://input"), true);
if(!is_array($input)) $input = [];

$input['success'] = true;

echo json_encode($input);

