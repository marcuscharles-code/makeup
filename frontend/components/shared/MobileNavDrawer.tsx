/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}


export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const [openSection, setOpenSection] = useState(null);
  const [openSubSection, setOpenSubSection] = useState(null);

  const toggleSection = (section: any) => {
    setOpenSection(openSection === section ? null : section);
    setOpenSubSection(null);
  };

  const toggleSubSection = (subSection:any) => {
    setOpenSubSection(openSubSection === subSection ? null : subSection);
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 md:hidden">
        {/* Header */}
        <SheetHeader className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Navigation Items */}
        <div className="p-4 overflow-y-auto">
          {/* ALL BRANDS */}
          <Collapsible
            open={openSection === 'brands'}
            onOpenChange={() => toggleSection('brands')}
            className="mb-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full py-3 px-2 hover:bg-gray-100 font-medium"
              >
                <span>ALL BRANDS</span>
                {openSection === 'brands' ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 mt-2 space-y-2">
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/brands/a-b" onClick={handleLinkClick}>
                  Brands A - B
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/brands/c-e" onClick={handleLinkClick}>
                  Brands C - E
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/brands/e-h" onClick={handleLinkClick}>
                  Brands E - H
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/brands/i-l" onClick={handleLinkClick}>
                  Brands I - L
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/brands/l-m" onClick={handleLinkClick}>
                  Brands L - M
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/brands/m-r" onClick={handleLinkClick}>
                  Brands M - R
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/brands/r-z" onClick={handleLinkClick}>
                  Brands R - Z
                </a>
              </Button>
              <Separator className="my-1" />
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-medium text-red-700 h-auto"
                asChild
              >
                <a href="/brands/all" onClick={handleLinkClick}>
                  View All Brands
                </a>
              </Button>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="my-2" />

          {/* PERFUME */}
          <Collapsible
            open={openSection === 'perfume'}
            onOpenChange={() => toggleSection('perfume')}
            className="mb-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full py-3 px-2 hover:bg-gray-100 font-medium"
              >
                <span>PERFUME</span>
                {openSection === 'perfume' ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 mt-2 space-y-2">
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-medium h-auto"
                asChild
              >
                <a href="/perfumes/all" onClick={handleLinkClick}>
                  All Perfumes
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/perfumes/featured" onClick={handleLinkClick}>
                  Featured Perfumes
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/perfumes/all-brands" onClick={handleLinkClick}>
                  Browse by Brand
                </a>
              </Button>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="my-2" />

          {/* SKINCARE */}
          <Accordion type="single" collapsible className="mb-2">
            <AccordionItem value="skincare" className="border-none">
              <AccordionTrigger className="py-3 px-2 hover:no-underline hover:bg-gray-100 font-medium">
                SKINCARE
              </AccordionTrigger>
              <AccordionContent className="ml-4 mt-2 space-y-2">
                <Button
                  variant="link"
                  className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-medium h-auto"
                  asChild
                >
                  <a href="/skincare/all" onClick={handleLinkClick}>
                    All Skincare
                  </a>
                </Button>

                {/* Face Subsection */}
                <Collapsible
                  open={openSubSection === 'face'}
                  onOpenChange={() => toggleSubSection('face')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center w-full py-2 px-2 hover:bg-gray-50 text-sm justify-start font-normal h-auto"
                    >
                      <span>Face</span>
                      {openSubSection === 'face' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/face/cleansers" onClick={handleLinkClick}>
                        Cleansers
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/face/moisturizers" onClick={handleLinkClick}>
                        Moisturizers
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/face/serums" onClick={handleLinkClick}>
                        Serums
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/face/masks" onClick={handleLinkClick}>
                        Masks
                      </a>
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Body Subsection */}
                <Collapsible
                  open={openSubSection === 'body'}
                  onOpenChange={() => toggleSubSection('body')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center w-full py-2 px-2 hover:bg-gray-50 text-sm justify-start font-normal h-auto"
                    >
                      <span>Body</span>
                      {openSubSection === 'body' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/body/lotions" onClick={handleLinkClick}>
                        Lotions
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/body/oils" onClick={handleLinkClick}>
                        Body Oils
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/body/scrubs" onClick={handleLinkClick}>
                        Scrubs
                      </a>
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Men Subsection */}
                <Collapsible
                  open={openSubSection === 'men'}
                  onOpenChange={() => toggleSubSection('men')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center w-full py-2 px-2 hover:bg-gray-50 text-sm justify-start font-normal h-auto"
                    >
                      <span>Men</span>
                      {openSubSection === 'men' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/men/face-care" onClick={handleLinkClick}>
                        Face Care
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/skincare/men/shaving" onClick={handleLinkClick}>
                        Shaving
                      </a>
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  variant="link"
                  className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                  asChild
                >
                  <a href="/skincare/brands" onClick={handleLinkClick}>
                    Browse Brands
                  </a>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* MAKE UP */}
          <Accordion type="single" collapsible className="mb-2">
            <AccordionItem value="makeup" className="border-none">
              <AccordionTrigger className="py-3 px-2 hover:no-underline hover:bg-gray-100 font-medium">
                MAKE UP
              </AccordionTrigger>
              <AccordionContent className="ml-4 mt-2 space-y-2">
                <Button
                  variant="link"
                  className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-medium h-auto"
                  asChild
                >
                  <a href="/makeup/all" onClick={handleLinkClick}>
                    All Makeup
                  </a>
                </Button>

                {/* Face Subsection */}
                <Collapsible
                  open={openSubSection === 'makeup-face'}
                  onOpenChange={() => toggleSubSection('makeup-face')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center w-full py-2 px-2 hover:bg-gray-50 text-sm justify-start font-normal h-auto"
                    >
                      <span>Face</span>
                      {openSubSection === 'makeup-face' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/face/foundation" onClick={handleLinkClick}>
                        Foundation
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/face/concealer" onClick={handleLinkClick}>
                        Concealer
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/face/powder" onClick={handleLinkClick}>
                        Powder
                      </a>
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Eyes Subsection */}
                <Collapsible
                  open={openSubSection === 'eyes'}
                  onOpenChange={() => toggleSubSection('eyes')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center w-full py-2 px-2 hover:bg-gray-50 text-sm justify-start font-normal h-auto"
                    >
                      <span>Eyes</span>
                      {openSubSection === 'eyes' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/eyes/eyeshadow" onClick={handleLinkClick}>
                        Eyeshadow
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/eyes/mascara" onClick={handleLinkClick}>
                        Mascara
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/eyes/eyeliner" onClick={handleLinkClick}>
                        Eyeliner
                      </a>
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Lips Subsection */}
                <Collapsible
                  open={openSubSection === 'lips'}
                  onOpenChange={() => toggleSubSection('lips')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center  w-full py-2 px-2 hover:bg-gray-50 text-sm justify-start font-normal h-auto"
                    >
                      <span>Lips</span>
                      {openSubSection === 'lips' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/lips/lipstick" onClick={handleLinkClick}>
                        Lipstick
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/lips/lip-gloss" onClick={handleLinkClick}>
                        Lip Gloss
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      className="block py-1 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                      asChild
                    >
                      <a href="/makeup/lips/lip-liner" onClick={handleLinkClick}>
                        Lip Liner
                      </a>
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  variant="link"
                  className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                  asChild
                >
                  <a href="/makeup/tools" onClick={handleLinkClick}>
                    Tools & Brushes
                  </a>
                </Button>
                <Button
                  variant="link"
                  className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                  asChild
                >
                  <a href="/makeup/brands" onClick={handleLinkClick}>
                    Browse Brands
                  </a>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* GIFT */}
          <Collapsible
            open={openSection === 'gift'}
            onOpenChange={() => toggleSection('gift')}
            className="mb-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full py-3 px-2 hover:bg-gray-100 font-medium"
              >
                <span>GIFT</span>
                {openSection === 'gift' ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 mt-2 space-y-2">
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-medium h-auto"
                asChild
              >
                <a href="/gifts/all" onClick={handleLinkClick}>
                  All Gifts
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/gifts/perfume-gift-sets" onClick={handleLinkClick}>
                  Perfume Gift Sets
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/gifts/skincare-gift-sets" onClick={handleLinkClick}>
                  Skincare Gift Sets
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/gifts/makeup-gift-sets" onClick={handleLinkClick}>
                  Makeup Gift Sets
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/gifts/for-her" onClick={handleLinkClick}>
                  For Her
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/gifts/for-him" onClick={handleLinkClick}>
                  For Him
                </a>
              </Button>
              <Button
                variant="link"
                className="block py-2 px-2 hover:bg-gray-50 rounded text-sm justify-start font-normal h-auto"
                asChild
              >
                <a href="/gifts/luxury-collections" onClick={handleLinkClick}>
                  Luxury Collections
                </a>
              </Button>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="my-2" />

          {/* TIPS & TRENDS */}
          <Button
            variant="ghost"
            className="flex items-center w-full py-3 px-2 hover:bg-gray-100 font-medium justify-start mb-2"
            asChild
          >
            <a href="/tips-trends" onClick={handleLinkClick}>
              TIPS & TRENDS
            </a>
          </Button>

          <Separator className="my-2" />

          {/* OTHER BRANDS NOT HERE */}
          <Button
            variant="ghost"
            className="flex items-center w-full py-3 px-2 hover:bg-gray-100 font-medium justify-start mb-2"
            asChild
          >
            <a href="/other-brands" onClick={handleLinkClick}>
              OTHER BRANDS NOT HERE
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}