
import React from "react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiberOpticBackground } from "../components/admin/FiberOpticBackground";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden"
    >
      <FiberOpticBackground />

      <div className="absolute top-4 right-4 z-10">
        <Link to="/admin">
          <Button variant="outline" size="sm" className="text-blue-800 bg-white/70 hover:bg-white/90 backdrop-blur-sm border-blue-200">
            Área Administrativa
          </Button>
        </Link>
      </div>

      <div className="h-screen flex flex-col items-center justify-center px-4 z-10 relative">
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
              <Link to="/register" className="block w-full">
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
