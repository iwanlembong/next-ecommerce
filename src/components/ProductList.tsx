import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic";

const SafeHtml = dynamic(() => import("./SafeHtml"), { ssr: false });

const PRODUCT_PER_PAGE = 20;

const ProductList = async ({ 
    categoryId, 
    limit,
    searchParams
    }: { 
        categoryId: string, 
        limit?: number, 
        searchParams?: any }) => {
    const wixClient = await wixClientServer();

    const res = await wixClient.products.queryProducts().eq("collectionIds", categoryId).limit(limit || PRODUCT_PER_PAGE).find();


    return (
        <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
            {res.items.map((product: products.Product) => {
                const shortDesc =
                    product.additionalInfoSections?.find(
                        (section: any) => section.title === "shortDesc"
                    )?.description || "";

                return (
                    <Link
                        href={"/" + product.slug}
                        className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
                        key={product._id}
                    >
                        <div className="relative w-full h-80">
                            <Image
                                src={product.media?.mainMedia?.image?.url || "product.png"}
                                alt={product.name || ""}
                                fill
                                sizes="25vw"
                                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                            />
                            {product.media?.items?.[1]?.image?.url && (
                                <Image
                                    src={product.media.items[1].image.url}
                                    alt={product.name || ""}
                                    fill
                                    sizes="25vw"
                                    className="absolute object-cover rounded-md"
                                />
                            )}
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium">{product.name}</span>
                            <span className="font-semibold">${product.price?.price}</span>
                        </div>

                        {shortDesc && (
                            <SafeHtml html={shortDesc} />
                        )}

                        <button className="rounded-2xl ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
                            Add to Cart
                        </button>
                    </Link>
                );
            })}
        </div>
    )
}

export default ProductList