(function () {
	function getReservations() {
		return Http.get(URL + 'reservations/guest/' + localStorage.guestId)
			.then(res => {
				return res.json().then((data) => {
					if(res.ok) {
						return data.reservations;
					} else {
						return {error: data};
					}
				});
			});
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
	function showReservations(reservations) {
		console.log(reservations);
		hideLoading();
		const formatDateString = (dateString) => {
			let [y, m, d] = dateString.split('T')[0].split('-');
			return [m, d, y].join('.');
		}
		const stringToDate = (dateString) => {
			return new Date(formatDateString(dateString));
		};
		const roomsString = (n) => n === 1 ? 'pokój' : (n > 1 && n < 5) ? 'pokoje' : 'pokoi'; 
		const createHtmlFromJson = json => 
			json.map(r => `<li>
				<a href="reservation.html?id=${r.id}" style="color: black; text-decoration: none">
					<div>
						<div title="#${r.id}">Rezerwacja #${r.id.split('-')[0]}...</div>
						<div>${r.accommodations.length} ${roomsString(r.accommodations.length)}</div>
						<div>${formatDateString(r.startDate)} - ${formatDateString(r.endDate)}</div>
					</div>
				</a>
			</li>`).join('');
		document.querySelector('#currentReservations').innerHTML = createHtmlFromJson(reservations.filter(r => stringToDate(r.endDate).getTime() >  new Date().getTime()));
		document.querySelector('#historyReservations').innerHTML = createHtmlFromJson(reservations.filter(r => stringToDate(r.endDate).getTime() <= new Date().getTime()));
	}

	(function () {
		showLoading();
		getReservations()
		.then(reservations => {
			if(reservations.error) {
				hideLoading();
				showError(err.error);
			} else {
				hideLoading();
				showReservations(reservations)
			}
		});
	})();
})();