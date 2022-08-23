import API from './base';

const Organization = {
	getOrganizations: async () => {
		const options = {
			method: 'GET',
			url: '/organizations'
		}
		return await API.request(options);
	},
	getSpecificOrganization: async (id) => {
		const options = {
			method: 'GET',
			url: `/organizations/${id}`,			
		}
		return await API.request(options);
	},
	create: async (payload) => {
		const options = {
			method: 'POST',
			url: '/organizations',
			data: payload
		};

		return await API.request(options);
	},
	update: async (id, payload) => {
		const options = {
			method: 'PATCH',
			url: `/organizations/${id}`,
			data: payload
		};

		return await API.request(options);
	},

}

export default Organization;