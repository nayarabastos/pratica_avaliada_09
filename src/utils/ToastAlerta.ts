import { toast, type TypeOptions } from "react-toastify"

export function ToastAlerta(mensagem: string, tipo: TypeOptions = "default") {
  toast(mensagem, { type: tipo })
}
