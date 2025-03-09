
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ClientTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>E-mail</TableHead>
        <TableHead>CPF/CNPJ</TableHead>
        <TableHead>Telefone</TableHead>
        <TableHead>Plano</TableHead>
        <TableHead>Vencimento</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
