(function () {
	let GUEST = {};
	const validatorFuncs = {
		email: (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
	}

	Http.get(URL + 'guests/' + localStorage.getItem('guestId'))
		.then(res => {
			res.json().then(guest => {
				if(res.ok) {
					console.log(guest);
					GUEST = guest;
					fillForm(guest);
				} else {
					console.log('Error occured during fetching guest data');
					console.log(guest);
				}
			})
		});

	//Change password form
	document.getElementById('editGuestPasswordForm').addEventListener('submit', (e) => {
		e.preventDefault();
		const [$password, $repeatPassword] = [
			document.querySelector('#editGuestPasswordForm input[name="password"]'),
			document.querySelector('#editGuestPasswordForm input[name="repeatPassword"]')
		];

		const [$passwordMessageBox, $repeatPasswordMessageBox] =
			[$password, $repeatPassword].map(item => findInputsMessageBox(item));;

		let isValid = true;

		$repeatPasswordMessageBox.style.display = 'none';
		$passwordMessageBox.style.display = 'none';

		if($password.value !== $repeatPassword.value) {
			$repeatPasswordMessageBox.innerHTML = 'Hasła nie zgadzają się';
			$repeatPasswordMessageBox.style.display = 'block';
			isValid = false;
		}

		if($password.value.length === 0) {
			$passwordMessageBox.innerHTML = 'Hasło nie może być puste';
			$passwordMessageBox.style.display = 'block';
			isValid = false;
		}

		if(isValid) {
			const json = { password: $password.value };
			updateGuest(json);
		}
	});

	//Change user's data form
	document.getElementById('editGuestDataForm').addEventListener('submit', (e) => {
		e.preventDefault();
		const [$firstName, $lastName, $email, $idCard] = [
			document.querySelector('#editGuestDataForm input[name="name"]'),
			document.querySelector('#editGuestDataForm input[name="surname"]'),
			document.querySelector('#editGuestDataForm input[name="email"]'),
			document.querySelector('#editGuestDataForm input[name="idcard"]')
		];
		const [$firstNameMessageBox, $lastNameMessageBox, $emailMessageBox, $idCardMessageBox] =
			[$firstName, $lastName, $email, $idCard].map(item => findInputsMessageBox(item));

		let isValid = true;

		$firstNameMessageBox.style.display = 'none';
		$lastNameMessageBox.style.display = 'none';
		$emailMessageBox.style.display = 'none';
		$idCardMessageBox.style.display = 'none';

		if($firstName.value.length === 0) {
			$firstNameMessageBox.innerHTML = 'Imię nie może być puste';
			$firstNameMessageBox.style.display = 'block';
			isValid = false;
		}
		if($lastName.value.length === 0) {
			$lastNameMessageBox.innerHTML = 'Nazwisko nie może być puste';
			$lastNameMessageBox.style.display = 'block';
			isValid = false;
		}
		if(!validatorFuncs.email($email.value)) {
			$emailMessageBox.innerHTML = 'Podany adres e-mail jest nieprawidłowy';
			$emailMessageBox.style.display = 'block';
			isValid = false;
		}
		if($idCard.value.length === 0) {
			$idCardMessageBox.innerHTML = 'Numer dowodu nie może być pusty';
			$idCardMessageBox.style.display = 'block';
			isValid = false;
		}

		if(isValid) {
			const json = {
				firstName: $firstName.value,
				lastName: $lastName.value,
				email: $email.value,
				idCard: $idCard.value
			};
			updateGuest(json, () => {
				localStorage.setItem('guestFirstName', json.firstName);
				localStorage.setItem('guestLastName', json.lastName);
			});
		}
	});

	//Change user's address
	document.getElementById('editGuestAddressForm').addEventListener('submit', (e) => {
		e.preventDefault();
		const [$country, $city, $street, $houseNumber, $postalCode] = [
			document.querySelector('#editGuestAddressForm select[name="country"]'),
			document.querySelector('#editGuestAddressForm input[name="city"]'),
			document.querySelector('#editGuestAddressForm input[name="street"]'),
			document.querySelector('#editGuestAddressForm input[name="houseNumber"]'),
			document.querySelector('#editGuestAddressForm input[name="postalCode"]')
		];
		const [$cityMessageBox, $streetMessageBox, $houseNumberMessageBox, $postalCodeMessageBox] =
		[$city, $street, $houseNumber, $postalCode].map(item => findInputsMessageBox(item));

		let isValid = true;

		$cityMessageBox.style.display = 'none';
		$streetMessageBox.style.display = 'none';
		$houseNumberMessageBox.style.display = 'none';
		$postalCodeMessageBox.style.display = 'none';

		if($city.value.length === 0) {
			$cityMessageBox.innerHTML = 'Miasto nie może być puste';
			$cityMessageBox.style.display = 'block';
			isValid = false;
		}
		if($street.value.length === 0) {
			$streetMessageBox.innerHTML = 'Ulica nie może być pusta';
			$streetMessageBox.style.display = 'block';
			isValid = false;
		}
		if($houseNumber.value.length === 0) {
			$houseNumberMessageBox.innerHTML = 'Numer domu nie może być pusty';
			$houseNumberMessageBox.style.display = 'block';
			isValid = false;
		}
		if($postalCode.value.length === 0) {
			$postalCodeMessageBox.innerHTML = 'Kod pocztowy nie może być pusty';
			$postalCodeMessageBox.style.display = 'block';
			isValid = false;
		}


		if(isValid) {
			const json = {
				address: [$country.value, $postalCode.value, $city.value, $street.value, $houseNumber.value].join(', ')
			};
			updateGuest(json);
		}
	});
	function updateGuest(json, callback) {
		console.log(json);
		Http.put(URL + 'guests/' + localStorage.getItem('guestId'), Object.assign({}, GUEST, json)).then(res => {
			if(res.ok) {
				if(callback) callback();
				location.reload();
			} else {
				res.json().then(data => {
					console.log(data);
				})
			}
			
		})
	}
	function findInputsMessageBox(input) {
		return input.parentElement.querySelector('.validation-message');
	}
	function fillForm(guest) {
		document.querySelector('#editGuestDataForm input[name="name"]').value = guest.firstName;
		document.querySelector('#editGuestDataForm input[name="surname"]').value = guest.lastName;
		document.querySelector('#editGuestDataForm input[name="email"]').value = guest.email;
		document.querySelector('#editGuestDataForm input[name="idcard"]').value = guest.idCard;
	
		const [country, postalCode, city, street, houseNumber] = guest.address.split(', ');
		document.querySelector('#editGuestAddressForm select[name="country"]').value = country;
		document.querySelector('#editGuestAddressForm input[name="city"]').value = city;
		document.querySelector('#editGuestAddressForm input[name="street"]').value = street;
		document.querySelector('#editGuestAddressForm input[name="houseNumber"]').value = houseNumber;
		document.querySelector('#editGuestAddressForm input[name="postalCode"]').value = postalCode;
	}

	//City autocomplete
	(function () {
		const $city = document.querySelector('#editGuestAddressForm input[name="city"]');

		let autocomplete = new google.maps.places.Autocomplete(($city), {
			types: ['(cities)'],
			componentRestrictions: {'country': 'pl'}
		});

		$city.addEventListener('keypress', (e) => {
			if(e.keyCode === 13) e.preventDefault();
		});
		
	})();
})();