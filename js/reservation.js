/*
const reservationData = {
	id: 420,
	startDate: '11.08.2017',
	endDate: '18.08.2017',
	personsNumber: 4
};
*/
const reservationData = {
  "id": "C56A4180-65AA-42EC-A945-5FD21DEC0538",
  "startDate": "2017-08-12T11:46:45.554Z",
  "endDate": "2017-08-23T11:46:45.554Z",
  "guestId": "12345",
  "accommodations": [
    {
      "roomId": "string",
      "meals": [
        "string"
      ],
      "services": [
        "string"
      ]
    }
  ],
};

(function () {
	function getReservationData(reservationId) {
		return new Promise((resolve, reject) => {
			resolve(reservationData);
		});
	}
	function showReservationData(reservationData) {
		const formatDate = (date) => new Date(date).toISOString().slice(0,10);
		document.querySelector('#reservationData').innerHTML = `
			Rezerwacja od ${formatDate(reservationData.startDate)}
			do ${formatDate(reservationData.endDate)}.<br />
			Liczba osób: ${7} (jeden pokój).
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