export function loadJSON(configOrURL) {
    let config;
    if(configOrURL.url) {
        config = configOrURL;
    } else {
        config = {
            url: configOrURL
        };
    }
    if(!config.method) {
        config.method = 'GET';
    }

    return new Promise(function (resolve, reject) {
        let body;
        if(config.body) {
            try {
                body = JSON.stringify(config.body);
            } catch(error) {
                reject('Failed to serialise body to JSON');
                return;
            }
        }

        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function () {
            if (xhr.status < 200 || xhr.status >= 400) {
                reject({
                    message: 'Failed to access "' + config.url + '"',
                    httpStatus: xhr.status,
                    httpStatusText: xhr.statusText,
                    httpResponse: xhr.response
                });
            }
            try {
                const data = xhr.responseText;

                // console

                if(data.length === 0) {
                    resolve(null);
                }
                const json = JSON.parse(data, 'utf-8');
                resolve(json);
            } catch (e) {
                // We got a JSON parse error
                reject('Failed to parse JSON from ' + config.url);
            }
        });
        
        xhr.addEventListener('error', function() {
            reject({
                message: 'Failed to access "' + config.url + '"'
            });
        });

        xhr.open(config.method, config.url);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${config.token}`);

        if(body) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

       
        xhr.send(body);
    });
}