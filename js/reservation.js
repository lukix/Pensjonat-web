(function () {
	function getReservationData(reservationId) {
		return Http.get(URL + 'reservations/' + reservationId)
			.then(res => {
				return res.json().then(data => {
					if(res.ok) {
						return data;
					} else {
						return {error: data};
					}
					return data;
				});
			})
			.then(reservationData => {
				if(reservationData.error) return reservationData;
				return Promise.all(reservationData.accommodations.map((accommodation) => {
					return Http.get(URL + 'rooms/' + accommodation.roomId)
						.then(res => res.json());
				})).then(rooms => {
					reservationData.accommodations = reservationData.accommodations
						.map((accommodation, index) => Object.assign({}, accommodation, {room: rooms[index]}));
					return reservationData;
				});
			});
	}
	function getMeals() {
		return Http.get(URL + 'meals').then(res => {
			return res.json();
		}).then(data => {
			return data.meals;
		})
	}
	function showReservationData(reservationData, mealsList) {
		let createRoomsListItem = (room, meals, mealsList, editable) => {
			console.log(room)
			console.log(mealsList);
			let item = document.createElement('li');
			item.innerHTML = (`
				<div class="date">
					<span>${room.number}</span>
				</div>
				<ul>
					<li>${room.sleepPlaceAmount} osobowy</li>
					<li>Cena za dobę: ${room.price}zł</li>
					<li>
						Wyposażenie:
						${
							room.assets.length > 0
							? room.assets.map((asset) => `<span title="${asset.description}">${asset.name}</abbr>`).join(', ')
							: 'Brak dodatkowego wyposażenia'
						}
					</li>
					<li class="meals">
						Posiłki:
						${
							meals.length === 0
							? 'Brak'
							: meals.map((mealId, index) => {
								let meal = mealsList.find(meal => meal.id === mealId);
								return meal.name;
							}).join(', ')
						}
					</li>
				</ul>
			`);
			return item;
		}

		reservationData.accommodations
			.map(accommodation => createRoomsListItem(accommodation.room, accommodation.meals, mealsList, true))
			.forEach(room => document.querySelector('#reservedRooms').appendChild(room));

		const formatDate = (date) => new Date(date).toLocaleDateString().slice(0,10);
		document.querySelector('#reservationData').innerHTML = `
			Rezerwacja od ${formatDate(reservationData.startDate)}
			do ${formatDate(reservationData.endDate)}.<br />
			Pokoje:
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
		let reservationId = getParameterByName('id');
		let justCreated = getParameterByName('justcreated');
		document.getElementById('justcreated').style.display = (justCreated === null || justCreated === 'false') ? 'none' : 'default';
		if(reservationId === null) {
			window.location = "my-reservations.html";
		} else {
			document.querySelector('#reservationId').innerHTML = reservationId;
			Promise.all([getReservationData(reservationId), getMeals()]).then(([reservationData, meals]) => {
				console.log(reservationData);
				console.log(meals);
				showReservationData(reservationData, meals);
			});
		}
		document.querySelector('#cancelReservationBtn').addEventListener('click', function () {
			console.log('Anulowanie rezerwacji #' + reservationId);
		});
	})();
})();