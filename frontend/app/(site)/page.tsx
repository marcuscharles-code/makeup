import BrandsLogo from "@/components/shared/BrandsLogo";
import HomePageBanner from "@/components/shared/HomePageBanner";
import MostPopulaMarketplace from "@/components/shared/MarketPlace";


export default function page() {
  return (
    <div>
      <HomePageBanner />
      <BrandsLogo />

      <MostPopulaMarketplace  />
    </div>
  );
}
