
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { syncStorage } from "@/utils/syncStorage";
import { Loader2 } from "lucide-react";

interface ClientData {
  name: string;
  email: string;
  document: string; // CPF/CNPJ
  rgIe: string; // RG/IE
  birthDate: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  condoName: string;
  phone: string;
  alternativePhone: string;
  plan: string;
  dueDate: string;
  wifiName: string;
  wifiPassword: string;
}

const Index = () => {
  const [formData, setFormData] = useState<ClientData>({
    name: "",
    email: "",
    document: "",
    rgIe: "",
    birthDate: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    condoName: "",
    phone: "",
    alternativePhone: "",
    plan: "",
    dueDate: "",
    wifiName: "",
    wifiPassword: "",
  });
  const [plans, setPlans] = useState<{ id: number; name: string; price: number; description: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Adiciona um timeout para não ficar travado infinitamente
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout ao carregar planos")), 10000);
        });
        
        const plansPromise = syncStorage.getItem<{ id: number; name: string; price: number; description: string; }[]>("plans", []);
        
        // Utiliza Promise.race para garantir que não ficará carregando para sempre
        const savedPlans = await Promise.race([plansPromise, timeoutPromise]);
        setPlans(savedPlans || []);
        
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        setIsError(true);
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível carregar os planos. Funcionando em modo offline.",
        });
        // Em caso de erro, tenta carregar do armazenamento local
        const localPlans = syncStorage.getItemSync<{ id: number; name: string; price: number; description: string; }[]>("plans", []);
        setPlans(localPlans);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();

    // Listener para mudanças nos planos
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "plans") {
        setPlans(value || []);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      toast({
        variant: "destructive",
        title: "Aguarde",
        description: "Por favor, aguarde o carregamento dos planos.",
      });
      return;
    }
    
    try {
      const clients = await syncStorage.getItem<(ClientData & { id: number })[]>("clients", []);
      const updatedClients = [...clients, { ...formData, id: Date.now() }];
      await syncStorage.setItem("clients", updatedClients);
      
      setFormData({
        name: "",
        email: "",
        document: "",
        rgIe: "",
        birthDate: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        condoName: "",
        phone: "",
        alternativePhone: "",
        plan: "",
        dueDate: "",
        wifiName: "",
        wifiPassword: "",
      });
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seus dados foram salvos.",
      });
      
      // Redirecionar para a página principal após o cadastro
      setTimeout(() => {
        navigate("/");
      }, 1500); // Pequeno delay para que o usuário veja a mensagem de sucesso
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
      });
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (Number(value) > 31) return;
    setFormData({ ...formData, dueDate: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden"
    >
      {/* Efeito de fibra óptica - igual ao da página principal */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2)_0%,rgba(37,99,235,0.3)_100%)]"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[3px] bg-blue-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.7 + 0.3,
              boxShadow: '0 0 15px rgba(59,130,246,0.8)',
            }}
          ></div>
        ))}
      </div>
      
      <div className="max-w-2xl mx-auto pt-8">
        {/* Logo como cabeçalho */}
        <div className="flex justify-center mb-6">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
            alt="Linknet Vale Logo"
            className="w-48 md:w-64"
          />
        </div>
        
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8"
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Cadastro de Cliente
          </h1>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600">Carregando planos disponíveis...</p>
            </div>
          ) : isError ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p>Funcionando em modo offline. Dados serão sincronizados quando a conexão for restabelecida.</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Nenhum plano disponível</p>
              <p className="text-gray-600 mb-6">É necessário que um administrador adicione planos primeiro.</p>
              <Link to="/">
                <Button variant="outline">Voltar para a página inicial</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">CPF / CNPJ *</Label>
                <Input
                  id="document"
                  required
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rgIe">RG / IE *</Label>
                <Input
                  id="rgIe"
                  required
                  value={formData.rgIe}
                  onChange={(e) => setFormData({ ...formData, rgIe: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    required
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input
                    id="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condoName">Nome do Condomínio</Label>
                <Input
                  id="condoName"
                  value={formData.condoName}
                  onChange={(e) => setFormData({ ...formData, condoName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternativePhone">Telefone Recado</Label>
                  <Input
                    id="alternativePhone"
                    value={formData.alternativePhone}
                    onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano *</Label>
                  <select
                    id="plan"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  >
                    <option value="">Selecione um plano</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.name}>
                        {plan.name} - R$ {plan.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Dia de Vencimento *</Label>
                  <select
                    id="dueDate"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="05">05</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wifiName">Nome do Wi-Fi</Label>
                  <Input
                    id="wifiName"
                    value={formData.wifiName}
                    onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wifiPassword">Senha do Wi-Fi</Label>
                  <Input
                    id="wifiPassword"
                    value={formData.wifiPassword}
                    onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Cadastrar
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
