import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Chip } from '@nextui-org/react';
import { Bot, FileText, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <Navbar 
      maxWidth="full" 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200"
      height="4rem"
    >
      <NavbarBrand className="gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Resume Screener
            </h1>
            <p className="text-xs text-gray-600">Multi-Agent Recruitment System</p>
          </div>
        </div>
      </NavbarBrand>
      
      <NavbarContent justify="end">
        <NavbarItem>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Resume Analysis</span>
          </div>
        </NavbarItem>
        <NavbarItem>
          <Chip 
            color="primary" 
            variant="flat" 
            size="sm"
            startContent={<Search className="w-3 h-3" />}
          >
            AI-Powered
          </Chip>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};