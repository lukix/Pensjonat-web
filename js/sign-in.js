(function () {
	document.getElementById('signInForm').addEventListener('submit', function (e) {
		e.preventDefault();
		let email = document.getElementsByName('email')[0].value;
		let password = document.getElementsByName('password')[0].value;

		document.getElementById('errorMessage').style.visibility = 'hidden';
		Http.post(URL + 'login', {email, password})
			.then(res => {
				if(res.ok) {
					res.json().then(data => {
						return Http.get(URL + 'guests/' + data.id);
					}).then(res => {
						if(res.ok) {
							res.json().then(guest => {
								console.log(guest);
								localStorage.setItem('guestId', guest.id);
								localStorage.setItem('guestFirstName', guest.firstName);
								localStorage.setItem('guestLastName', guest.lastName);
								window.location = "my-reservations.html";
							});
						} else {
							document.getElementById('errorMessage').style.visibility = 'visible';
						}
					});
				} else {
					document.getElementById('errorMessage').style.visibility = 'visible';
				}
			});
	});
	(function () {
	
	})();
})();