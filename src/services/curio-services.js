const axios = require('axios');
/*
body
{
    "description": "Lampada do posto queimada ",
    "address": "depois do motel class",
    "reporterUsername": "557599820000",
    "longitude": "-12.1468335",
    "latitude": "-38.3975976",
    "category": "eletrico"
}
*/

module.exports = {
    async saveProblem({ description, address, reporterUsername, longitude, latitude, category }, api_key) {
        
        const data = {
            description,
            address,
            reporterUsername,
            longitude,
            latitude,
            category
        }

        console.log('[saveProblem] data', data);

        const url = `http://curiocity.duckdns.org:8080/api/v1/problems`
        const config = {
            method: 'post',
            url: url,
            headers: {
                'api-key': api_key,
                'Content-Type': 'application/json'
            },
            data
        };

        try {
            const response = await axios(config);
            console.log('[saveProblem] response -> ', response.data);
            return response.data;
        } catch(errors) {
            console.log('Erro ao salvar registro Errors->', errors);
            return 'error_api';
        }
        
    }
}

