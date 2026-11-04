'use client';

import { useState, useEffect } from 'react';
import { Check, Copy, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SharePost({ title, compact = false }: { title: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (compact) {
    return (
      <button 
        onClick={handleCopy}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/4 border border-white/20 hover:bg-white/5 hover:border-white/15 transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <Check className="w-3.5 h-3.5 text-white/75" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <Copy className="w-3.5 h-3.5 text-white/60 hover:text-white/75" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="text-xs font-medium text-white/75 group-hover:text-white/60">
          {copied ? 'Copiado!' : 'Compartilhar'}
        </span>
      </button>
    );
  }

  const shareText = `Confira este post no Blog da Peluga Labs: ${title}`;

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/50',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'hover:text-white hover:bg-white/10 hover:border-white/50',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-white hover:bg-white/10 hover:border-white/50',
    },
  ];

  return (
    <div className="flex flex-col space-y-4 py-8 border-t border-white/20 mt-12">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white/75 uppercase tracking-widest flex items-center">
          <span className="w-8 h-[1px] bg-white/50 mr-3"></span>
          Compartilhar
        </span>
        
        <div className="flex items-center space-x-3">
          {/* Copy Link Button */}
          <button
            onClick={() => handleCopy()}
            className="relative group flex items-center justify-center w-10 h-10 rounded-xl bg-white/4 border border-white/20 hover:bg-white/5 hover:border-white/25 transition-all duration-300 transform active:scale-95 shadow-lg overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check className="w-5 h-5 text-white/75 relative z-10" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Copy className="w-5 h-5 text-white/75 group-hover:text-white/75 relative z-10" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#172E6E] text-xs font-semibold text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/20 shadow-2xl z-20 translate-y-1 group-hover:translate-y-0">
              {copied ? 'Link copiado!' : 'Copiar link'}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#172E6E] border-b border-r border-white/20 rotate-45"></div>
            </div>
          </button>

          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative group flex items-center justify-center w-10 h-10 rounded-xl bg-white/4 border border-white/20 transition-all duration-300 transform active:scale-95 shadow-lg text-white/75 overflow-hidden ${social.color}`}
              title={social.name}
            >
              <AnimatePresence>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {social.icon}
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#172E6E] text-xs font-semibold text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/20 shadow-2xl z-20 translate-y-1 group-hover:translate-y-0">
                {social.name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#172E6E] border-b border-r border-white/20 rotate-45"></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
