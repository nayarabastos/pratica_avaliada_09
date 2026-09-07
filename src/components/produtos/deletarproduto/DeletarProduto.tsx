import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { AuthContext } from "../../../contexts/AuthContext"
import type Produto from "../../../models/Produto"
import { buscar, deletar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"

function DeletarProduto() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token
    const [produto, setProduto] = useState<Produto>({} as Produto)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (token === "") {
            ToastAlerta("Você precisa estar logado!", "info")
            navigate("/")
            return
        }

        if (id !== undefined) {
            buscar(`/produtos/${id}`, setProduto, {
                headers: { Authorization: token },
            }).catch((error) => {
                if (axios.isAxiosError(error)) {
                    ToastAlerta(`Erro ao buscar produto (${error.response?.status})`, "error")
                    if (error.response?.status === 401) handleLogout()
                }
            })
        }
    }, [id, token])

    async function deletarProduto() {
        setIsLoading(true)
        try {
            await deletar(`/produtos/${id}`, {
                headers: { Authorization: token },
            })
            ToastAlerta("Produto deletado com sucesso!", "success")
            navigate("/produtos")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                ToastAlerta(`Erro ao deletar produto (${error.response?.status})`, "error")
                if (error.response?.status === 401) handleLogout()
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='container w-full max-w-md mx-auto px-4 pt-4 md:pt-6'>
            <h1 className='text-3xl md:text-4xl text-center py-4'>Deletar Produto</h1>
            <p className='text-center font-semibold mb-4 text-base md:text-lg'>
                Você tem certeza de que deseja apagar o produto a seguir?</p>
            <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
                <header
                    className='py-2 px-4 md:px-6 bg-slate-600 text-white font-bold text-lg md:text-2xl'>
                    Produto
                </header>
                <p className='p-4 md:p-8 text-xl md:text-3xl bg-white h-full'>{produto.nome}</p>
                <div className="flex flex-row">
                    <button
                        className='text-slate-100 bg-red-500 hover:bg-red-700 w-full py-2 text-base md:text-lg'
                        onClick={() => navigate("/produtos")}
                    >
                        Não
                    </button>
                    <button
                        className='w-full text-slate-100 bg-teal-600 hover:bg-teal-800 flex items-center justify-center text-base md:text-lg'
                        onClick={deletarProduto}
                    >
                        {isLoading ? <ClipLoader color="#ffffff" size={24} /> : <span>Sim</span>}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default DeletarProduto
