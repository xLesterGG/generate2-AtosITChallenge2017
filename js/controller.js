var app = angular.module("myApp",[]);

app.controller("myCtrl",function($scope,$http){
    $scope.showgetbutton = true;  //initialize boolean to show get account number to true as default
    $scope.showqrgen = true; // boolean to show / hide generate qr button

    $scope.currentbatch = 0;  //default value for newly created accounts, will be updated if there is existing account in db later on
    $scope.recordID = 1;   // default value for first account (if no accounts yet)

    var qrcode = new QRCode(document.getElementById("qrcode"));   //initialize QR object

    $http.get('getLast.php') // performs a GET request to check if there are any account in db yet / obtains most recent account's information
        .then(
            function(response){
                if(response.data== "No data yet"){  // if no data

                    console.log('db no data');
                    $scope.password = document.results.text.value;   //get password from a generated secret phrase using javascrypt (hidden div), https://www.fourmilab.ch/javascrypt/pass_phrase.html

                    $scope.password = $scope.password.trim(); // remove whitespace
                    $scope.showqrgen = false; // hides qr generation button as there is no account

                }
                else{
                    console.log(response.data.accs[0].numberOfBatches);
                    if(response.data.accs[0].numberOfBatches ==0){
                        $scope.password = response.data.accs[0].secretPhrase;  //obtains secret phrase required for transaction for this particular account
                        $scope.accNum = response.data.accs[0].nxtAccountNumber;  //obtains nxt account number which is also required for qr generation / transaction
                        $scope.showgetbutton = false; // hides get account number button, only shown when there is no existing account / a new account needs to be generated

                        $scope.currentbatch = parseInt(response.data.accs[0].numberOfBatches); // obtains the current number of batches for this particular account
                        $scope.recordID = response.data.accs[0].recordID; // obtains the record id of current account
                    }
                    else if(response.data.accs[0].numberOfBatches >0){
                        $scope.password = document.results.text.value; //get password from a generated secret phrase using javascrypt (hidden div), https://www.fourmilab.ch/javascrypt/pass_phrase.html
                        $scope.showqrgen = false; // hide generate qr button
                        $scope.recordID = parseInt(response.data.accs[0].recordID) + 1;
                    }

                }
            },
            function(response){  //display error to user if something goes wrong
                alert("Get Last account error, please contact with your system administrator, and check the browser's console for more information");
                console.log(response);
            }
        );



    $scope.makeAccount = (pass)=>{  // recieves secret phrase generated in textbox

          $http.get('http://174.140.168.136:6876/nxt?requestType=getAccountId&secretPhrase='+encodeURIComponent(pass))  // NXT blockchain api call to get nxt account number using secret phrase
            .then(
                function(response){
                    // console.log(response.data);
                    //http://http://174.140.168.136:6876/nxt?requestType=getAccountPublicKey&account=GENERATED_ACCOUNT_NUMBER

                    $scope.checkAccount(response.data.accountRS); // pass returned account number for checking if account already exists

                },
                function(response){ // error alert
                    alert("ERROR in making account,please contact your system administrator,and check the browser's console for more information");
                    console.log(response);
                }
            );
    }

    $scope.checkAccount = (accNumber)=>{ // to check if account already exited before this (if generated password is by some coincedence some people's account)
        $http.get('http://174.140.168.136:6876/nxt?requestType=getAccountPublicKey&account='+encodeURIComponent(accNumber)) //blockchain api call to get account's public key
        .then(
            function(response){
                if(response.data.hasOwnProperty('publicKey')){ // if response contains public key, it means it might be someone else's account (only an account which has made a valid)
                                                                // transaction on the blockchain has a public key. A new acccount that we created does not have one.

                    alert('Generated account has existed, the page will now refresh. Please try again'); // alert the user for page reload
                    location.reload();
                }
                else{  // if no public key, then new account creation is successful
                    $scope.accNum = accNumber;
                    $scope.addToDB();  // add generated account details to db
                    //$scope.showqrgen = true; // show qr generation button after added to db
                }
            },
            function(response){
                alert("ERROR in checking account, contact your system administrator and check console for more information");
                console.log(response);
            }
        );
    }


    $scope.addToDB = ()=>{ // add generated account details to db
        var url = "addtoDB.php";

        var data = $.param({
            nxtAccountNumber: $scope.accNum,
            numberOfBatches: 0,
            secretPhrase:$scope.password
        }); // prepare data

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }; // set content header

        $http.post(url,data,config) // makes post request to db
            .then(
                function(response){ // if successful
                    console.log(response);
                    //improve
                    $scope.showqrgen = true; // show qr generation button after added to db

                    $scope.sendMoney($scope.accNum); // sends nxt from main account to this account so that it is able to make transactions.

                },
                function(response){ //if error
                    alert('An error has occured, please check console for more information');
                    console.log(response);
                }
            );
    }

//    http://174.140.168.136:6876/nxt?requestType=sendMoney&secretPhrase=IWontTellYou&amountNQT=100000000&feeNQT=100000000&deadline=60&recipient=NXT-4VNQ-RWZC-4WWQ-GVM8S

    $scope.sendMoney = (accNumber)=>{ // funding created account from a main account
        //NXT-2N9Y-MQ6D-WAAS-G88VH
        $scope.masterpw = "appear morning crap became fire liquid probably tease rare swear shut grief"; //password for main account

        //api call to send money to current account, 50 nxt for now.
        $http.post('http://174.140.168.136:6876/nxt?requestType=sendMoney&secretPhrase='+ encodeURIComponent($scope.masterpw) +'&amountNQT=5000000000&feeNQT=0&deadline=60&recipient='+encodeURIComponent(accNumber))
        .then(
            function(response){
                console.log("Sending money")
                console.log(response.data);
            },
            function(response){ // for
                alert("ERROR in sending nxt, contact your system administrator and check console for more information");
                console.log(response);
            }
        );
    }


    $scope.getQRData = (accNum)=>{ // obtains to be generated qr data from inputs (textboxes)
        var obj = {};

        obj.nxtAccNum = accNum;

        console.log(obj);
    //    qrcode.clear();
        qrcode.makeCode(JSON.stringify(obj)); // turn into json
        $scope.showqrgen = false;  //hide qr button after generating


//        alert('Please generate the qr when dealing with a new batch of products by refreshing the page'); // th is is to ensure that the number of batches is incremented accordingly (100 batches per account)

        var url = "updateBatchCount.php";

        var data = $.param({
            recordID : $scope.recordID,
            numberOfBatches : ($scope.currentbatch + 1)
        }); // prepare data to update

        $scope.currentbatch = $scope.currentbatch + 1; // updates data in current context

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        $http.post(url, data, config) // updates current account row , where batch + 1.   //post is used instead of put due to hosting with hosting server
			.then(
				function (response) {
                    console.log("success");
                    console.log(response);

				},
				function (response) {
                    alert('Something went wrong when trying to update number of batches, please check console and contact your system administrator');
                    console.log(response);
				}
			);
    }


    $scope.showqrbtn = ()=>{
        // qrcode.clear();
        if($scope.accNumber!='')
        {
            $scope.showqrgen = true;
        }
    }


});
