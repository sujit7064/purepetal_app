import axios from "axios";

const createConfig = (token, contentType = 'multipart/form-data') => {
    console.log('Token being passed to createConfig:', token); // Ensure this is correct
    return {
        headers: {
            'Content-Type': contentType,
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    };
};

export const axiosget = async (url, token, callback) => {
    token = token.replace(/^"|"$/g, '');
    console.log('URL:', url);
    console.log('Token:', token);
    const config = createConfig(token, 'application/json');
    console.log('Config:', config);
    await axios.get(url, config)
        .then((resp) => {
            // console.log('Response:', resp.data);
            callback(resp.data);
        })
        .catch((error) => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });
};

export const axiospost = async (url, params, token, callback) => {
    console.log(url);
    console.log(params);
    const config = createConfig(token, 'multipart/form-data');
    axios.post(url, params, config)
        .then((resp) => { console.log(resp.data); callback(resp.data); })
        .catch((error) => { console.log(error); });
}

export const axiospostjson = async (url, params, token, callback) => {
    console.log(url);
    console.log(params);
    const config = createConfig(token, 'application/json');
    axios.post(url, params, config)
        .then((resp) => { console.log(resp.data, "from axios"); callback(resp.data); })
        .catch((error) => { console.error('Error:', error.response ? error.response.data : error.message); });
}
