import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
   <div className="h-screen w-screen flex justify-center items-center ">
    <Link href="/login">Login</Link>
   </div>
  );
}
