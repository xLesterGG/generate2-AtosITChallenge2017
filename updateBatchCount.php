<?php
    include('dbconfig.php');

    parse_str(file_get_contents("php://input"),$put_vars);

    if($put_vars['recordID'] !== '' || $put_vars['numberOfBatches'] !== '')
    {
        $recordID = $put_vars['recordID'];
        $numberofBatches = $put_vars['numberOfBatches'];

        $sql = "UPDATE nxtAccounts2 SET numberOfBatches = '$numberofBatches' WHERE recordID = '$recordID' ";

        // echo $sql;

        if($conn->query($sql) === true){
            echo "Successfully updated batch count";
        }
        else{
            echo "Error: " . $sql;
        }        
    }

?>
