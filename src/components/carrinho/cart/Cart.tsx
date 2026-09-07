import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../../../contexts/CartContext"
import CardCart from "../cardcart/CardCart"
import { ShoppingCartIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import { ToastAlerta } from "../../../utils/ToastAlerta"
 
function Cart() {
  const navigate = useNavigate()
 
  const { usuario } = useContext(AuthContext)
  const token = usuario.token
 
  const { items, quantidadeItems, valorTotal, limparCart } = useContext(CartContext)
 
  useEffect(() => {
    if (token === "") {
      ToastAlerta("Você precisa estar logado!", "info")
      navigate("/")
      return
    }
  }, [token, navigate])
 
  return (
    <main className="grow w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-12 md:pb-16 flex flex-col gap-8">
      {/* Cabeçalho */}
      <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
        Carrinho de Compras
      </h1>
 
      {/* Carrinho Vazio */}
      {items.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center flex flex-col items-center">
          <ShoppingCartIcon size={64} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-slate-500 mb-6">
            Adicione produtos para começar suas compras!
          </p>
          <Link
            to="/produtos"
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver produtos
          </Link>
        </div>
      )}
 
      {/* Layout Principal: Lista de Produtos + Resumo */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Lista de Produtos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((produto) => (
              <CardCart key={produto.id} item={produto} />
            ))}
          </div>
 
          {/* Coluna Direita: Resumo da Compra */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-4 pb-4 border-b border-slate-200">
                Resumo da Compra
              </h2>
 
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Produtos ({quantidadeItems})</span>
                  <span className="font-semibold text-slate-800">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorTotal)}
                  </span>
                </div>
 
                <div className="flex justify-between text-slate-600">
                  <span>Frete</span>
                  <span className="font-semibold text-emerald-600">Grátis</span>
                </div>
 
                <div className="flex justify-between text-slate-600">
                  <span>Desconto</span>
                  <span className="font-semibold text-slate-800">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(0.0)}
                  </span>
                </div>
              </div>
 
              <div className="flex justify-between items-center text-lg font-bold py-4 mb-6 border-t border-slate-200">
                <span className="text-slate-800">Total</span>
                <span className="text-2xl text-blue-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(valorTotal)}
                </span>
              </div>
 
              {/* Formas de Pagamento */}
              <div className="mb-4 pb-4 border-b border-slate-200">
                <p className="text-sm text-slate-600 mb-3">Formas de pagamento:</p>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <div className="flex items-center justify-center basis-[30%] sm:basis-0 sm:flex-1 h-10 sm:h-12 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                    <img
                      src="https://ik.imagekit.io/vzr6ryejm/ecommerce/credit-card.png"
                      alt="Logo Cartão de Crédito"
                      className="max-w-[70%] max-h-[70%] object-contain"
                    ></img>
                  </div>
                  <div className="flex items-center justify-center gap-1 basis-[30%] sm:basis-0 sm:flex-1 h-10 sm:h-12 bg-slate-100 rounded-lg text-[10px] sm:text-xs font-semibold text-slate-700">
                    <img
                      src="https://ik.imagekit.io/vzr6ryejm/ecommerce/pix-svgrepo-com.svg"
                      alt="Logo do PIX"
                      className="max-h-[45%] object-contain"
                    ></img>
                    <span>PIX</span>
                  </div>
                  <div className="flex items-center justify-center basis-[30%] sm:basis-0 sm:flex-1 h-10 sm:h-12 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                    <img
                      src="https://ik.imagekit.io/vzr6ryejm/ecommerce/google-pay-svgrepo-com.svg"
                      alt="Logo do Google Pay"
                      className="max-w-[70%] max-h-[70%] object-contain"
                    ></img>
                  </div>
                  <div className="flex items-center justify-center basis-[30%] sm:basis-0 sm:flex-1 h-10 sm:h-12 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                    <img
                      src="https://ik.imagekit.io/vzr6ryejm/ecommerce/apple-pay-svgrepo-com.svg"
                      alt="Logo do Apple Pay"
                      className="max-w-[70%] max-h-[70%] object-contain"
                    ></img>
                  </div>
                  <div className="flex items-center justify-center basis-[30%] sm:basis-0 sm:flex-1 h-10 sm:h-12 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                    <img
                      src="https://ik.imagekit.io/vzr6ryejm/ecommerce/boleto-logo.svg"
                      alt="Logo do Boleto Bancáriao"
                      className="max-w-[70%] max-h-[70%] object-contain"
                    ></img>
                  </div>
                </div>
              </div>
 
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                type="button"
                onClick={() => {
                  limparCart()
                  ToastAlerta("Compra finalizada com sucesso!", "success")
                }}
              >
                Finalizar Compra
              </button>
 
              <p className="text-xs text-slate-500 text-center mt-4">
                Frete grátis para todo o Brasil
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
 
export default Cart