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
		return Http.get(URL + 'reservations')
			.then(res => {
				return res.json().then((data) => {
					if(res.ok) {
						return reservations;
					} else {
						throw {error: data};
					}
					/*
					console.log('data:');
					console.log(data);
					*/
				});
			});
		/*
		return new Promise((resolve, reject) => {
			resolve(reservations);
		});
		*/
	}
	function showLoading() {
		document.querySelectorAll('.loading-message').forEach(item => {
			item.style.display = 'block';
		});
	}
	function hideLoading() {
		document.querySelectorAll('.loading-message').forEach(item => {
			item.style.display = 'none';
		});
	}
	function showError(error) {
		console.log(error);
		document.querySelectorAll('.error-message').forEach(item => {
			item.style.display = 'block';
			item.innerHTML = error.message;
		});
	}
	function showReservations (reservations) {
		hideLoading();
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
		document.querySelector('.name-surname').innerHTML = localStorage.guestFirstName + ' ' + localStorage.guestLastName;
		showLoading();
		getReservations()
		.then(reservations => {
			hideLoading();
			showReservations(reservations)
		})
		.catch(err => {
			hideLoading();
			showError(err.error);
		});
	})();
})();