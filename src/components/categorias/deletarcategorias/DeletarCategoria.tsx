import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar, deletar } from "../../../services/Service";
import type Categoria from "../../../models/Categoria";
import { ClipLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function DeletarCategoria() {

    // Objeto responsável redirecionar o tema para uma outra rota
    const navigate = useNavigate();

    // Estado responsável por controlar o loader (animação de carregamento)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Estado responsável por armazenar os dados do tema que será deletado no Backend (API)
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);

    // Consumo da Context para obter os dados do tema autenticado (estado usuario)
    // e a função handleLogout para efetuar logout caso o token seja inválido
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    // Acessar o parâmetro da rota (id do tema)
    const { id } = useParams<{ id: string }>();

    // Função responsável por buscar um tema pelo ID no Backend (API)
    async function buscarCategoriaPorId() {
        try {
            await buscar(`/categorias/${id}`, setCategoria, {
                headers: { Authorization: token },
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                ToastAlerta(`Erro ao buscar a categoria (${error.response?.status})`, "error")
                if (error.response?.status === 401) {
                    handleLogout()
                }
            }
        }
    }

    // useEffect para monitorar o id (parâmetro da rota)
    useEffect(() => {
        if (id !== undefined) {
            buscarCategoriaPorId();
        }
    }, [id])


    // useEffect para monitorar o token
    useEffect(() => {
        if (token === '') {
            ToastAlerta("Você precisa estar logado!", "info");
            navigate('/');
        }
    }, [token])

    // Função responsável por deletar um tema pelo ID no Backend (API)
    async function deletarCategoria() {

        setIsLoading(true);

        try {

            await deletar(`/categorias/${id}`, {
                headers: { Authorization: token }
            })

            ToastAlerta("Categoria deletada com sucesso!", "success")

        } catch (error) {
            if (axios.isAxiosError(error)) {
                ToastAlerta(`Erro ao deletar categoria (${error.response?.status})`, "error");
                if (error.response?.status === 401) {
                    handleLogout();
                }
            }
        } finally {
            setIsLoading(false);
        }

        retornar();
    }

    function retornar() {
        navigate("/categorias");
    }

    return (
        <div className='container w-full max-w-md px-4 pt-4 mx-auto md:pt-6'>
            <h1 className='py-4 text-3xl text-center md:text-4xl'>Deletar Categoria</h1>
            <p className='mb-4 text-base font-semibold text-center md:text-lg'>
                Você tem certeza de que deseja apagar a categoria a seguir?</p>
            <div className='flex flex-col justify-between overflow-hidden border rounded-2xl'>
                <header
                    className='px-4 py-2 text-lg font-bold text-white md:px-6 bg-slate-600 md:text-2xl'>
                    Categoria
                </header>
                <p className='h-full p-4 text-xl bg-white md:p-8 md:text-3xl'>{categoria.tipo}</p>
                <div className="flex flex-row">
                    <button
                        className='w-full py-2 text-base bg-red-400 text-slate-100 hover:bg-red-600 md:text-lg' 
                        onClick={retornar}
                    >
                        Não
                    </button>
                    <button
                        className='flex items-center justify-center w-full text-base bg-teal-600 text-slate-100 hover:bg-teal-700 md:text-lg'
                        onClick={deletarCategoria}
                    >
                        {
                isLoading ? (
                      <ClipLoader
                        color="#ffffff"
                        size={24}
                      />
                  ):(
                    <span>Sim</span>
                  )
                }
                    </button>
                </div>
            </div>
        </div>
    )
}
export default DeletarCategoria
