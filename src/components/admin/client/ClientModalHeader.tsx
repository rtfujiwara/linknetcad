
interface ClientModalHeaderProps {
  title: string;
}

export const ClientModalHeader = ({ title }: ClientModalHeaderProps) => {
  return (
    <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white pt-2 pb-2 z-10">
      {title}
    </h2>
  );
};
