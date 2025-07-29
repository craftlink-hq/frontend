import ArtisansSignIn from "@/components/ArtisansSignIn";

export default function Welcome () {
    return <div className="relative w-full ">
        <ArtisansSignIn image={"/welcome-artisan.svg"} role={"artisan"}/>
    </div>
}