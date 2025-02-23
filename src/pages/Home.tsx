
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4"
    >
      <div className="absolute top-4 right-4">
        <Link to="/admin">
          <Button variant="outline" size="sm" className="text-sm">
            Área Administrativa
          </Button>
        </Link>
      </div>

      <div className="h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8 space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Bem-vindo
            </h1>
            
            <div className="space-y-4">
              <Link to="/register" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6">
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
