import React from 'react'
import Image from 'next/image'
import { summerAndWinterSchools } from '@/data/summer-and-winter-schools/summerAndWinterSchools'

const Main = () => {
    return (
        <section className="schools flex-center pb-20">
            <div className="schools__wrapper wrapper--my w-full">
                
                <h2 className="wwtitle--bold text-center mb-[20px] lg:mb-[30px]">
                    {summerAndWinterSchools.headline}
                </h2>

                <div className="flex flex-col gap-[20px] mb-[40px] lg:mb-[60px] w-full lg:w-[80%] mx-auto text-center">
                    {summerAndWinterSchools.intro.map((item, index) => (
                        <p key={index} className="text-base lg:text-lg leading-relaxed">{item}</p>
                    ))}
                </div>

                <div className="flex flex-col gap-[40px] lg:gap-[50px] w-full lg:w-[80%] mx-auto mb-[60px]">
                    {summerAndWinterSchools.sections.map((section, index) => (
                        <div key={index} className="bg-white p-[20px] lg:p-[30px] rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl lg:text-2xl font-bold mb-[20px] text-blue-900 border-b pb-[15px]">
                                {section.title}
                            </h3>
                            <div className="flex flex-col gap-[15px]">
                                {section.content.map((block, bIndex) => {
                                    if (block.type === 'text') {
                                        return <p key={bIndex} className="text-base lg:text-lg leading-relaxed">{block.value as string}</p>
                                    }
                                    if (block.type === 'list') {
                                        return (
                                            <ul key={bIndex} className="flex flex-col gap-[10px] pl-[15px] lg:pl-[20px]">
                                                {(block.value as string[]).map((item, iIndex) => (
                                                    <li key={iIndex} className="text-base lg:text-lg leading-relaxed relative before:content-['•'] before:absolute before:left-[-15px] before:text-blue-500 before:font-bold">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-[90%] mx-auto mb-[60px]">
                    <h3 className="wwtitle--bold text-center mb-[30px] lg:mb-[40px]">Отзывы участников</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] lg:gap-[30px]">
                        {summerAndWinterSchools.reviews.map((review, index) => (
                            <div key={index} className="flex flex-col bg-blue-50 p-[20px] lg:p-[30px] rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-[15px] mb-[20px]">
                                    <div className="relative w-[60px] h-[60px] flex-shrink-0 rounded-full overflow-hidden shadow-sm border-2 border-white">
                                        <Image
                                            src={review.image}
                                            alt={review.author}
                                            fill
                                            className="object-cover"
                                            style={{ objectPosition: review.imagePosition || 'center' }}
                                            sizes="60px"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{review.author}</div>
                                        <div className="text-sm text-gray-500 font-medium">{review.year}</div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute top-[-10px] left-[-10px] text-4xl text-blue-200 font-serif">"</span>
                                    <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line relative z-10 pl-[10px]">
                                        {review.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    <h3 className="wwtitle--bold text-center mb-[30px] lg:mb-[40px]">Фотогалерея</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] lg:gap-[25px]">
                        {summerAndWinterSchools.groupPhotos.map((src, index) => (
                            <div 
                                key={index} 
                                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
                            >
                                <Image
                                    src={src}
                                    alt={`Фото с летней школы ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Main