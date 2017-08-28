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
	function getParameterByName(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
					results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	(function () {
		let justCreated = getParameterByName('justcreated') === 'true';
		document.getElementById('justcreated').style.display = justCreated ? 'default' : 'none';
	})();
})();