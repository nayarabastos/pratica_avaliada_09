import { MinusIcon, PlusIcon, TrashSimpleIcon } from "@phosphor-icons/react"
import { useContext } from "react"
import { CartContext, type Items } from "../../../contexts/CartContext"
 
interface CardProdutosProps {
  item: Items
}
 
function CardCart({ item }: CardProdutosProps) {
 
  const { adicionarItem, removerItem, removerProduto } = useContext(CartContext)
 
  return (
    <div className='flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-lg transition-all'>
      {/* Imagem do Produto */}
      <div className='w-24 h-24 sm:w-32 sm:h-32 self-center sm:self-auto shrink-0 bg-slate-100 rounded-lg p-2 flex items-center justify-center'>
        <img
          src={item.foto}
          className='max-h-full max-w-full object-contain'
          alt={item.nome}
        />
      </div>
 
      {/* Informações do Produto */}
      <div className='grow min-w-0 flex flex-col justify-between gap-3'>
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4'>
          <div className='min-w-0'>
            <h3 className='font-semibold text-slate-800 mb-1 line-clamp-2'>
              {item.nome}
            </h3>
            <span className='inline-block text-[11px] font-medium text-blue-700 bg-blue-50 uppercase tracking-wide px-2 py-0.5 rounded-full'>
              {item.categoria?.tipo}
            </span>
          </div>
          <p className='text-lg sm:text-xl font-bold text-slate-800 shrink-0'>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(item.preco)}
          </p>
        </div>
 
        {/* Controles de Quantidade */}
        <div className='flex items-center justify-between gap-3 flex-wrap'>
          <div className='flex items-center gap-2 border border-slate-300 rounded-lg'>
            <button
              className='p-2 hover:bg-slate-100 rounded-l-lg transition-colors'
              onClick={() => removerItem(item.id)}
            >
              <MinusIcon size={18} className="text-slate-600" />
            </button>
 
            <span className='px-4 font-semibold text-slate-800 min-w-10 text-center'>
              {item.quantidade}
            </span>
 
            <button
              className='p-2 hover:bg-slate-100 rounded-r-lg transition-colors'
              onClick={() => adicionarItem(item.id)}
            >
              <PlusIcon size={18} className="text-slate-600" />
            </button>
          </div>
 
          <button
            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
            onClick={() => removerProduto(item.id)}
            title="Remover produto"
          >
            <TrashSimpleIcon size={18} />
          </button>
        </div>
      </div>
 
      {/* Subtotal */}
      <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 sm:min-w-28'>
        <span className='text-xs text-slate-500 uppercase tracking-wide'>Subtotal</span>
        <p className='text-lg font-bold text-blue-600 whitespace-nowrap'>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(item.preco * item.quantidade)}
        </p>
      </div>
    </div>
  )
}
 
export default CardCart