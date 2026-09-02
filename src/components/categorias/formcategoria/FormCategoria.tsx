import axios from "axios"
import { useState, useContext, useEffect, type ChangeEvent, type SyntheticEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import { buscar, atualizar, cadastrar } from "../../../services/service"
import type Categoria from "../../../models/Categoria"
import { ClipLoader } from "react-spinners"

function FormCategoria() {

  // Objeto responsável redirecionar o tema para uma outra rota
  const navigate = useNavigate()

  // Estado responsável por controlar o loader (animação de carregamento)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Estado responsável por armazenar os dados do tema que será persistido no Backend (API)
  const [categoria, setCategoria] = useState<Categoria>({} as Categoria)

  // Consumo da Context para obter os dados do Categoria autenticado (estado usuario)
  // e a função handleLogout para efetuar logout caso o token seja inválido
  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  // Acessar o parâmetro da rota (id do Categoria)
  const { id } = useParams<{ id: string }>()

  // Função responsável por buscar um Categoria pelo ID no Backend (API)
  async function buscarCategoriaPorId() {
    try {
      await buscar(`/categorias/${id}`, setCategoria, {
        headers: { Authorization: token },
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Erro ao buscar categoria (${error.response?.status})`)
        if (error.response?.status === 401) {
          handleLogout()
        }
      }
    }
  }

  // useEffect para monitorar o id (parâmetro da rota)
  useEffect(() => {
    if (id !== undefined) {
      buscarCategoriaPorId()
    }
  }, [id])

  // useEffect para monitorar o token
  useEffect(() => {
    if (token === "") {
      alert("Você precisa estar logado!")
      navigate("/")
    }
  }, [token])

  // Função responsável por atualizar  o estado tema
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    })
  }

  // Função responsável por enviar uma requisição do tipo POST ou PUT
  // com oa dados do tema (estado tema)
  async function gerarNovoCategoria(e: SyntheticEvent<HTMLFormElement>) {
    // Impede o envio automático do formulário
    e.preventDefault()

    setIsLoading(true)

    if (id !== undefined) {
      try {
        await atualizar(`/categorias`, categoria, setCategoria, {
          headers: { Authorization: token },
        })
        alert("Categoria atualizada com sucesso!")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(`Erro ao atualizar a Categoria (${error.response?.status})`)
          if (error.response?.status === 401) {
            handleLogout()
          }
        }
        return
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        await cadastrar(`/categorias`, categoria, setCategoria, {
          headers: { Authorization: token },
        })
        alert("Categoria cadastrada com sucesso!")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(`Erro ao cadastrar categoria (${error.response?.status})`)
          if (error.response?.status === 401) {
            handleLogout()
          }
        }
        return
      } finally {
        setIsLoading(false)
      }
    }

    retornar()
  }

  function retornar() {
    navigate("/categorias")
  }



  return (
    <div className="container flex flex-col items-center justify-center px-2 pt-4 mx-auto">
      <h1 className="my-8 text-3xl text-center md:text-4xl">
        {id === undefined ? "Cadastrar" : "Editar"}
        Cadastrar Categoria
      </h1>

      <form className="flex flex-col w-full max-w-md gap-4 px-2 md:max-w-1/2" onSubmit={gerarNovoCategoria}>
        <div className="flex flex-col gap-2 ">
          <label htmlFor="tipo">Categoria</label>
          <input
            type="text"
            placeholder="Categoria"
            id='tipo'
            name='tipo'
            className="p-2 text-base bg-white border-2 rounded border-slate-700 utral-800 md:text-lg"
            required
            value={categoria.tipo}
						onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
          />
        </div>
        <button
          className="flex justify-center w-full py-2 mx-auto text-base rounded text-slate-100 bg-slate-400 hover:bg-slate-800 md:w-1/2 md:text-lg"
          type="submit"
        >
          {isLoading ? (
						<ClipLoader color="#ffffff" size={24} />
					) : (
						<span>{id === undefined ? "Cadastrar" : "Atualizar"}</span>
					)}
        </button>
      </form>
    </div>
  );
}

export default FormCategoria;
