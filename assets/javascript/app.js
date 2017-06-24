$(document).ready(function() {
//Initialize Firebase
	var config = {
		apiKey: "AIzaSyAm8Nes3z19dJcX5RxYj1L-aRDpnLv08IQ",
		authDomain: "train-scheduler-caa73.firebaseapp.com",
		databaseURL: "https://train-scheduler-caa73.firebaseio.com",
		projectId: "train-scheduler-caa73",
		storageBucket: "train-scheduler-caa73.appspot.com",
		messagingSenderId: "670976022914"
	};
	firebase.initializeApp(config);

//Create Firebase Database object
	var database = firebase.database()

//Display current time
	$("#current-time").append(moment());

//Remove defauly panel padding
	$(".panel").css("padding", "0px");

//Click event for submit button
	$("#addButton").on('click', function(event){
		event.preventDefault();

//Create master object to update that will hold relevant data
		var objectToUpdate= {};

//Pull Data from input fields
		objectToUpdate.name = $('#name-input').val().trim();
		objectToUpdate.destination = $('#destination-input').val().trim();
		objectToUpdate.firstTrain = $('#first-train').val().trim();
		objectToUpdate.frequency = $('#frequency-input').val().trim();

		console.log(objectToUpdate);

//Push data to the Firebase database
		database.ref().push({
			name: objectToUpdate.name,
			destination: objectToUpdate.destination,
			firstTrain: objectToUpdate.firstTrain,
			frequency: objectToUpdate.frequency,
		});
	});

//Append data from the Firebase database to the display divs at the top of the page
	database.ref().on("child_added",function(snapshot){ 
		var a=snapshot.val();
//moment.js time calculations for next train values
		var firstTrainConverted = moment(a.firstTrain, "HH:mm").subtract(10, "years").format("X");
		var diffTime = moment().diff(moment.unix(firstTrainConverted), "minutes");
		var timeLeft = diffTime % a.frequency;
		var minUntilTrain = a.frequency - timeLeft
		var nextTrainMinutes = moment().add(minUntilTrain, "m").format("HH:mm");
//displaying values into div at the top of the page
		var newDiv=$('<div class="col-xs-3">');
		newDiv.append(a.name);
		var newDiv1=$('<div class="col-xs-3">');
		newDiv1.append(a.destination);
		var newDiv2=$('<div class="col-xs-2">');
		newDiv2.append(a.frequency);
		var newDiv3=$('<div class="col-xs-2">');
		newDiv3.append(nextTrainMinutes);
		var newDiv4=$('<div class="col-xs-2">');
		newDiv4.append(minUntilTrain);


		var superDiv=$('<div class="row">');
		superDiv.append(newDiv);
		superDiv.append(newDiv1);
		superDiv.append(newDiv2);
		superDiv.append(newDiv3);
		superDiv.append(newDiv4);

		$(".chartData").prepend(superDiv);

	},
//In case there is an error in the data process share Firebase error 
	function(errorObject) {          
		console.log("Errors handled: " + errorObject.code);
	});


});