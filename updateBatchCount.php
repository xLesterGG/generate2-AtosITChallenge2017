<?php
    include('dbconfig.php');

    parse_str(file_get_contents("php://input"),$put_vars);

    if($put_vars['recordID'] !== '' || $put_vars['numberOfBatches'] !== '')
    {
        $recordID = $put_vars['recordID'];
        $numberofBatches = $put_vars['numberOfBatches'];

        $sql = "UPDATE nxtaccounts SET numberOfBatches = '$numberofBatches' WHERE recordID = '$recordID' ";

        echo $sql;

        $result = @mysql_query($sql);

        if($result)
        {
            echo "Successfully updated batch count";
        }
        else
        {
            echo "Error: " . $sql;
        }
    }

?>
