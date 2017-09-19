(function () {
	let state = {
		reservation: {accommodations: []},
		availableRooms: [],
		meals: []
	};
	function render() {
		showRooms(state.rooms);
		document.getElementById('reservation-info').innerHTML = `
			Data rozpoczęcia: ${state.reservation.startDate.split('T')[0]}<br />
			Data zakończenia: ${state.reservation.endDate.split('T')[0]}<br />
			Cena: ... (Zapłacone/Do zapłacenia)
		`;
	}
	function setState(obj) {
		state = Object.assign({}, state, obj);
	}
	const formatDate = (date) => date.toLocaleString().split(',')[0].split('.').reverse().join('-');

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
	function getAvailableRooms(startDate, endDate) {
		let fromDate = startDate;
		let untilDate = endDate;
		return Http.get(URL + 'rooms/aviable' + `?FromDate=${formatDate(fromDate)}&UntilDate=${formatDate(untilDate)}`)
			.then(res => {
				return res.json();
			}).then(data => {
				return data.rooms;
			});
	}
	function getMeals() {
		return Http.get(URL + 'meals').then(res => {
			return res.json();
		}).then(data => {
			return data.meals;
		})
	}
	function showRooms() {
		const stringToDate = (string) => {
			let [d, m, y] = string.split('.');
			return new Date([m, d, y].join('.'));
		};
		let createRoomsListItem = (room, {showMeals, mealsEditable, enableAddRemove, isReserved}, meals) => {
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
						${!showMeals ? '' : state.meals.map((meal, index) =>
							`<label title="${meal.description}">
								<input type="checkbox" ${mealsEditable ? '' : 'disabled'} ${showMeals ? (meals.find(mealId => mealId === meal.id) !== undefined ? 'checked' : '') : ''}>
								&nbsp;${meal.name}&nbsp;(+${meal.price}zł)
							</label>`).join(' ')}
					</li>
				</ul>
				<div class="action">
					${!enableAddRemove
						? ''
						: `<a href="">
								${isReserved ? 'Usuń z rezerwacji' : 'Dodaj do rezerwacji'}
							</a>`
					}
				</div>
			`);
			item.querySelectorAll('input[type=checkbox]').forEach((checkbox, checkboxIndex) => {
				checkbox.addEventListener('click', e => {
					console.log(e.target.checked);
					let accommodation = state.reservation.accommodations.find(accommodation => accommodation.roomId === room.id);
					if(e.target.checked) {
						accommodation.meals.push(state.meals[checkboxIndex].id);
					} else {
						accommodation.meals = accommodation.meals.filter(mealId => mealId !== state.meals[checkboxIndex].id);
					}
					updateReservations();
				});
			});
			if(enableAddRemove) {
				item.querySelector('.action>a').addEventListener('click', (e) => {
					e.preventDefault();
					if(isReserved) {
						//Usuwanie z rezerwacji
						state.reservation.accommodations = state.reservation.accommodations
							.filter(accommodation => accommodation.roomId !== room.id);
					} else {
						//Dodawanie do rezerwacji
						state.reservation.accommodations.push({
							meals: [],
							roomId: room.id,
							services: [],
							status: 'Created'
						});
					}
					updateReservations();
				});
			}

			return item;
		};

		let isReservationActive = !isDatePast(state.reservation.startDate);

		document.querySelector('p#no-rooms-found').style.display =
			state.availableRooms.length === 0 ? 'block' : 'none';

		document.querySelector('#allRooms').innerHTML = '';
		state.availableRooms
			.map(room => createRoomsListItem(room, {showMeals: false, enableAddRemove: true, isReserved: false}))
			.forEach(room => document.querySelector('#allRooms').appendChild(room));

		document.querySelector('#reservedRooms').innerHTML = '';
		state.reservation.accommodations
			.map(accommodation => createRoomsListItem(accommodation.room, {showMeals: true, mealsEditable: isReservationActive, enableAddRemove: isReservationActive, isReserved: true}, accommodation.meals))
			.forEach(room => document.querySelector('#reservedRooms').appendChild(room));
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
	function updateReservations() {
		state.reservation.accommodations.forEach(accommodation => {
			delete accommodation.room;
		})
		let reservationId = state.reservation.id;
		delete state.reservation.id;
		console.log(state.reservation);
		Http.put(URL + 'reservations/' + reservationId, state.reservation)
			.then(res => {
				if(res.ok) {
					console.log('update ok');
				} else {
					console.log('update error');
				}
				window.location.reload();
			});
	}
	function isDatePast(date) {
		let now = new Date();
		now.setHours(0, 0, 0, 0);
		return new Date(date) < now
	}
	function showEditFields(date) {
		if(!isDatePast(date)) {
			document.querySelectorAll('.edit-field').forEach(element => {
				element.style.display = 'block';
			});
		}
	}
	(function () {
		let reservationId = getParameterByName('id');
		let justCreated = getParameterByName('justcreated');
		document.getElementById('justcreated').style.display = (justCreated === null || justCreated === 'false') ? 'none' : 'default';
		if(reservationId === null) {
			window.location = "my-reservations.html";
		} else {
			document.querySelector('#reservationId').innerHTML = reservationId;
			getReservationData(reservationId).then(reservationData => {
				return Promise.all([getAvailableRooms(reservationData.startDate, reservationData.endDate), getMeals()]).then(([roomsData, meals]) => {
					console.log(reservationData);
					setState({availableRooms: roomsData, meals: meals, reservation: reservationData});
					render();
					showEditFields(reservationData.startDate);
				});
			});
		}
		document.getElementById('cancelBtn').addEventListener('click', () => {
			Http.delete(URL + 'reservations/' + reservationId, {version: 0})
				.then(res => {
					window.location = "my-reservations.html";
				});
		});
		render();
	})();
})();