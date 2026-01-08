import Image from "next/image";
import banner2 from "@/public/images/1629.jpg";
import banner from "@/public/images/missperf.webp";

export default function HomePageBanner() {
    return (
        <section>
            <div className="space-y-6 ">
                <Image
                    alt=""
                    src={banner}
                    className="w-full h-auto"
                    priority
                />
            </div>

            <div className="flex space-y-6 md:space-x-6  p-6 flex-col md:flex-row">
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

            </div>
        </section>
    );
}
