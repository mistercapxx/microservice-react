const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


const users = [];

///когда я отправляю POST-запрос на http://localhost:4000/register, это соответствует следующему маршруту
//в req попадет наш 2 аргумент от аксиоса из функции компонента App 

app.post('/register', async(req,res) => {
    //в app.post попадем только после отработки функции handleRegister
    console.log('Received a registration request');
    console.log('Request Body:', req.body);
    ///в консольке мы увидим нормальные параметры благодаря express.json();
    ///извлекаем из тела запроса 2 параметра что получили при вводе инпутов в регистрации (и вложили 2 параметром как тело запроса)
    const {username,password} = req.body;
    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }
       ///bcrypt - либа для хеширования пароля
    const hashedPassword = await bcrypt.hash(password,10);
    users.push({username,password:hashedPassword});
    console.log('User successfully registered, sending response...');
    res.status(201).send('User registered');
});
//// console.log('Request Headers:', req.headers); можно было б и так вывести вместе с req.body, если бы
//в функции handleRegister во второй аргумент вложил headers с какими данными внутри



///alternative way if i will use query parameters in url and type there info, not using axios POST.
// app.get('/register', (req, res) => {
    //     console.log('Query Params:', req.query); 
//     const { username, password } = req.query;
//     res.send(`User registered with username: ${username} and password: ${password}`);
// });

app.post('/login',async(req,res)=> {
    console.log('Request Body:', req.body); 
    const {username,password} = req.body;

    ///то что раньше в логин записывал как username, сейчас находим совпадения в юзере
    ///в юзере у нас уже вложен логин и захешированый пароль
    ///ищем совпадает ли username при регистрации = с тем что я ввожу в логин
    ///юзернейм что я вложил в тело запроса в функции, при запросе на логин, теперь сравниваю с тем что я пушил в массив users при регистрации (юзернейм и пароль) 
   
    const user = users.find(user=>user.username===username);

    ///проверяем есть ли такой юзер после find или сравнивая пароль что ввожу в логин с тем что уже лежит в юзере захешированный
    if(!user|| !(await bcrypt.compare(password,user.password))) {
        return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({username},'secret_key');
    ///response передаст токен как результат
    res.json({token});
});


///все запросы, отправленные через тот же компонент App в функции, на URL http://localhost:4000 будут обрабатываться этим сервером
app.listen(4000, () => console.log('Auth service running on port 4000'));