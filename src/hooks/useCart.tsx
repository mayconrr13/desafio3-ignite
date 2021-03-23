import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
  }, [cart])
  
  const addProduct = async (productId: number) => {
    try {
      const productAlreadyExistInCart = cart.filter((product: Product) => {
        return product.id === productId
      })

      if(productAlreadyExistInCart.length !== 0) {
        updateProductAmount({productId, amount: productAlreadyExistInCart[0].amount + 1})
        return 
      }

      const response = await api.get('/products')
      const productToAdd = response.data.filter((product: Product) => {
        return product.id === productId
      }) 

      productToAdd[0]['amount'] = 1;

      setCart([...cart, ...productToAdd])
      return
    } catch {
      toast.error('Erro na adição do produto');
      return 
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCart = cart.filter((product: Product) => {
        return productId !== product.id
      })

      setCart([...newCart])
    } catch {
      toast.error('Erro na remoção do produto');
      return
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const response = await api.get('/stock')
      const productStock =response.data.filter((stock: Stock) => {
        return stock.id === productId
      })

      if (amount <= 0) {
        return
      }

      if (amount > productStock[0].amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

      const updatedAmountCart = cart.map((product: Product) => {
        if (product.id === productId) {
          product.amount = amount
          return product
        } 
        return product
      })

      return setCart([...updatedAmountCart])
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
      return
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
