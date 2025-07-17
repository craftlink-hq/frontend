import Layout from "@/components/Layout";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Layout >{children}</Layout>
    </div>
  );
}
