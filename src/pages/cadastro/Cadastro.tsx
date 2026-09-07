import axios from "axios";
import { useState, useEffect, type SyntheticEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type Usuario from "../../models/Usuario";
import { cadastrarUsuario } from "../../services/Service";
import { ToastAlerta } from "../../utils/ToastAlerta";
import { ClipLoader } from "react-spinners";

function Cadastro() {


	// Objeto responsável redirecionar o usuário para uma outra rota
	const navigate = useNavigate();

	// Estado responsável por controlar o loader (animação de carregamento)
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Estado responsável por guardar os dados do usuário que serão
	// persistidos (gravados) no banoc de dados da minha API
	const [usuario, setUsuario] = useState<Usuario>({
		id: 0,
		nome: '',
		usuario: '',
		senha: '',
		foto: '',
		dataNascimento: '',
	})

	// Estado responsável por guardar a senha digitada no campo confirmar senha
	const [confirmarSenha, setConfirmarSenha] = useState<string>('');

	// Tratar do efeito colateral do sucesso do cadastro
	// Redirecionar para a página de login
	useEffect(() => {
		if (usuario.id !== 0) {
			retornar();
		}
	}, [usuario])

	// Função responsável por atualizar  o estado usuario
	function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
		setUsuario({
			...usuario,
			[e.target.name]: e.target.value,
		})
	}

	// Função responsável por atualizar o estado confirmarSenha
	function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
		setConfirmarSenha(e.target.value);
	}

	function temIdadeMinima(dataNascimento: string) {
		const nascimento = new Date(`${dataNascimento}T00:00:00`)
		const hoje = new Date()
		const dataLimite = new Date(
			hoje.getFullYear() - 18,
			hoje.getMonth(),
			hoje.getDate(),
		)

		return nascimento <= dataLimite
	}


	// Função responsável por enviar uma requisição do tipo POST
	// com oa dados do usuário (estado usuario)
	async function cadastrarNovoUsuario(e: SyntheticEvent<HTMLFormElement>) {

		// Impedet o envio automático do formulário
		e.preventDefault();

		// Validção da senha digitada
		if (confirmarSenha !== usuario.senha || usuario.senha.length < 8) {
			ToastAlerta("Senhas não conferem e/ou não possuem pelo menos 8 caracteres", "warning");
			setUsuario({ ...usuario, senha: '' });
			setConfirmarSenha('');
			return;
		}

		if (!usuario.dataNascimento || !temIdadeMinima(usuario.dataNascimento)) {
			ToastAlerta("É necessário ter pelo menos 18 anos para se cadastrar.", "warning")
			return
		}

		setIsLoading(true);

		try {
			await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario);
			ToastAlerta("Usuário cadastrado com sucesso!", "success");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				ToastAlerta(`Erro ao cadastrar o usuário (${error.response?.status})`, "error")
				return;
			}
		} finally {
			setIsLoading(false);
		}

	}

	// Função mpara retornar para a página de login
	function retornar() {
		navigate('/');
	}



	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen place-items-center font-bold">
				<div
					className="bg-[url('https://ik.imagekit.io/vzr6ryejm/games/fundo_03.jpg?updatedAt=1714988179386')] lg:block hidden bg-no-repeat 
                    w-full min-h-screen bg-cover bg-center"
				></div>
				<form
					className="flex justify-center items-center flex-col w-full max-w-md px-6 sm:px-8 py-10 lg:py-3 gap-3"
					onSubmit={cadastrarNovoUsuario}
				>
					<h2 className="text-slate-900 text-3xl sm:text-4xl lg:text-5xl text-center">Cadastrar</h2>

					<div className="flex flex-col w-full">
						<label htmlFor="nome">Nome</label>
						<input
							type="text"
							id="nome"
							name="nome"
							placeholder="Nome"
							className="border-2 border-slate-700 rounded p-2 w-full"
							required
							value={usuario.nome}
							onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="usuario">Usuario</label>
						<input
							type="email"
							id="usuario"
							name="usuario"
							placeholder="Usuario"
							className="border-2 border-slate-700 rounded p-2 w-full"
							required
							value={usuario.usuario}
							onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="foto">
							Foto (URL){" "}
							<span className="text-slate-400 font-normal">opcional</span>
						</label>
						<input
							id="foto"
							name="foto"
							type="text"
							className="border-2 border-slate-700 rounded p-2 w-full"
							placeholder="https://..."
							value={usuario.foto}
							onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="dataNascimento">Data de Nascimento</label>
						<input
							type="date"
							id="dataNascimento"
							name="dataNascimento"
							className="border-2 border-slate-700 rounded p-2 w-full"
							required
							value={usuario.dataNascimento}
							onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="senha">Senha</label>
						<input
							type="password"
							id="senha"
							name="senha"
							placeholder="Senha"
							className="border-2 border-slate-700 rounded p-2 w-full"
							required
							value={usuario.senha}
							onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="confirmarSenha">Confirmar Senha</label>
						<input
							type="password"
							id="confirmarSenha"
							name="confirmarSenha"
							placeholder="Confirmar Senha"
							className="border-2 border-slate-700 rounded p-2 w-full"
							value={confirmarSenha}
							onChange={(e: ChangeEvent<HTMLInputElement>) => handleConfirmarSenha(e)}
						/>
					</div>

					<div className="flex flex-col sm:flex-row justify-around w-full gap-3 sm:gap-8">
						<button
							type="button"
							className="rounded text-white bg-red-400 hover:bg-red-700 w-full sm:w-1/2 py-2"
							onClick={retornar}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="rounded text-white bg-teal-500 hover:bg-teal-700 w-full sm:w-1/2 py-2 flex justify-center"
						>
							{
								isLoading ? (
									<ClipLoader
										color="#ffffff"
										size={24}
									/>
								) : (
									<span>Cadastrar</span>
								)
							}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default Cadastro
