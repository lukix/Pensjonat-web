const Http = {
	ajax: function (url, method, data, options) {
		let defaultOptions = {
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};
		if(options === undefined)
			options = {};
		options.method = method;
		options.body = typeof data === 'string' ? data : JSON.stringify(data);

		return fetch(url, Object.assign(defaultOptions, options));
	},
	get: function (url, data, options) {
		return this.ajax(url, 'GET', data, options);
	},
	post: function (url, data, options) {
		return this.ajax(url, 'POST', data, options);
	},
	put: function (url, data, options) {
		return this.ajax(url, 'PUT', data, options);
	},
	delete: function (url, data, options) {
		return this.ajax(url, 'DELETE', data, options);
	},
};