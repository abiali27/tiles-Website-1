<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tiles_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("<h3>Database Connection Failed: " . $conn->connect_error . "</h3>");
}

// Fetch all orders
$sql = "SELECT * FROM orders ORDER BY order_date DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Orders</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f5f5f5;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        table {
            width: 90%;
            margin: 20px auto;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #007bff;
            color: white;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
    </style>
</head>
<body>
    <h2>All Placed Orders</h2>

    <table>
        <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Order Date</th>
        </tr>

        <?php
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>
                        <td>{$row['id']}</td>
                        <td>{$row['customer_name']}</td>
                        <td>{$row['item_name']}</td>
                        <td>{$row['quantity']}</td>
                        <td>₹{$row['price']}</td>
                        <td>₹{$row['total']}</td>
                        <td>{$row['order_date']}</td>
                      </tr>";
            }
        } else {
            echo "<tr><td colspan='7'>No orders found</td></tr>";
        }
        $conn->close();
        ?>
    </table>
</body>
</html>
