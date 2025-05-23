const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

app.get('/queue-browse', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const { queueName, key, value } = req.query; // Extract query parameters
    const batchFilePath = path.join(__dirname, 'solace-job.bat');
    const outputFilePath = path.join(__dirname, 'q_content.data');

    // Construct the command to execute the batch file with parameters
    const command = `cmd.exe /c ${batchFilePath} ${queueName || ''} ${key || ''} ${value || ''}`;

    //exec(`"${batchFilePath}"`, (error, stdout, stderr) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to run batch file' });
        }
        
        fs.readFile(outputFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file: ${err}`);
                return res.status(500).json({ error: 'Failed to read output file' });
            }

            
            res.end(data);
        });
    });
});

app.get('/queue-list', (req, res) => {

    if (req.method === 'GET' && req.url === '/queue-list') {
        const options = {
            hostname: 'mr-connection-qzk92nm2y9z.messaging.solace.cloud',
            port: '943',
            path: '/SEMP/v2/config/msgVpns/btp_is_em/queues',
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('mission-control-manager:b9ofhfr9l0s3saau1pj7vp2vcm').toString('base64')
            }
        };
    const https = require('https');
    const apiRequest = https.request(options, (apiResponse) => {
        let data = '';
        apiResponse.on('data', (chunk) => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            try {
                const jsonObject = JSON.parse(data);
                const jsonArray = jsonObject.data;
                const newList = jsonArray.map(item => ({
                    queueName: item.queueName
                }));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newList));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error processing data');
            }
        });
    }).on('error', (error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(error.message + 'Error calling API');
    });

    apiRequest.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});