$(document).ready(function() {

	var config = {
		apiKey: "AIzaSyAm8Nes3z19dJcX5RxYj1L-aRDpnLv08IQ",
		authDomain: "train-scheduler-caa73.firebaseapp.com",
		databaseURL: "https://train-scheduler-caa73.firebaseio.com",
		projectId: "train-scheduler-caa73",
		storageBucket: "train-scheduler-caa73.appspot.com",
		messagingSenderId: "670976022914"
	};
	firebase.initializeApp(config);

	var database = firebase.database()

	$(".panel").css("padding", "0px");
	$("#addButton").on('click', function(event){
		event.preventDefault();

		var objectToUpdate= {};

		objectToUpdate.name = $('#name-input').val().trim();
		objectToUpdate.destination = $('#destination-input').val().trim();
		objectToUpdate.firstTrain = $('#first-train').val().trim();
		objectToUpdate.frequency = $('#frequency-input').val().trim();
		objectToUpdate.firstTrainConverted = moment(objectToUpdate.firstTrain, "HH:mm").subtract(10, "years").format("X");
		objectToUpdate.diffTime = moment().diff(moment.unix(objectToUpdate.firstTrainConverted), "minutes");
		objectToUpdate.timeLeft = (objectToUpdate.diffTime) % (objectToUpdate.frequency);
		objectToUpdate.minUntilTrain = (objectToUpdate.frequency) - (objectToUpdate.timeLeft);
		objectToUpdate.nextTrainMinutes = moment().add(objectToUpdate.minUntilTrain, "m").format("HH:mm");

		console.log(objectToUpdate);

		database.ref().push({
			name: objectToUpdate.name,
			destination: objectToUpdate.destination,
			firstTrain: objectToUpdate.firstTrain,
			frequency: objectToUpdate.frequency,
			nextArrival: objectToUpdate.nextTrainMinutes,
			minAway: objectToUpdate.minUntilTrain
		});
	});




	database.ref().on("child_added",function(snapshot){ 
		var a=snapshot.val();

		var newDiv=$('<div class="col-md-3">');
		newDiv.append(a.name);
		var newDiv1=$('<div class="col-md-3">');
		newDiv1.append(a.destination);
		var newDiv2=$('<div class="col-md-2">');
		newDiv2.append(a.frequency);
		var newDiv3=$('<div class="col-md-2">');
		newDiv3.append(a.nextArrival);
		var newDiv4=$('<div class="col-md-2">');
		newDiv4.append(a.minAway);		
		

		var superDiv=$('<div class="row">');
		superDiv.append(newDiv);
		superDiv.append(newDiv1);
		superDiv.append(newDiv2);
		superDiv.append(newDiv3);
		superDiv.append(newDiv4);

		$(".chartData").prepend(superDiv);

	}, 
	function(errorObject) {          
		console.log("Errors handled: " + errorObject.code);
	});


});