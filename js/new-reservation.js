const availableRooms = new Array(14).fill(
	{
		date: '10.09.2017',
		capacity: 4,
		price: 79,
		selected: false
	}).map((item, index) => Object.assign({}, item, {number: (150+index)}));
(function () {
	let state = {
		rooms: []
	};
	function render() {
		showRooms(state.rooms);
	}
	function setState(obj) {
		state = Object.assign({}, state, obj);
	}

	function getAvailableRooms() {
		return new Promise((resolve, reject) => {
			resolve(availableRooms);
		});
	}
	function showRooms() {
		const stringToDate = (string) => {
			let [d, m, y] = string.split('.');
			return new Date([m, d, y].join('.'));
		};
		let createRoomsListItem = (room) => {
			let item = document.createElement('li');
			item.innerHTML = (`
				<div class="date">
					<span>${room.number}</span>
				</div>
				<ul>
					<li>${room.capacity} osobowy</li>
					<li>Cena za dobę: ${room.price}zł</li>
					<li>Wyposażenie: Suszarka, Maszyna W</li>
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
			.map(room => createRoomsListItem(room))
			.forEach(room => document.querySelector('#allRooms').appendChild(room));

		document.querySelector('#reservedRooms').innerHTML = '';
		state.rooms
			.filter(room => room.selected)
			.map(room => createRoomsListItem(room))
			.forEach(room => document.querySelector('#reservedRooms').appendChild(room));
	}

	(function () {
		document.querySelector('#searchRoomsBtn').addEventListener('click', function () {
			getAvailableRooms().then(roomsData => {
				setState({rooms: roomsData});
				render();
			});
		});
		document.getElementById('dateFrom').valueAsDate = new Date();
		document.getElementById('dateTo').valueAsDate = new Date(new Date().getTime() + 1000*60*60*24*7);
		render();
	})();
})();