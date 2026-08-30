<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tiles";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $order_id = $_POST['order_id'];
  $tile_name = $_POST['tile_name'];
  $total_amount = $_POST['total_amount'];
 

  $sql = "INSERT INTO orders (order_name, total_price, mob_no, address)
        VALUES ('$order_name', '$tile_name', '$total_amount')";


  if ($conn->query($sql) === TRUE) {
    echo "<h2>Order placed successfully!</h2>";
    echo "<a href='orders.php'>View Orders</a>";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

$conn->close();
?>
