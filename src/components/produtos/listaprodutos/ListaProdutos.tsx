import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Produto from "../../../models/Produto";
import { buscar } from "../../../services/Service";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import CardProdutos from '../cardprodutos/CardProduto';

function ListaProdutos() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const { usuario, handleLogout } = useContext(AuthContext)
	const token = usuario.token
	const [produtos, setProdutos] = useState<Produto[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const termoBusca = searchParams.get("busca")?.trim().toLocaleLowerCase("pt-BR") ?? ""
	const produtosFiltrados = produtos.filter((produto) => {
		if (!termoBusca) return true
		return produto.nome.toLocaleLowerCase("pt-BR").includes(termoBusca)
			|| produto.categoria.tipo.toLocaleLowerCase("pt-BR").includes(termoBusca)
	})

	useEffect(() => {
		if (token === "") {
			ToastAlerta("Você precisa estar logado!", "info")
			navigate("/")
			return
		}

		setIsLoading(true)
		buscar("/produtos", setProdutos, { headers: { Authorization: token } })
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					ToastAlerta(`Erro ao buscar os produtos (${error.response?.status})`, "error")
					if (error.response?.status === 401) handleLogout()
				}
			})
			.finally(() => setIsLoading(false))
	}, [token])

	return (
		<>
			{isLoading && <div className="flex justify-center w-full my-8"><SyncLoader color="#312e81" size={24} /></div>}
			<div className="flex justify-center mt-6 md:mt-8">
				<div className="container flex flex-col m-2 md:my-0">
					<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 mb-4 md:mb-0 p-2 md:p-4">
						{!isLoading && produtosFiltrados.map((produto) => <CardProdutos key={produto.id} produto={produto} />)}
					</div>
					{!isLoading && produtosFiltrados.length === 0 && (
						<p className="col-span-full py-8 text-center text-lg text-slate-600">
							Nenhum produto encontrado para essa busca.
						</p>
					)}
				</div>
			</div>
		</>
	)
}

export default ListaProdutos
