
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden"
    >
      {/* Efeito de fibra óptica */}
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

      <div className="absolute top-4 right-4">
        <Link to="/admin">
          <Button variant="outline" size="sm" className="text-blue-800 bg-white/70 hover:bg-white/90 backdrop-blur-sm border-blue-200">
            Área Administrativa
          </Button>
        </Link>
      </div>

      <div className="h-screen flex flex-col items-center justify-center px-4">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
          alt="Linknet Vale Logo"
          className="w-64 md:w-96 mb-12"
        />
        
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-8 space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
              Bem-vindo à LINKNET
            </h1>
            
            <div className="space-y-4">
              <Link to="/register" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Cadastro de Cliente
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
