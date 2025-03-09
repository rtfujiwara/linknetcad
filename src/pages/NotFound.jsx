
import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiberOpticBackground } from "../components/admin/FiberOpticBackground";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden flex flex-col items-center justify-center"
    >
      <FiberOpticBackground />

      <div className="z-10 relative text-center">
        <h1 className="text-6xl font-bold text-blue-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-blue-800 mb-8">Página não encontrada</h2>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
