import React from 'react'
import Image from 'next/image'
import { aktivSIBD } from '@/data/about-sibd-active/about_sibd_active'

const Main = () => {
    return (
        <section className="aktiv flex-center pb-20">
            <div className="aktiv__wrapper wrapper--my w-full">
                
                {/* Заголовок и интро */}
                <h1 className="wwtitle--bold text-center mb-[20px] lg:mb-[30px]">{aktivSIBD.headline}</h1>
                <div className="flex flex-col gap-[15px] mb-[40px] lg:mb-[60px] w-full lg:w-[80%] mx-auto text-center">
                    {aktivSIBD.intro.map((p, i) => (
                        <p key={i} className="text-base lg:text-lg leading-relaxed">{p}</p>
                    ))}
                </div>

                {/* Миссия */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] lg:gap-[50px] items-center mb-[40px] lg:mb-[80px]">
                    <div className="order-2 lg:order-1">
                        <h3 className="text-xl lg:text-2xl font-bold mb-[15px]">{aktivSIBD.mission.title}</h3>
                        <p className="text-base lg:text-lg leading-relaxed">{aktivSIBD.mission.text}</p>
                    </div>
                    <div className="order-1 lg:order-2 relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                        <Image 
                            src={aktivSIBD.photos[0]} 
                            alt="Миссия Актива" 
                            fill 
                            priority
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>

                {/* Деятельность */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] lg:gap-[50px] items-center mb-[40px] lg:mb-[80px]">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                        <Image 
                            src={aktivSIBD.photos[1]} 
                            alt="Деятельность Актива" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl lg:text-2xl font-bold mb-[20px]">{aktivSIBD.activities.title}</h3>
                        <ul className="flex flex-col gap-[15px]">
                            {aktivSIBD.activities.list.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                    <span className="text-blue-600 text-lg mt-0.5">•</span>
                                    <span className="text-base lg:text-lg font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Структура организации (Надежная плашка) */}
                <div className="mb-[40px] lg:mb-[80px] bg-blue-50 border border-blue-100 rounded-2xl p-[30px] lg:p-[50px]">
                    <h3 className="text-xl lg:text-2xl font-bold mb-[15px] text-center">{aktivSIBD.structure.title}</h3>
                    <p className="text-center text-base lg:text-lg mb-[30px] w-full lg:w-[80%] mx-auto">
                        {aktivSIBD.structure.intro}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] lg:gap-[20px]">
                        {aktivSIBD.structure.departments.map((dept, i) => (
                            <div key={i} className="bg-white border border-blue-100 shadow-sm p-[20px] rounded-xl text-center font-semibold text-base lg:text-lg hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                {dept}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Почему стоит вступить */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] lg:gap-[50px] items-center mb-[40px] lg:mb-[80px]">
                    <div>
                        <h3 className="text-xl lg:text-2xl font-bold mb-[15px]">{aktivSIBD.whyJoin.title}</h3>
                        <p className="text-base lg:text-lg leading-relaxed mb-[25px]">{aktivSIBD.whyJoin.intro}</p>
                        <ul className="flex flex-col gap-[15px] mb-[25px]">
                            {aktivSIBD.whyJoin.list.map((item, i) => {
                                const [boldText, normalText] = item.split(':');
                                return (
                                    <li key={i} className="border-l-4 border-blue-500 pl-[15px] py-[5px]">
                                        <span className="font-bold text-base lg:text-lg block">{boldText}:</span>
                                        <span className="text-base lg:text-lg text-gray-700">{normalText}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="bg-gray-50 inline-block p-[15px] rounded-lg border border-gray-200">
                            <p className="italic font-medium text-base text-gray-800">💡 {aktivSIBD.whyJoin.outro}</p>
                        </div>
                    </div>
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                        <Image 
                            src={aktivSIBD.photos[2]} 
                            alt="Почему стоит вступить" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>

                {/* Как вступить */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] lg:gap-[50px] items-center bg-white p-[30px] lg:p-[40px] rounded-2xl shadow-md border border-gray-100">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-inner order-1 lg:order-none group">
                        <Image 
                            src={aktivSIBD.photos[3]} 
                            alt="Как вступить" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl lg:text-2xl font-bold mb-[15px]">{aktivSIBD.howToJoin.title}</h3>
                        <p className="text-base lg:text-lg leading-relaxed">{aktivSIBD.howToJoin.text}</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Main