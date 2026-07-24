import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetTrigger } from "../ui/sheet";
import SiderbarSheetClient from './siderbar-sheet-client'
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <Card className="rounded-none ring-0 bg-primary pt-2 pb-2">
            <CardContent className="flex flex-row items-center justify-between">
                <div className="relative h-10 w-20">
                    <Link href="/">
                        <Image
                            alt="Logo Salão de beleza"
                            src="/logo3.png"
                            fill
                            priority
                        />
                    </Link>
                </div>
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