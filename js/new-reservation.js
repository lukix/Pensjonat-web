const calendarData = new Array(14).fill(
	{
		date: '10.09.2017',
		options: [
			{
				rooms: [{capacity: 4}],
				availability: 6
			},
			{
				rooms: [{capacity: 2}, {capacity: 2}],
				availability: 17
			},
			{
				rooms: [{capacity: 3}, {capacity: 1}],
				availability: 11
			}
		]
	}).map((item, index) => Object.assign({}, item, {date: (10+index)+'.09.2017'}));
(function () {
	function getAvailableTerms() {
		return new Promise((resolve, reject) => {
			resolve(calendarData);
		});
	}
	function showCalendar(calendarData) {
		const stringToDate = (string) => {
			let [d, m, y] = string.split('.');
			return new Date([m, d, y].join('.'));
		};
		const personsString = (n) => n === 1 ? 'osoba' : (n > 1 && n < 5) ? 'osoby' : 'osób';
		const monthAbbreviations = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];
		let html = calendarData.map(term =>
			`<li>
				<div class="date">
					<span>${term.date.split('.')[0]}</span>
					<span>${monthAbbreviations[parseInt(term.date.split('.')[1])-1]}</span>
				</div>
				<ul>
					${
						term.options.map(option =>
							`<li>${option.rooms === 1 ? 'Pokój' : 'Pokoje'} ${option.rooms.map(r => r.capacity).join('+')} os. - wolny przez ${option.availability} dni (do  27.09.2017)<li>`
						).join('')
					}
				</ul>
				<div class="action"><a href="">Rezerwuj</a></div>
			</li>`
		).join('');
		document.querySelector('#calendar').innerHTML = html;
	}

	(function () {
		document.querySelector('#searchTermsBtn').addEventListener('click', function () {
			getAvailableTerms().then(calendarData => {
				showCalendar(calendarData);
			});
		});
	})();
})();