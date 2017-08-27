(function () {
	let state = {
		rooms: [],
		meals: []
	};
	function render() {
		showRooms(state.rooms);
	}
	function setState(obj) {
		state = Object.assign({}, state, obj);
	}
	const formatDate = (date) => date.toLocaleString().split(',')[0].split('.').reverse().join('-');

	function getAvailableRooms() {
		let fromDate = document.getElementById('dateFrom').valueAsDate;
		let untilDate = document.getElementById('dateTo').valueAsDate;
		return Http.get(URL + 'rooms/aviable' + `?FromDate=${formatDate(fromDate)}&UntilDate=${formatDate(untilDate)}`)
			.then(res => {
				console.log(res);
				return res.json();
			}).then(data => {
				console.log(data);
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
		let createRoomsListItem = (room, meals, editable) => {
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
						${meals.map((meal, index) =>
							`<label title="${meal.description}">
								<input type="checkbox" ${!editable ? (room.mealsMask[index] ? 'checked' : '') : ''} ${!editable ? 'disabled' : ''}>
								&nbsp;${meal.name}&nbsp;(+${meal.price}zł)
							</label>`).join(' ')}
					</li>
				</ul>
				<div class="action">
					<a href="">
						${room.selected ? 'Usuń z rezerwacji' : 'Dodaj do rezerwacji'}
					</a>
				</div>
			`);
			item.querySelector('.action>a').addEventListener('click', (e) => {
				e.preventDefault();
				room.selected = !room.selected;
				let mealsMask = [...item.querySelectorAll('li.meals input[type="checkbox"]')].map(checkbox => checkbox.checked);
				room.mealsMask = mealsMask;
				render();
			});
			return item;
		};

		document.querySelector('p#no-rooms-found').style.display =
			state.rooms.filter(room => !room.selected).length === 0 ? 'block' : 'none';

		document.querySelector('div.your-reservation').style.display =
			state.rooms.filter(room => room.selected).length === 0 ? 'none' : 'block';

		document.querySelector('#allRooms').innerHTML = '';
		state.rooms
			.filter(room => !room.selected)
			.map(room => createRoomsListItem(room, state.meals, true))
			.forEach(room => document.querySelector('#allRooms').appendChild(room));

		document.querySelector('#reservedRooms').innerHTML = '';
		state.rooms
			.filter(room => room.selected)
			.map(room => createRoomsListItem(room, state.meals, false))
			.forEach(room => document.querySelector('#reservedRooms').appendChild(room));
	}

	(function () {
		document.querySelector('#searchRoomsBtn').addEventListener('click', function () {
			Promise.all([getAvailableRooms(), getMeals()]).then(([roomsData, meals]) => {
				console.log(meals);
				setState({rooms: roomsData, meals: meals});
				render();
			});
		});
		document.querySelector('#reserveBtn').addEventListener('click', function () {
			console.log(state.rooms.filter(room => room.selected));
			let requestData = {
				"startDate": formatDate(document.getElementById('dateFrom').valueAsDate),//"2017-08-27T19:34:32.156Z",
				"endDate": formatDate(document.getElementById('dateTo').valueAsDate),
				"guestId": localStorage.guestId,
				"accommodations": state.rooms
					.filter(room => room.selected)
					.map(room => {
						return {
							"roomId": room.id,
							"meals": state.meals.filter((meal, index) => room.mealsMask[index]).map(meal => meal.id),
							"services": [],
							"status": "Created"
						}
					}),
				"version": 0
			};
			console.log(requestData);
			console.log(JSON.stringify(requestData, null, '\t'));
		});
		document.getElementById('dateFrom').valueAsDate = new Date();
		document.getElementById('dateTo').valueAsDate = new Date(new Date().getTime() + 1000*60*60*24*7);
		render();
	})();
})();