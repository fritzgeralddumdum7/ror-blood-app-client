import API from './base';

const CityMunicipality = {
	getCityMunicipalities: async (id) => {
		const options = {
			method: 'GET',
			url: '/city_municipalities',
			params: {
				province_id: id
			}
		}
		return await API.request(options);
	}
}

export default CityMunicipality;
