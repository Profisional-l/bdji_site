
import Header from "@/components/header/Header";
import Banner from "./components/Banner";
import Feed from "./components/Feed";
import Footer from "@/components/footer/Footer";

import FadeIn from "@/ui/FadeIn";

export default function News() {
    return (
        <section>
            <Header type="bg" />
            {/* <FadeIn>
                <Banner />
            </FadeIn> */}

            <FadeIn>
                <Feed />
            </FadeIn>
            <Footer />
        </section>
    );
}