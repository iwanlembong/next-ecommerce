import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic";
import Pagination from "./Pagination";

const SafeHtml = dynamic(() => import("./SafeHtml"), { ssr: false });

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
    categoryId,
    limit,
    searchParams
}: {
    categoryId: string,
    limit?: number,
    searchParams?: any
}) => {
    const wixClient = await wixClientServer();

    const productQuery = wixClient.products
        .queryProducts()
        .startsWith("name", searchParams?.name || "")
        .eq("collectionIds", categoryId)
        .hasSome(
            "productType",
            searchParams?.type ? [searchParams.type] : ["physical", "digital"]
        )
        .gt("priceData.price", searchParams?.min || 0)
        .lt("priceData.price", searchParams?.max || 999999)
        .limit(limit || PRODUCT_PER_PAGE)
        .skip(
            searchParams?.page
                ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
                : 0
        );
    // .find();

    // ✔ Sorting
    if (searchParams?.sort) {
        const [sortType, sortBy] = searchParams.sort.split(" ");

        // Map sorting field
        let wixField = sortBy;
        if (sortBy === "price") wixField = "priceData.price";
        if (sortBy === "lastUpdated") wixField = "lastUpdated";

        if (sortType === "asc") productQuery.ascending(wixField);
        if (sortType === "desc") productQuery.descending(wixField);
    }

    const res = await productQuery.find();

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
                            <span className="font-semibold">${product.priceData?.price}</span>
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
            {searchParams?.cat || searchParams?.name ? (
                <Pagination
                    currentPage={res.currentPage || 0}
                    hasPrev={res.hasPrev()}
                    hasNext={res.hasNext()}
                />
            ) : null}
        </div>
    )
}

export default ProductList