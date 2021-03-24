import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productIndex = cart.findIndex(product => {
        return product.id === productId
      })

      if (productIndex >= 0) {
        const stockResponse = await api.get<Stock>(`/stock/${productId}`)
        const productsInStock = stockResponse.data.amount

        if (cart[productIndex].amount + 1 > productsInStock) {
          toast.error('Quantidade solicitada fora de estoque');
          return
        } else {
          cart[productIndex].amount += 1
          setCart([...cart])
          localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart]))
        }
      } else {
        const response = await api.get<Product>(`/products/${productId}`)

        if (response.status === 404) {
          toast.error('Erro na adição do produto');
          return
        }

        const newProduct = response.data
        setCart([...cart, {...newProduct, amount: 1}])
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, {...newProduct, amount: 1}]))
      }
    } catch {
      toast.error('Erro na adição do produto');
      return
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productIndex = cart.findIndex(product => {
        return product.id === productId
      })

      if (productIndex < 0) {
        toast.error('Erro na remoção do produto');
        return
      }

      cart.splice(productIndex, 1)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart]))
      setCart([...cart])
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const response = await api.get<Stock>(`/stock/${productId}`)
      
      if (response.status === 404) {
        toast.error('Erro na alteração de quantidade do produto');
        return
      }

      const productsInStock = response.data.amount

      if (amount > productsInStock) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }
      
      if (amount < 1) {
        return
      }

      const updatedCart = cart.map(product => {
        if (productId === product.id) {
          product.amount = amount
          return product
        }
        return product
      })

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
      setCart(updatedCart)
      return
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
