import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import type Usuario from "../../models/Usuario";
import { buscar } from "../../services/Service";
import { ToastAlerta } from "../../utils/ToastAlerta";

function Perfil() {
  const navigate = useNavigate()
  const { usuario: usuarioAutenticado, handleLogout } = useContext(AuthContext)
  const [usuario, setUsuario] = useState<Usuario>(usuarioAutenticado)

  useEffect(() => {
    if (!usuarioAutenticado.token || usuarioAutenticado.id === 0) {
      ToastAlerta("Você precisa estar logado!", "info")
      navigate("/")
      return
    }

    setUsuario(usuarioAutenticado)
    buscar(`/usuarios/${usuarioAutenticado.id}`, setUsuario, {
      headers: { Authorization: usuarioAutenticado.token },
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        ToastAlerta(`Erro ao carregar o perfil (${error.response?.status})`, "error")
        if (error.response?.status === 401) handleLogout()
      }
    })
  }, [usuarioAutenticado.id, usuarioAutenticado.token])

  const fotoPerfil = usuario.foto || "https://via.placeholder.com/256?text=Perfil"
  const dataNascimento = usuario.dataNascimento
    ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(usuario.dataNascimento))
    : "Não informado"

  return (
    <div className='container mx-auto px-4 sm:px-6 max-w-7xl rounded-2xl overflow-hidden'>
      <img
        className='w-full mt-4 h-40 sm:h-56 md:h-72 object-cover border-b-8 border-white rounded-t-2xl'
        src="https://i.imgur.com/6C49BZQ.jpg"
        alt="Capa do Perfil"
      />

      <div className='rounded-full w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 mx-auto -mt-16 sm:-mt-24 md:-mt-32 border-8 border-white relative z-10 bg-slate-300 flex items-center justify-center'>
        {usuario.foto ? (
          <img
            src={fotoPerfil}
            alt={`Foto de ${usuario.nome}`}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <UserIcon size={64} weight="bold" className="text-slate-600" />
        )}
      </div>

      <div className="relative -mt-12 sm:-mt-16 md:-mt-20 mb-4 min-h-64 flex flex-col gap-1 bg-slate-600 text-white text-base sm:text-xl md:text-2xl items-center justify-center rounded-b-2xl px-4 py-6 text-center">
        <p className="font-bold wrap-break-word">{usuario.nome}</p>
        <p className="text-slate-200 wrap-break-word">{usuario.usuario}</p>
        <p className="text-sm sm:text-base text-slate-300">
          Nascimento: {dataNascimento}
        </p>
      </div>
    </div>
  )
}

export default Perfil
