import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  APP2_PRODUCTS,
  CartItem,
  Customer,
  EXTRA_FARMERS,
  Farmer,
  INITIAL_FARMERS,
  INITIAL_PRODUCTS,
  Order,
  Product,
} from "@/constants/data";

const ALL_INITIAL_PRODUCTS = [...INITIAL_PRODUCTS, ...APP2_PRODUCTS];
const ALL_INITIAL_FARMERS = [...INITIAL_FARMERS, ...EXTRA_FARMERS];

interface AppContextType {
  products: Product[];
  farmers: Farmer[];
  orders: Order[];
  cart: CartItem[];
  customers: Customer[];
  currentCustomer: Customer | null;
  currentFarmer: Farmer | null;
  searchQuery: string;
  activeCategory: string;
  newOrdersCount: number;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (c: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
  clearNewOrders: () => void;
  checkout: (
    deliveryArea: "dhaka" | "outside",
    customerName: string,
    customerPhone: string,
    customerAddress: string
  ) => { success: boolean; grandTotal: number; deliveryCharge: number; orderId: string };
  cartCount: number;
  customerRegister: (name: string, phone: string, address: string, password: string) => { success: boolean; error?: string };
  customerLogin: (phone: string, password: string) => { success: boolean; error?: string };
  customerLogout: () => void;
  farmerRegister: (name: string, phone: string, address: string, productType: string, password: string) => { success: boolean; error?: string };
  farmerLogin: (phone: string, password: string) => { success: boolean; error?: string };
  farmerLogout: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, updates: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: number) => void;
  getFarmerProducts: (farmerId: number) => Product[];
  getFarmerOrders: (farmerId: number) => Order[];
  getCustomerOrders: (customerId: string) => Order[];
}

const AppContext = createContext<AppContextType | null>(null);

const KEYS = {
  products: "krishok_products_v2",
  farmers: "krishok_farmers_v2",
  orders: "krishok_orders_v2",
  cart: "krishok_cart_v2",
  customers: "krishok_customers_v2",
  currentCustomer: "krishok_current_customer_v2",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, f, o, c, cu, cc] = await Promise.all([
          AsyncStorage.getItem(KEYS.products),
          AsyncStorage.getItem(KEYS.farmers),
          AsyncStorage.getItem(KEYS.orders),
          AsyncStorage.getItem(KEYS.cart),
          AsyncStorage.getItem(KEYS.customers),
          AsyncStorage.getItem(KEYS.currentCustomer),
        ]);
        setProducts(p ? JSON.parse(p) : ALL_INITIAL_PRODUCTS);
        setFarmers(f ? JSON.parse(f) : ALL_INITIAL_FARMERS);
        setOrders(o ? JSON.parse(o) : []);
        setCart(c ? JSON.parse(c) : []);
        setCustomers(cu ? JSON.parse(cu) : []);
        setCurrentCustomer(cc ? JSON.parse(cc) : null);
      } catch {
        setProducts(ALL_INITIAL_PRODUCTS);
        setFarmers(ALL_INITIAL_FARMERS);
      }
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (key: string, value: unknown) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      } else {
        next = [...prev, { id: product.id, title: product.title, price: product.price, unit: product.unit, farmer: product.farmer, qty: 1, img: product.img }];
      }
      save(KEYS.cart, next);
      return next;
    });
  }, [save]);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.id !== id);
      save(KEYS.cart, next);
      return next;
    });
  }, [save]);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newQty = item.qty + delta;
      let next: CartItem[];
      if (newQty <= 0) {
        next = prev.filter((i) => i.id !== id);
      } else {
        next = prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i));
      }
      save(KEYS.cart, next);
      return next;
    });
  }, [save]);

  const clearCart = useCallback(() => {
    setCart([]);
    save(KEYS.cart, []);
  }, [save]);

  const clearNewOrders = useCallback(() => {
    setNewOrdersCount(0);
  }, []);

  const getDeliveryWeight = (cartItems: CartItem[], allProducts: Product[]) => {
    let total = 0;
    cartItems.forEach((item) => {
      const p = allProducts.find((pr) => pr.id === item.id);
      if (!p) return;
      if (p.unit === "কেজি") total += item.qty;
      else if (p.unit === "পিস") total += item.qty * 0.5;
      else if (p.unit === "ডজন") total += item.qty * 1.5;
      else total += item.qty * 0.8;
    });
    return total;
  };

  const checkout = useCallback(
    (
      deliveryArea: "dhaka" | "outside",
      customerName: string,
      customerPhone: string,
      customerAddress: string
    ) => {
      if (cart.length === 0) return { success: false, grandTotal: 0, deliveryCharge: 0, orderId: "" };

      const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const weight = getDeliveryWeight(cart, products);
      const base = deliveryArea === "dhaka" ? 60 : 120;
      const extra = weight > 5 ? Math.round((weight - 5) * 30) : 0;
      const deliveryCharge = base + extra;
      const grandTotal = subtotal + deliveryCharge;
      const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);

      const newOrder: Order = {
        id: orderId,
        items: cart.map((item) => ({
          title: item.title,
          qty: item.qty,
          unit: item.unit,
          price: item.price,
        })),
        subtotal,
        deliveryCharge,
        grandTotal,
        deliveryArea,
        customerName,
        customerPhone,
        customerAddress,
        customerId: currentCustomer?.id ?? "guest",
        farmerId: undefined,
        farmerName: cart.length === 1 ? cart[0].farmer : "মিক্স অর্ডার",
        date: new Date().toISOString(),
        status: "confirmed",
      };

      setOrders((prev) => {
        const next = [...prev, newOrder];
        save(KEYS.orders, next);
        return next;
      });
      setNewOrdersCount((prev) => prev + 1);
      clearCart();
      return { success: true, grandTotal, deliveryCharge, orderId };
    },
    [cart, products, currentCustomer, clearCart, save]
  );

  const customerRegister = useCallback((name: string, phone: string, address: string, password: string) => {
    if (customers.find((c) => c.phone === phone)) {
      return { success: false, error: "এই নম্বরে ইতিমধ্যে অ্যাকাউন্ট আছে" };
    }
    const newCustomer: Customer = { id: Date.now().toString(), name, phone, address, password };
    const next = [...customers, newCustomer];
    setCustomers(next);
    save(KEYS.customers, next);
    setCurrentCustomer(newCustomer);
    save(KEYS.currentCustomer, newCustomer);
    return { success: true };
  }, [customers, save]);

  const customerLogin = useCallback((phone: string, password: string) => {
    const customer = customers.find((c) => c.phone === phone && c.password === password);
    if (!customer) return { success: false, error: "ভুল নম্বর বা পাসওয়ার্ড" };
    setCurrentCustomer(customer);
    save(KEYS.currentCustomer, customer);
    return { success: true };
  }, [customers, save]);

  const customerLogout = useCallback(() => {
    setCurrentCustomer(null);
    AsyncStorage.removeItem(KEYS.currentCustomer);
  }, []);

  const farmerRegister = useCallback((name: string, phone: string, address: string, productType: string, password: string) => {
    if (farmers.find((f) => f.phone === phone)) {
      return { success: false, error: "এই নম্বরে ইতিমধ্যে কৃষক অ্যাকাউন্ট আছে" };
    }
    const newFarmer: Farmer = {
      id: Date.now(),
      name, phone, address, password,
      verified: false,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 50) + 10}.jpg`,
      sales: 0,
      products: productType,
      rating: 4.5,
      gender: "male",
    };
    const next = [...farmers, newFarmer];
    setFarmers(next);
    save(KEYS.farmers, next);
    setCurrentFarmer(newFarmer);
    return { success: true };
  }, [farmers, save]);

  const farmerLogin = useCallback((phone: string, password: string) => {
    const farmer = farmers.find((f) => f.phone === phone && f.password === password);
    if (!farmer) return { success: false, error: "ভুল নম্বর বা পাসওয়ার্ড" };
    setCurrentFarmer(farmer);
    return { success: true };
  }, [farmers]);

  const farmerLogout = useCallback(() => {
    setCurrentFarmer(null);
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newProduct: Product = { ...product, id: Date.now() };
    setProducts((prev) => {
      const next = [...prev, newProduct];
      save(KEYS.products, next);
      return next;
    });
  }, [save]);

  const updateProduct = useCallback((id: number, updates: Partial<Omit<Product, "id">>) => {
    setProducts((prev) => {
      const next = prev.map((p) => p.id === id ? { ...p, ...updates } : p);
      save(KEYS.products, next);
      return next;
    });
  }, [save]);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      save(KEYS.products, next);
      return next;
    });
  }, [save]);

  const getFarmerProducts = useCallback((farmerId: number) => {
    return products.filter((p) => p.farmerId === farmerId);
  }, [products]);

  const getFarmerOrders = useCallback((farmerId: number) => {
    const farmerProductTitles = new Set(products.filter((p) => p.farmerId === farmerId).map((p) => p.title));
    return orders.filter((o) =>
      o.items.some((i) => farmerProductTitles.has(i.title))
    );
  }, [orders, products]);

  const getCustomerOrders = useCallback((customerId: string) => {
    return orders.filter((o) => o.customerId === customerId);
  }, [orders]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      products, farmers, orders, cart, customers,
      currentCustomer, currentFarmer,
      searchQuery, activeCategory,
      newOrdersCount,
      setSearchQuery, setActiveCategory,
      addToCart, removeFromCart, updateQty, clearCart, clearNewOrders, checkout,
      updateProduct,
      cartCount,
      customerRegister, customerLogin, customerLogout,
      farmerRegister, farmerLogin, farmerLogout,
      addProduct, updateProduct, deleteProduct,
      getFarmerProducts, getFarmerOrders, getCustomerOrders,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
