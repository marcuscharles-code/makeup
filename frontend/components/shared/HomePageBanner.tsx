import Image from "next/image";
import banner2 from "@/public/gif/bamma.gif";
import banner from "@/public/videos/banner.gif";

export default function HomePageBanner() {
    return (
        <section>
            <div className="hidden md:block space-y-6 w-full h-[80vh] relative overflow-hidden">
                <Image
                    alt=""
                    src={banner2}
                    className="w-full h-full object-contain  "
                    priority
                />
            </div>
            <div className="md:hidden  w-full h-auto relative overflow-hidden">
                <Image
                    alt=""
                    src={banner}
                    className="w-full h-full object-contain  "
                    priority
                />
            </div>

            {/* <div className="flex space-y-6 md:space-x-6  p-6 flex-col md:flex-row">
                <div
                    className="h-80 relative overflow-hidden"
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full object-cover h-full"
                    >
                        <source src="/videos/bg.mp4" type="video/mp4" />
                    </video>
                </div>

                <div
                    className="h-80 relative overflow-hidden"
                >
                    <Image
                        src={banner2}
                        className="w-full h-full object-cover"
                        alt=""
                    />
                </div>

                <div className="h-80 relative overflow-hidden">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                    >
                        <source src="/videos/video2.mp4" type="video/mp4" />
                    </video>
                </div>

            </div> */}
        </section>
    );
}
