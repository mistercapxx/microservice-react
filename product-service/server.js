const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001 ;
app.use(express.json());
app.use(cors());




app.get('/products', (req,res) => {
    //тут поскольку гет, сразу получаем рес
    res.json([{id:1,name:'Tomato',price:10}, {id:2,name:'Lettuce',price:20}]);

});





app.listen(PORT,() => {
    console.log(`Product service is running on port ${PORT}`);
});