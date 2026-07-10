import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetTrigger } from "../ui/sheet";
import SiderbarSheetClient from './siderbar-sheet-client'
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <Card className="rounded-none ring-0 bg-secondary">
            <CardContent className="flex flex-row items-center justify-between pl-0">
            <Link href="/">
                <Image
                    alt="Logo Salão de beleza"
                    src="/logo-copia.png"
                    height={28}
                    width={120}
                    priority
                />
            </Link>

            <Sheet>
                <SheetTrigger>
                <Button size="icon" variant="outline">
                    <MenuIcon />
                </Button>
                </SheetTrigger>

                <SiderbarSheetClient />
            </Sheet>
            </CardContent>
        </Card>
    );
}
 
export default Header;