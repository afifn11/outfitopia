/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const InfoPageLayout = ({ title, subtitle, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header Halaman */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                            {title}
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
                    </motion.div>

                    {/* Konten Halaman */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-100"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoPageLayout;