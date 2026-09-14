'use client'

import { useState } from 'react'
import { advantagesText, advantagesPoints } from '@/data/main/advantages'

const Advantages = () => {
    const [openIndex, setOpenIndex] = useState(0)

    const toggleItem = (index: number) => {
        setOpenIndex((current) => (current === index ? -1 : index))
    }

    return (
        <section className="advantages flex-center bg-blue bg-[url('/pics/nice_background.png')] bg-cover bg-center">
            <div className="advantages__wrapper wrapper py-[75px] lg:py-[100px]">
                <h2 className="flex flex-col text-right text-white">
                    <span className="text-red text-[56px]">教育过程</span>
                    <span className="wwtitle--bold mr-[10px]">учебный процесс</span>
                </h2>

                <div className="advantages__content flex flex-col gap-[20px] mt-[75px] lg:mt-[100px]">
                    {advantagesText.map((item, index) => (
                        <p key={index} className="md:w-[50%] wwtext text-white">
                            {item}
                        </p>
                    ))}
                </div>
                <div className="advantages__slider mt-[75px] lg:mt-[100px] flex flex-col items-start lg:flex-row lg:flex-wrap gap-4">
                    {advantagesPoints.map((item, index) => {
                        const isOpen = openIndex === index

                        return (
                            <button
                                type="button"
                                key={index}
                                aria-expanded={isOpen}
                                className={`slider__item bg-white text-blue px-6 sm:px-[40px] rounded-lg cursor-pointer flex items-center text-left max-w-full h-[104px] transition-[gap,box-shadow] duration-500 ease-in-out hover:bg-opacity-90 ${
                                    isOpen ? 'gap-6 sm:gap-8 shadow-lg' : 'gap-0'
                                }`}
                                onClick={() => toggleItem(index)}
                            >
                                <span className="text-[72px] font-bold shrink-0 leading-none">
                                    {index + 1}
                                </span>
                                <span
                                    className={`grid h-full items-center min-w-0 transition-[grid-template-columns,opacity] duration-500 ease-in-out ${
                                        isOpen
                                            ? 'grid-cols-[1fr] opacity-100'
                                            : 'grid-cols-[0fr] opacity-0'
                                    }`}
                                >
                                    <span className="overflow-hidden h-full flex items-center min-w-0">
                                        <span className="block text-[14px] md:text-[16px] lg:text-[18px] whitespace-nowrap">
                                            {item}
                                        </span>
                                    </span>
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Advantages
