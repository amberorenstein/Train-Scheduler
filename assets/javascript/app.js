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


	$("#addButton").on('click', function(event){
		event.preventDefault();

		var objectToUpdate= {};

		objectToUpdate.name = $('#name-input').val().trim();
		objectToUpdate.destination = $('#destination-input').val().trim();
		objectToUpdate.firstTrain = $('#first-train').val().trim();
		objectToUpdate.frequency = $('#frequency-input').val().trim();
		objectToUpdate.firstTrainConverted = moment(objectToUpdate.firstTrain, "hh:mm").subtract(1, "years");
		objectToUpdate.currentTime = moment();
		objectToUpdate.diffTime = moment().diff(moment(objectToUpdate.firstTrainConverted), "minutes");
		objectToUpdate.timeLeft = (objectToUpdate.diffTime) % (objectToUpdate.frequency);
		objectToUpdate.minUntilTrain = (objectToUpdate.frequency) - (objectToUpdate.timeLeft);
		objectToUpdate.nextTrainMinutes = moment(objectToUpdate.minUntilTrain).format("hh:mm");

		console.log(objectToUpdate);

		database.ref().push({
			name: objectToUpdate.name,
			destination: objectToUpdate.destination,
			firstTrain: objectToUpdate.firstTrain,
			frequency: objectToUpdate.frequency
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
		
		
		var superDiv=$('<div class="row">');
		superDiv.append(newDiv);
		superDiv.append(newDiv1);
		superDiv.append(newDiv2);


		$(".chartData").prepend(superDiv);


	}, 
	function(errorObject) {          
		console.log("Errors handled: " + errorObject.code);
	});


});