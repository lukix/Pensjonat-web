const reservationData = {
	id: 420,
	startDate: '11.08.2017',
	endDate: '18.08.2017',
	personsNumber: 4
};
(function () {
	function getReservationData(reservationId) {
		return new Promise((resolve, reject) => {
			resolve(reservationData);
		});
	}
	function showReservationData(reservationData) {
		document.querySelector('#reservationData').innerHTML = `
			Rezerwacja od ${reservationData.startDate} do ${reservationData.endDate}.<br />
			Liczba osób: ${reservationData.personsNumber} (jeden pokój).
		`;
	}
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
		var reservationId = getParameterByName('id');
		if(reservationId === null) {
			window.location = "my-reservations.html";
		} else {
			document.querySelector('#reservationId').innerHTML = reservationId;
			getReservationData(reservationId).then(reservationData => {
				showReservationData(reservationData);
			});
		}
		document.querySelector('#cancelReservationBtn').addEventListener('click', function () {
			console.log('Anulowanie rezerwacji #' + reservationId);
		});
	})();
})();