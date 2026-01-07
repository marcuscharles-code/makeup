import { Button } from "@/components/ui/button";
import Image from "next/image";
import img2 from '@/public/brands/2.avif';
import img1 from '@/public/brands/3.avif';
import img3 from '@/public/brands/4.avif';
import img4 from '@/public/brands/a.avif';
import img5 from '@/public/brands/cliniq.avif';
import img6 from '@/public/brands/essenza_logo.avif';


export default function BrandsLogo() {

    const brands = [img1, img2, img3, img4, img5, img6]

    return (
        <div className="mx-auto mb-24">
            <div className="flex justify-between items-center my-6 px-4">
                <h2 className="text-lg">Shop By Brands</h2>

                <Button
                className="bg-white text-black "
                >All Brands</Button>
            </div>



            <div className="flex flex-wrap w-full justify-center items-center ">
                {brands.map((brand, index) => (
                    <div
                        key={index}
                        className="border py-2 px-4 flex items-center justify-center w-44 h-24"
                    >
                        <Image
                            src={brand}
                            alt="Brand logo"
                            width={120}
                            height={60}
                            className="object-contain hover:scale-105 transition-transform"
                        />
                    </div>
                ))}
            </div>


        </div>

    )
}