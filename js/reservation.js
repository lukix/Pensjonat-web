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
      "roomId": "101",
      "meals": [
        "string"
      ],
      "services": [
        "string"
      ]
		},
		{
      "roomId": "102",
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
			Pokoje:
			<ul>
				${reservationData.accommodations.map(accomodation => `<li>Pokój ${accomodation.roomId}, 3 osoby</li>`).join('')}
			</ul>
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
		document.querySelector('.name-surname').innerHTML = localStorage.guestFirstName + ' ' + localStorage.guestLastName;
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