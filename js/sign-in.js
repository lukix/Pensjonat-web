(function () {
	document.getElementById('signInForm').addEventListener('submit', function (e) {
		e.preventDefault();
		let email = document.getElementsByName('email')[0].value;
		let password = document.getElementsByName('password')[0].value;

		document.getElementById('errorMessage').style.visibility = 'hidden';
		Http.post(URL + 'login', {email, password})
			.then(res => {
				if(res.ok) {
					console.log('ok');
					//TODO: Save user data to local storage
					window.location = "my-reservations.html";
				} else {
					document.getElementById('errorMessage').style.visibility = 'visible';
				}
			});
	});
	(function () {
	
	})();
})();