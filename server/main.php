<?php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Connect to the database
$servername = getenv('DB_HOST');
$username   = getenv('DB_USER');
$password   = getenv('DB_PASSWORD');
$dbname     = getenv('DB_NAME');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle preflight requests
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Simple routing via ?action=
$action = $_GET['action'] ?? '';

// Helper: read JSON body (falls back to $_POST for form submissions)
function getRequestData(): array {
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);
    if (is_array($json)) {
        return $json;
    }
    return $_POST;
}

// Helper: send JSON response and exit
function respond(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// ---------------------------------------------
// POST /?action=order
// Creates an order, and optionally a newsletter
// signup if "newsletter" is truthy.
// ---------------------------------------------
if ($method === 'POST' && $action === 'order') {
    $data = getRequestData();

    $email   = trim($data['email'] ?? '');
    $product = trim($data['product'] ?? '');
    $price   = $data['price'] ?? null;
    $newsletter = !empty($data['newsletter']);

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(400, ["error" => "Valid email is required"]);
    }
    if ($product === '') {
        respond(400, ["error" => "Product is required"]);
    }
    if (!is_numeric($price) || $price < 0) {
        respond(400, ["error" => "Valid price is required"]);
    }

    $stmt = $conn->prepare(
        "INSERT INTO orders (email, product, price) VALUES (?, ?, ?)"
    );
    $stmt->bind_param("ssd", $email, $product, $price);

    if (!$stmt->execute()) {
        respond(500, ["error" => "Failed to create order: " . $stmt->error]);
    }

    $orderId = $stmt->insert_id;
    $stmt->close();

    // Fetch the generated UUID for the response
    $uuidStmt = $conn->prepare("SELECT uuid FROM orders WHERE id = ?");
    $uuidStmt->bind_param("i", $orderId);
    $uuidStmt->execute();
    $uuidResult = $uuidStmt->get_result()->fetch_assoc();
    $uuidStmt->close();

    // Optional newsletter signup
    if ($newsletter) {
        $nlStmt = $conn->prepare(
            "INSERT INTO newsletters (email) VALUES (?)
             ON DUPLICATE KEY UPDATE email = email"
        );
        $nlStmt->bind_param("s", $email);
        $nlStmt->execute();
        $nlStmt->close();
    }

    respond(201, [
        "success" => true,
        "order" => [
            "id"   => $orderId,
            "uuid" => $uuidResult['uuid'] ?? null,
            "email" => $email,
            "product" => $product,
            "price" => $price,
        ],
        "newsletter_subscribed" => $newsletter,
    ]);
}

// ---------------------------------------------
// POST /?action=guestbook
// Creates a guestbook entry
// ---------------------------------------------
if ($method === 'POST' && $action === 'guestbook') {
    $data = getRequestData();

    $name = trim($data['name'] ?? '');
    $text = trim($data['text'] ?? '');

    if ($name === '') {
        respond(400, ["error" => "Name is required"]);
    }
    if ($text === '') {
        respond(400, ["error" => "Text is required"]);
    }

    $stmt = $conn->prepare(
        "INSERT INTO guestbook (name, text) VALUES (?, ?)"
    );
    $stmt->bind_param("ss", $name, $text);

    if (!$stmt->execute()) {
        respond(500, ["error" => "Failed to create guestbook entry: " . $stmt->error]);
    }

    $entryId = $stmt->insert_id;
    $stmt->close();

    $uuidStmt = $conn->prepare("SELECT uuid, created_at FROM guestbook WHERE id = ?");
    $uuidStmt->bind_param("i", $entryId);
    $uuidStmt->execute();
    $row = $uuidStmt->get_result()->fetch_assoc();
    $uuidStmt->close();

    respond(201, [
        "success" => true,
        "entry" => [
            "id"   => $entryId,
            "uuid" => $row['uuid'] ?? null,
            "name" => $name,
            "text" => $text,
            "created_at" => $row['created_at'] ?? null,
        ],
    ]);
}

// ---------------------------------------------
// GET /?action=status
// Health check — confirms DB connectivity
// ---------------------------------------------
if ($method === 'GET' && $action === 'status') {
    if ($conn->ping()) {
        respond(200, [
            "success" => true,
            "db_connected" => true,
        ]);
    } else {
        respond(510, [
            "success" => false,
            "db_connected" => false,
        ]);
    }
}

// ---------------------------------------------
// No matching route
// ---------------------------------------------
respond(404, ["error" => "Unknown action or method"]);