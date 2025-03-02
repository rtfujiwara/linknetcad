
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem("plans") || "[]");
    setPlans(savedPlans);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    clients.push({ ...formData, id: Date.now() });
    localStorage.setItem("clients", JSON.stringify(clients));
    
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
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (Number(value) > 31) return;
    setFormData({ ...formData, dueDate: value });
  };

  const requiredField = "Campo obrigatório";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Cadastro de Cliente
          </h1>
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
                <Input
                  id="dueDate"
                  required
                  maxLength={2}
                  placeholder="Ex: 05"
                  value={formData.dueDate}
                  onChange={handleDueDateChange}
                />
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
