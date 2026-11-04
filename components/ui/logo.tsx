import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo-white.png";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0" aria-label="Peluga Labs">
      <Image src={logo} alt="Peluga Labs" width={32} height={32} />
    </Link>
  );
}
