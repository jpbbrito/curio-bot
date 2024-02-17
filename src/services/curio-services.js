import axios from 'axios'

export async function saveProblem({ description, address, reporterUsername, reporterName, longitude, latitude, category }, api_key) {

    const data = JSON.stringify({
        description,
        address,
        reporterUsername,
        reporterName,
        longitude,
        latitude,
        category
    });

    console.log('[saveProblem] data', data);

    const url = `${process.env.URL_SERVER_API}/api/v1/problems`
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
    } catch (errors) {
        console.log('Erro ao salvar registro Errors->', errors);
        return 'error_api';
    }

}
export async function saveImageProblem({ uuid, base64, description = ' ' }, api_key) {

    const data = JSON.stringify({
        base64,
        description
    });

    console.log('[saveProblem] data', data);

    const url = `${process.env.URL_SERVER_API}/api/v1/problems/${uuid}/images`
    const config = {
        method: 'post',
        url: url,
        headers: {
            'api-key': api_key,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios(config);
        console.log('[saveImageProblem] response -> ', response.data);
        return response.data;
    } catch (errors) {
        console.log('Erro ao salvar registro Errors->', errors);
        return 'error_api';
    }
}