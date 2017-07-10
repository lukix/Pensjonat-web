const reservations = [
	{
		id: 420,
		startDate: '11.08.2017',
		endDate: '18.08.2017',
		personsNumber: 4
	},
	{
		id: 234,
		startDate: '23.06.2017',
		endDate: '07.07.2017',
		personsNumber: 1
	},
	{
		id: 126,
		startDate: '11.05.2017',
		endDate: '13.05.2017',
		personsNumber: 5
	}
];

(function () {
	function getReservations() {
		return new Promise((resolve, reject) => {
			resolve(reservations);
		});
	}
	function showReservations (reservations) {
		const stringToDate = (string) => {
			let [d, m, y] = string.split('.');
			return new Date([m, d, y].join('.'));
		};
		const personsString = (n) => n === 1 ? 'osoba' : (n > 1 && n < 5) ? 'osoby' : 'osób'; 
		const createHtmlFromJson = json => 
			json.map(r => `<li>
				<a href="reservation.html?id=${r.id}" style="color: black; text-decoration: none">
					<div>
						<div>Rezerwacja #${r.id}</div>
						<div>${r.personsNumber} ${personsString(r.personsNumber)}</div>
						<div>${r.startDate} - ${r.endDate}</div>
					</div>
				</a>
			</li>`).join('');
		document.querySelector('#currentReservations').innerHTML = createHtmlFromJson(reservations.filter(r => stringToDate(r.endDate).getTime() >  new Date().getTime()));
		document.querySelector('#historyReservations').innerHTML = createHtmlFromJson(reservations.filter(r => stringToDate(r.endDate).getTime() <= new Date().getTime()));
	}

	(function () {
		getReservations().then(reservations => {
			showReservations(reservations);
		});
	})();
})();