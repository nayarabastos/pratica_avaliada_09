import { createContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type Produto from "../models/Produto"

export type Items = Produto & {
  quantidade: number
}

interface CartContextProps {
  items: Items[]
  quantidadeItems: number
  valorTotal: number
  adicionarItem(produto: Produto | number): void
  removerItem(id: number): void
  removerProduto(id: number): void
  limparCart(): void
}

export const CartContext = createContext({} as CartContextProps)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<Items[]>(() => {
    const savedItems = localStorage.getItem("carrinho")
    return savedItems ? JSON.parse(savedItems) as Items[] : []
  })

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(items))
  }, [items])

  function adicionarItem(produto: Produto | number) {
    setItems((currentItems) => {
      const id = typeof produto === "number" ? produto : produto.id
      const existingItem = currentItems.find((item) => item.id === id)

      if (existingItem) {
        return currentItems.map((item) => item.id === id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item)
      }

      if (typeof produto === "number") return currentItems
      return [...currentItems, { ...produto, quantidade: 1 }]
    })
  }

  function removerItem(id: number) {
    setItems((currentItems) => currentItems
      .map((item) => item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item)
      .filter((item) => item.quantidade > 0))
  }

  function removerProduto(id: number) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  function limparCart() {
    setItems([])
  }

  const quantidadeItems = useMemo(
    () => items.reduce((total, item) => total + item.quantidade, 0),
    [items],
  )
  const valorTotal = useMemo(
    () => items.reduce((total, item) => total + item.preco * item.quantidade, 0),
    [items],
  )

  return (
    <CartContext.Provider value={{ items, quantidadeItems, valorTotal, adicionarItem, removerItem, removerProduto, limparCart }}>
      {children}
    </CartContext.Provider>
  )
}
