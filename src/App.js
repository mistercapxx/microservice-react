import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);

  ///registration of user using Register component
  const handleRegister =  async (username, password) => {
    console.log("Attempting to register with:", username, password);
    try{
      const response = await axios.post("http://localhost:4000/register",{
        ///передаем аргументы как обьект, он теперь в req.body так и запишется, как ключ, а значением будут данные что мы вводили в поля.
        username,
        password,
      });
      console.log('User registered',response.data);
    }catch(error)
    {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
  }

  ///login via auth-service
  ///указываем 2 аргумента полученные из пропсов
  const handleLogin = async (username, password) => {
    const response = await axios.post("http://localhost:4000/login", {
      ///вкладываем их в тело запроса
      username,
      password,
    });
    console.log("Токен:", response.data.token); 
    ///токен пришел в res вконце работы запроса, теперь можем его в ответе достать и посмотреть и засетать
    setToken(response.data.token);
  };
  ///get products via service
  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:5001/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    ///получаем массив с 2 продуктами и сетаем их
    setProducts(response.data);
  };
  return (
    <Router>
      <div>
        <nav>
        <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/products">Products</Link>
        </nav>

        <Routes>
        <Route path="/register" element={<Register onRegister={handleRegister}/>}/>
          <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
          <Route path="/products" element={<ProductList products={products} fetchProducts={fetchProducts}/>}/>
        </Routes>
      </div>
    </Router>
  );

function Register({onRegister}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const initRegister = async (e) => {
    e.preventDefault();
    await onRegister(username,password);
  }

  return (
    <form onSubmit={initRegister}>
<div>
  <label>Name</label>
  <input
  value={username}
  onChange={(e)=>setUsername(e.target.value)}/>
  <label>Password</label>
 <input
  value={password}
  onChange={(e)=>setPassword(e.target.value)}/>
</div>
<button type="submit">Register</button>
    </form>
  )
}
  function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
        await onLogin(username, password);
   
    };
    return (
        <form onSubmit={handleSubmit}>
          <input
          value={username}
          onChange={(e)=> setUsername(e.target.value)}
          />
            <input
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          />
<button type="submit">Login</button>
        </form>

    );
  }
  function ProductList({ products, fetchProducts }) {

    ///если на экране пусто, то вызовется функция и добавятся все продукты
    useEffect(() => {
      if (products.length === 0) {
        fetchProducts();
      }
    }, [products, fetchProducts]);
    return (
      <div>
        <h1>Product List</h1>
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name} - {product.price}$</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
