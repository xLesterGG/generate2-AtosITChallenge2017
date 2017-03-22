<?php
    include('dbconfig.php');

    $checkfortrans = mysql_query("SELECT nxtAccountNumber,numberOfBatches,secretPhrase FROM nxtAccounts2");

    if(mysql_num_rows($checkfortrans) != 0)
    {
        $result = mysql_query("SELECT * FROM nxtAccounts2 ORDER BY recordID DESC LIMIT 1");
        $rows = array();
        while($r = mysql_fetch_assoc($result)) {
            $rows['accs'][]= $r;
        }

        print json_encode($rows);

    }
    else{
        echo 'No data yet';
    }

?>
