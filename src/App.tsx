import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/carrinho/cart/Cart";
import DeletarCategoria from "./components/categorias/deletarcategorias/DeletarCategoria";
import FormCategoria from "./components/categorias/formcategoria/FormCategoria";
import ListarCategorias from "./components/categorias/listacategorias/ListaCategorias";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import DeletarProduto from "./components/produtos/deletarproduto/DeletarProduto";
import FormProduto from "./components/produtos/formproduto/FormProduto";
import ListarProdutos from "./components/produtos/listaprodutos/ListaProdutos";
import Cadastro from "./pages/cadastro/Cadastro";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Perfil from "./pages/perfil/Perfil";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navbar />
				<div className="min-h-[80vh]">
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/home" element={<Home />} />
						<Route path="/cadastro" element={<Cadastro />} />
						<Route path="/categorias" element={<ListarCategorias />} />
						<Route path="/cadastrarcategoria" element={<FormCategoria />} />
						<Route path="/editarcategoria/:id" element={<FormCategoria />} />
						<Route path="/deletarcategoria/:id" element={<DeletarCategoria />} />
					</Routes>
				</div>
				<Footer />
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
