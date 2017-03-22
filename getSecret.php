<?php
    include('dbconfig.php');

    if(isset($_GET['nxtAccountNumber'])){
        //echo $_GET['nxtAccountNumber'];

        $nxtAccountNumber = $_GET['nxtAccountNumber'];
        $checkforacc = mysql_query("SELECT nxtAccountNumber,secretPhrase FROM nxtAccounts2 where nxtAccountNumber = '$nxtAccountNumber'");

        if(mysql_num_rows($checkforacc) != 0)
        {
            $result = mysql_query("SELECT nxtAccountNumber,secretPhrase FROM nxtAccounts2 where nxtAccountNumber = '$nxtAccountNumber' LIMIT 1");
            while($r = mysql_fetch_assoc($result)) {
                $rows= $r;
            }

            print json_encode($rows);

        }
        else{
            echo 'No such account';
        }
    }


?>
