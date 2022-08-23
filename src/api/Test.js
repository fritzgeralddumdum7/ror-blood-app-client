import API from './base';

const Test = {
    getTest: async () => {
        const options = {
            method: 'GET',
            url: '/test'
        }

        return await API.request(options);
    }
}

export default Test;
