(function () {
	if(localStorage.getItem('guestId') === null ||
		localStorage.getItem('guestFirstName') === null ||
		localStorage.getItem('guestLastName') === null) {
		window.location = "sign-in.html";
	} else {
		document.querySelector('.name-surname').innerHTML = localStorage.guestFirstName + ' ' + localStorage.guestLastName;
	}
})();