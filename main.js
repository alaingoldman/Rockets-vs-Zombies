$(document).ready(function(){

	// set global scope variables
	var rocketFrame = explodeFrame = explodeLocation = deathFrame = walkFrame = spawnFrame = score = 0;
	var gameStarted = blowingup = false;
	var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	var lettersOnScreen = ['a'];
	var gameInput = " ";

	// increases the walk frames to make the zombie appear to walk
	var walk = function() {
		if(gameStarted){
			if(walkFrame == 12){walkFrame = 0;} 
			$('img#zombie').attr('src', 'Walk'+ walkFrame + '.png');
			walkFrame++;
		}
	}

	// triggers the zombie coming out of the ground
	// then 'starts' the game 
	var spawn = function(){
		if(!gameStarted){
			if(spawnFrame == 11){gameStarted = true;} 
			$('img#zombie').attr('src', 'pop'+ spawnFrame + '.png');
			spawnFrame++;
		}
	}

	// generates a rocket with a random letter
	function createRocket(){
		var randLetter = Math.floor(Math.random() * letters.length);
		randLetter =  letters[randLetter];
		lettersOnScreen.unshift(randLetter);
		$('#rocket-row').prepend("<img class='singleRocket' src='rocket1.png'>");
		$('#rocket-row').prepend("<div class='rockets'><p>" + randLetter + "</p></div>");

	}

	// checks for user input and see if it matches a letter on the screen
	$(document).keypress(function(e)
	{
	    gameInput = String.fromCharCode(e.which);
	    if ($.inArray(gameInput, lettersOnScreen) > -1) {killRocket(true);}
	});

	// moves rocket
	// the speed of the rocket is determined by score * 5 in pixels
	function moveRocket(){
		if(rocketFrame == 3){rocketFrame = 0;} 
		$('.singleRocket').attr('src', 'rocket'+ rocketFrame + '.png');
		rocketFrame++;

		if(gameStarted){
			if(score == 0){
				$('.rockets').animate({'left' : '+=25px'}, 100, 'linear');
				$('.singleRocket').animate({'left' : '+=25px'}, 100, 'linear');
			}else{
				$('.rockets').animate({'left' : '+=' + (score * 5) + 'px'}, 100, 'linear');
				$('.singleRocket').animate({'left' : '+=' + (score * 5) + 'px'}, 100, 'linear');
			}
		    if(contact()){killRocket(false);}
		}
	}
	// destroys the rocket
	// it takes a true or false that determines the score
	function killRocket(value){
		explodeLocation = $('.singleRocket')[0].style.left;
		$('#rocket-row').append("<img class='explode' src='x0.png' style='left:" + (explodeLocation) +  "'>");
		blowingup = true;
		$('.singleRocket').remove();
		createRocket();
		lettersOnScreen.pop();
		$('#rocket-row .rockets:last').remove();
		if(value == true){score++;}
		else{score = 0;}
		$('#score').html(score);
	}

	// controls the exploding animation
	// because of set interval this is always running 
	// but it wont start the animation until killRocket() sets the blowing up variable to true
	function explode(){
		if (blowingup){
				var thisExplosion = $('.explode');
				thisExplosion.attr('src', 'x'+ explodeFrame + '.png');
				explodeFrame++;
				if (explodeFrame == 6){
					blowingup = false;
					explodeFrame = 0;
					explodeLocation = "0px";
					thisExplosion.remove();
				}
		}
	}

	// returns true or false if the rocket div touches the zombie
	function contact(){
		var rocketLocation = $('.rockets').offset().left + $('.rockets').width();
		var zombieLocation = $('#zombie').offset().left + 45;
		if(rocketLocation >= zombieLocation){return true;}
		else{return false;}
	}

	// one function that moves all the background images 
	// all at different rates
	var moveBackground = function(){
		$('#b5').animate({'background-position-x': '+=21px'}, 500, 'linear');
		if(gameStarted){
			$('#b1').animate({'background-position-x': '+=50px'}, 400, 'linear');
			$('#b2').animate({'background-position-x': '+=20px'}, 500, 'linear');
			$('#b3').animate({'background-position-x': '+=10px'}, 500, 'linear');
			$('#b4').animate({'background-position-x': '+=10px'}, 500, 'linear');
		}
	}

	// makes these functions trigger repeatedly
	var timeOut  = setInterval(spawn, 100);
	var timeOut2 = setInterval(walk, 100);
	var timeOut3 = setInterval(moveBackground, 100);
	var timeOut4 = setInterval(moveRocket, 100);
	var timeOut5 = setInterval(explode, 60);
})
