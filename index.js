const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT || 80;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
})


app.listen(port, (err, res) => {
    
    if(err) {
        console.log(err);
    } else {
        console.log(`Server listening on ${port}`);
    }
});
