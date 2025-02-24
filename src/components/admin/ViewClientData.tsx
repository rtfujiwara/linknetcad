
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Client } from "@/types/client";

interface ViewClientDataProps {
  client: Client;
}

export const ViewClientData = ({ client }: ViewClientDataProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ver Dados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dados do Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome:</p>
                <p className="text-sm">{client.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email:</p>
                <p className="text-sm">{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF:</p>
                <p className="text-sm">{client.document}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">RG/IE:</p>
                <p className="text-sm">{client.rgIe}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Nascimento:</p>
                <p className="text-sm">{client.birthDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Endereço:</p>
                <p className="text-sm">{client.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Número:</p>
                <p className="text-sm">{client.number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Complemento:</p>
                <p className="text-sm">{client.complement || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bairro:</p>
                <p className="text-sm">{client.neighborhood}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cidade:</p>
                <p className="text-sm">{client.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado:</p>
                <p className="text-sm">{client.state}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CEP:</p>
                <p className="text-sm">{client.zipCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Condomínio:</p>
                <p className="text-sm">{client.condoName || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Contato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone:</p>
                <p className="text-sm">{client.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone Alternativo:</p>
                <p className="text-sm">{client.alternativePhone || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Plano</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plano:</p>
                <p className="text-sm">{client.plan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vencimento:</p>
                <p className="text-sm">Todo dia {client.dueDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome do Wi-Fi:</p>
                <p className="text-sm">{client.wifiName || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Senha do Wi-Fi:</p>
                <p className="text-sm">{client.wifiPassword || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
