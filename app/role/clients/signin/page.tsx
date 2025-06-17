import SignIn from "@/components/SignIn";

export default function Welcome () {
    return <div className="relative">
        <SignIn image={"/welcome-client.png"} role={"client"}/>
    </div>
}