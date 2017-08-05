(function () {
	let validatorFuncs = {
		email: (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email),
		pesel: (pesel) => {
			var reg = /^[0-9]{11}$/;
			if(reg.test(pesel) == false) {
				return false;
			} else {
				var dig = (""+pesel).split("");
				var ks = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3, 0];
				var kontrola = dig.reduce((prev, curr, i) => {
					return prev + ks[i]*parseInt(curr);
				}, 0) % 10;
				kontrola = kontrola === 0 ? 0 : 10 -kontrola;
				return parseInt(dig[10]) === kontrola;
			}
		},
		postalCode: (postalCode) => /^[0-9]{2}-[0-9]{3}$/.test(postalCode),
	}
	function clearInvalidStates(inputs) {
		for(let key in inputs) {
			inputs[key].setInvalidState(false);
		}
	}
	function validateRequiredFields(inputs) {
		for(let name in inputs) {
			if(inputs[name].value.length === 0) inputs[name].setValidationMessage('To pole jest wymagane');
		}
	}
	function validateForm(inputs) {
		if(inputs.email !== undefined && inputs.email.value.length > 0 && !validatorFuncs.email(inputs.email.value)) {
			inputs.email.setValidationMessage('Nieprawidłowy adres e-mail');
		}
		if(inputs.pesel !== undefined && inputs.pesel.value.length > 0 && !validatorFuncs.pesel(inputs.pesel.value)) {
			inputs.pesel.setValidationMessage('Nieprawidłowy PESEL');
		}
		if(inputs.postalCode !== undefined && inputs.postalCode.value.length > 0 && !validatorFuncs.postalCode(inputs.postalCode.value)) {
			inputs.postalCode.setValidationMessage('Nieprawidłowy kod pocztowy');
		}
	}
	document.getElementById('signUpForm').addEventListener('submit', function (e) {
		e.preventDefault();

		let mappedInputs = mapInputs(getInputs());
		clearInvalidStates(mappedInputs);
		validateForm(mappedInputs);
		validateRequiredFields(mappedInputs);
	});
	(function () {
		let inputs = getInputs();
		inputs.forEach((input) => {
			input.addEventListener('blur', function () {
				let mapped = mapInputs([input]);
				mapped[input.name].setInvalidState(false);
				validateForm(mapped);
			});
		});
	})();
	function getInputs() {
		return Array.from(document.getElementsByTagName('input'))
			.filter(input => input.type !== 'submit');
	}
	function mapInputs(inputs) {
		return inputs.map((input) => {
			return {
				name: input.name,
				value: input.value,
				parent: input.parentElement,
				setInvalidState: function (state) {
					this.parent.className = this.parent.className.replace("invalid", "");
					if(state) this.parent.className += " invalid";
				},
				setValidationMessage: function (message, setInvalidState = true) {
					this.parent.querySelector('.validation-message').innerHTML = message;
					if(setInvalidState) this.setInvalidState(true);
				}
			};
		})
		.reduce((prev, current) => {
			prev[current.name] = { value: current.value, parent: current.parent, setInvalidState: current.setInvalidState, setValidationMessage: current.setValidationMessage };
			return prev;
		}, {});
	}
})();