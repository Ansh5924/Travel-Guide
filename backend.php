<?php
$storage_file = "messages.txt";
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name    = trim($_POST["name"] ?? "");
    $email   = trim($_POST["email"] ?? "");
    $message = trim($_POST["message"] ?? "");

    if ($name && $email && $message) {

        $entry  = "Name: $name\n";
        $entry .= "Email: $email\n";
        $entry .= "Message: $message\n";
        $entry .= "Date: " . date("d-m-Y H:i:s") . "\n";
        $entry .= "--------------------------\n";

        file_put_contents($storage_file, $entry, FILE_APPEND);

        echo "Message submitted successfully!";
    } else {
        echo "All fields are required!";
    }
}
if (isset($_GET["view"])) {

    if (file_exists($storage_file)) {
        echo "<pre>";
        echo htmlspecialchars(file_get_contents($storage_file));
        echo "</pre>";
    } else {
        echo "No messages found.";
    }
}

?>
