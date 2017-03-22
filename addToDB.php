<?php
    include('dbconfig.php');

    if(isset($_POST['nxtAccountNumber']) || isset($_POST['numberOfBatches']) || isset($_POST['secretPhrase']))
    {
        $nxtAccountNumber = $_POST['nxtAccountNumber'];
        $numberofBatches = $_POST['numberOfBatches'];
        $secretPhrase = $_POST['secretPhrase'];

        $sql = "INSERT INTO nxtaccounts(nxtAccountNumber,numberofBatches,secretPhrase) VALUES ('$nxtAccountNumber','$numberofBatches','$secretPhrase')";

        $result = @mysql_query($sql);

        if($result)
        {
            echo "Successfully added";
        }
        else
        {
            echo "Error: " . $sql ;
        }
    }

?>
