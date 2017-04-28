<?php
    include('dbconfig.php');

    if(isset($_GET['nxtAccountNumber'])){
        //echo $_GET['nxtAccountNumber'];

        $nxtAccountNumber = $_GET['nxtAccountNumber'];
        $checkforacc = $conn->query("SELECT nxtAccountNumber,secretPhrase FROM nxtAccounts2 where nxtAccountNumber = '$nxtAccountNumber'");

        // mysqli_num_rows($checkfortrans) == 0

        if(mysqli_num_rows($checkforacc) == 0)
        {
            echo 'No such account';
        }
        else{
            $result = $conn->query("SELECT nxtAccountNumber,secretPhrase FROM nxtAccounts2 where nxtAccountNumber = '$nxtAccountNumber' LIMIT 1");
            while($r = $result->fetch_assoc()) {
                $rows= $r;
            }

            print json_encode($rows);
        }
    }


?>
