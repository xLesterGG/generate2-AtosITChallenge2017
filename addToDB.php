<?php
    include('dbconfig.php');

    if(isset($_POST['nxtAccountNumber']) || isset($_POST['numberOfBatches']) || isset($_POST['secretPhrase']))
    {
        $nxtAccountNumber = $_POST['nxtAccountNumber'];
        $numberofBatches = $_POST['numberOfBatches'];
        $secretPhrase = $_POST['secretPhrase'];

        $sql = "INSERT INTO nxtAccounts2(nxtAccountNumber,numberOfBatches,secretPhrase) VALUES ('$nxtAccountNumber','$numberofBatches','$secretPhrase')";

        if($conn->query($sql))
        {
            echo "Successfully added";
        }
        else{
            echo "Error: " . $sql ;
        }

    }

?>
