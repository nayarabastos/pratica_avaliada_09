import axios from "axios"
import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react"
import { NumericFormat } from "react-number-format"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { AuthContext } from "../../../contexts/AuthContext"
import type Categoria from "../../../models/Categoria"
import type Produto from "../../../models/Produto"
import { atualizar, buscar, cadastrar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"

function FormProduto() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { usuario, handleLogout } = useContext(AuthContext)
	const token = usuario.token
	const [produto, setProduto] = useState<Produto>({ nome: "", preco: 0, foto: "", categoria: {} as Categoria } as Produto)
	const [categorias, setCategorias] = useState<Categoria[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (token === "") {
			ToastAlerta("Você precisa estar logado!", "info")
			navigate("/")
			return
		}

		Promise.all([
			buscar("/categorias", setCategorias, { headers: { Authorization: token } }),
			id ? buscar(`/produtos/${id}`, setProduto, { headers: { Authorization: token } }) : Promise.resolve(),
		]).catch((error) => {
			if (axios.isAxiosError(error)) {
				ToastAlerta(`Erro ao carregar dados do produto (${error.response?.status})`, "error")
				if (error.response?.status === 401) handleLogout()
			}
		})
	}, [id, token])

	function atualizarEstado(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value } = event.target
		setProduto((atual) => ({ ...atual, [name]: name === "categoria" ? categorias.find((categoria) => categoria.id === Number(value)) : value }))
	}

	async function gerarNovoProduto(event: SyntheticEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)
		try {
			const requisicao = id ? atualizar : cadastrar
			await requisicao("/produtos", produto, setProduto, { headers: { Authorization: token } })
			ToastAlerta(id ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!", "success")
			navigate("/produtos")
		} catch (error) {
			if (axios.isAxiosError(error)) {
				ToastAlerta(`Erro ao salvar produto (${error.response?.status})`, "error")
				if (error.response?.status === 401) handleLogout()
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container flex flex-col items-center justify-center mx-auto my-4  md:h-[81vh] px-4 py-12">
			<h1 className="text-3xl md:text-4xl text-center mb-6">
				{id ? "Editar Produto" : "Cadastrar Produto"}
			</h1>

			<form className="w-full max-w-lg flex flex-col gap-4" onSubmit={gerarNovoProduto}>
				<div className="flex flex-col gap-2">
					<label htmlFor="nome" className="font-medium">
						Nome do Produto
					</label>
					<input
						type="text"
						placeholder="Insira aqui o nome do Produto"
						name="nome"
						id="nome"
						value={produto.nome}
						onChange={atualizarEstado}
						required
						className="border-2 border-slate-700 rounded p-2 bg-white text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="preco" className="font-medium">
						Preço (R$)
					</label>
					<NumericFormat
						id="preco"
						name="preco"
						thousandSeparator="."
						decimalSeparator=","
						decimalScale={2}
						fixedDecimalScale
						allowNegative={false}
						prefix="R$ "
						className="border-2 border-slate-700 rounded p-2 bg-white text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
						placeholder="R$ 0,00"
						value={produto.preco}
						onValueChange={({ floatValue }) => setProduto((atual) => ({ ...atual, preco: floatValue ?? 0 }))}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="foto" className="font-medium">
						Foto do Produto
					</label>
					<input
						type="text"
						placeholder="Adicione aqui a URL da foto do Produto"
						name="foto"
						id="foto"
						value={produto.foto}
						onChange={atualizarEstado}
						required
						className="border-2 border-slate-700 rounded p-2 bg-white text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="categoria" className="font-medium">
						Categoria do Produto
					</label>
					<select
						name="categoria"
						id="categoria"
						value={produto.categoria?.id ?? ""}
						onChange={atualizarEstado}
						required
						className="p-2 bg-white border-2 rounded border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
					>
						<option value="" disabled>
							Selecione uma Categoria
						</option>
						{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.tipo}</option>)}
					</select>
				</div>

				<button
					className="rounded text-slate-100 bg-slate-400 hover:bg-slate-800 
									w-full py-2 mt-2 flex justify-center items-center text-base transition-colors"
					type="submit"
				>
					{isLoading ? <ClipLoader color="#ffffff" size={24} /> : <span>{id ? "Atualizar" : "Cadastrar"}</span>}
				</button>
			</form>
		</div>
	)
}

export default FormProduto
