<?php
$conn = new mysqli("localhost", "root", "", "tiles");

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM orders ORDER BY order_id DESC");

echo "<h2>Orders List</h2>";

if ($result->num_rows > 0) {
  echo "<table border='1' cellpadding='8'>";
  echo "<tr>
          <th>ID</th>
          <th>Name</th>
          <th>Total Amount</th>
          <th>Date</th>
        </tr>";

  while ($row = $result->fetch_assoc()) {
    echo "<tr>
            <td>{$row['order_id']}</td>
            <td>{$row['tile_name']}</td>
            <td>{$row['total_amount']}</td>
            <td>{$row['order_date']}</td>
          </tr>";
  }

  echo "</table>";
} else {
  echo "No orders found.";
}

$conn->close();
?>
