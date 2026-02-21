import './_scss/_globals.scss'
import CookieConsent from '@/ui/CookieConsent';
import type { Metadata } from "next";
import Script from 'next/script';

export const metadata: Metadata = {
    title: "Совместный институт БГУ и ДПУ",
    description: `Совместный институт БГУ и ДПУ — 
                образовательный центр, созданный 
                в сотрудничестве между Белорусским 
                государственным университетом (БГУ) 
                и Даляньским политехническим университетом (ДПУ). 
                Мы предлагаем качественное обучение с 
                международным уклоном, сочетая передовые 
                образовательные методики и научные исследования. 
                Наши студенты изучают современные технологии, 
                участвуют в международных проектах и 
                проходят стажировки в Китае и Беларуси.`,

    icons: {
        icon: "/logos/logo.ico",
    },

    openGraph: {
        title: "Совместный институт БГУ и ДПУ",
        description: `Образовательный центр, созданный в сотрудничестве между 
                    Белорусский государственный университет и Даляньским политехническим университетом. 
                    Совмещает международные образовательные стандарты, 
                    современные технологии и научные исследования. Поездки в Далянь, 
                    знание 3 языков (русского, английского и китайского).`,
        url: "https://bdji.bsu.by",
        siteName: "Совместный институт БГУ и ДПУ",
        images: [
            {
                url: "/pics/dalian_university_of_technology.png",
                width: 1200,
                height: 630,
                alt: "Совместный институт БГУ и ДПУ",
            },
        ],
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Совместный институт БГУ и ДПУ",
        description: `Официальный сайт образовательного центра, созданного 
                    в сотрудничестве между Белорусским государественным университетом 
                    и Даляньским политехническим университетом. Международное обучение, 
                    стажировки и научные исследования. Поездки в Далянь.`,
        images: ["/pics/dalian_university_of_technology.png"],
    },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" data-creator="Made by Savsiuk. (telegram: @jakesooly) and ✿ sakura. — web agency ||| Stay Gold. ">
            <head>
                <Script
                    id="yandex-metrika"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        m[i].l=1*new Date();
                        for (var j = 0; j < document.scripts.length; j++) {
                            if (document.scripts[j].src === r) { return; }
                        }
                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                        k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                        ym(102414167, "init", {
                            clickmap:true,
                            trackLinks:true,
                            accurateTrackBounce:true,
                            webvisor:true
                        });
                        `,
                    }}
                />
               <meta name="creator" content="Savsiuk [telegram: @jakesooly] and ✿ sakura. — web agency ||| Stay Gold. "/>
            </head>
            <body>
                <main>
                    {/* Yandex.Metrika */}
                    <noscript>
                        <div>
                            <img
                                src="https://mc.yandex.ru/watch/102414167"
                                style={{ position: 'absolute', left: '-9999px' }}
                                alt=""
                            />
                        </div>
                    </noscript>

                    <CookieConsent />

                    {children}
                </main>
            </body>
        </html>
    );
}