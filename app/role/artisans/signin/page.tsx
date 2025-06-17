import SignIn from "@/components/SignIn";

export default function Welcome () {
    return <div className="relative">
        <SignIn image={"/welcome-artisan.png"} role={"artisan"}/>
    </div>
}