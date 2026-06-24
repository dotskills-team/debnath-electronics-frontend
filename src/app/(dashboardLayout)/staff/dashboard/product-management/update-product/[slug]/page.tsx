import UpdateProduct from "@/components/dashboard/product/UpdateProduct";

interface UpdateProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UpdateProductPage({
  params,
}: UpdateProductPageProps) {
  const { slug } = await params;

  return (
    <div>
      <UpdateProduct slug={slug} />
    </div>
  );
}