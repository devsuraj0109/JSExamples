const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function uploadFile() {
    const filePath = path.join(__dirname, '16738 RATE copy.pdf');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error('Error: File "16738 RATE copy.pdf" not found in the current directory.');
        return;
    }

    // Create headers
    const myHeaders = {
        'accept': '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'origin': 'https://app.awako.ai',
        'priority': 'u=1, i',
        'referer': 'https://app.awako.ai/',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    };

    // Create form data
    const formdata = new FormData();
    formdata.append('files[]', fs.createReadStream(filePath), '16738 RATE copy.pdf');
    formdata.append('auth-key', 'eLq7AagF2bD8qYYk2TaoqNu5tj9uxJ45');

    // Request options
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    try {
        const response = await fetch('https://prime.etruckingsoft.com/multiple-files-upload', requestOptions);
        const result = await response.text();
        console.log('Response:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Execute the upload
uploadFile();