import React, { FC, useState } from 'react';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { File, Folder } from 'lucide-react';
import SwitchDarkMode from '@/SwitchDarkMode';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import NetworkSwitcher from './NetworkSwitcher';

type NavigateParams = {
  path: string;
  state: any;
};
type NavBarProps = {
  params?: NavigateParams;
};

const NavBar: FC<NavBarProps> = ({ params }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return true;
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      to={href}
      className={`text-lg font-bold inline-block ${
        isActive(href) ? 'text-primary' : 'text-muted-foreground'
      } hover:text-primary transition-colors`}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  const NavContent = () => (
    <>
      <NavLink href="/files">
        <Folder className="h-6 w-6 inline-block mr-2" />
        Files
      </NavLink>
      <NetworkSwitcher />
      <div className="flex items-center gap-4">
        <SwitchDarkMode />
      </div>
    </>
  );

  return (
    <nav className="flex justify-between items-center p-4 bg-primary-foreground">
      <div className="flex flex-row gap-4 items-center">
        {params && (
          <Button
            className="gap-2 font-bold"
            variant="secondary"
            onClick={() => {
              navigate(params.path, { replace: true, state: params.state });
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Link to="/">
          <Home className="h-8 w-8" />
        </Link>
        {/* Desktop Navigation */}
      </div>
      <div className="hidden md:flex items-center gap-6">
        <NavContent />
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[400px]" side="right">
          <div className="flex flex-col gap-6 mt-6">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default NavBar;
