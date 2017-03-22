<?php
    $db_host="localhost"; // Host name
    $db_username="root"; // Mysql username
    $db_password=""; // Mysql password
    $db_name="atos"; // Database name
    mysql_connect("$db_host", "$db_username", "$db_password")or die("dbconfig: cannot connect");
    mysql_select_db("$db_name")or die("dbconfig: cannot select DB");
?>