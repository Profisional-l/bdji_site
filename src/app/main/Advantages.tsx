'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { advantagesText, advantagesPoints } from '@/data/main/advantages'

// Отступ между цифрой и текстом задаётся в JS, чтобы ширина выезжающей панели считалась точно
const PANEL_GAP = 24
const TEXT_MAX_WIDTH = 352
const TEXT_CLASSES = 'text-[13px] sm:text-[15px] lg:text-[18px] leading-snug'

const Advantages = () => {
    const [openIndex, setOpenIndex] = useState(0)
    const [textWidths, setTextWidths] = useState<number[]>(() => advantagesPoints.map(() => 0))
    const [animated, setAnimated] = useState(false)
    const rowRef = useRef<HTMLDivElement>(null)
    const probeRef = useRef<HTMLDivElement>(null)

    const toggleItem = (index: number) => {
        setOpenIndex((current) => (current === index ? -1 : index))
    }

    useLayoutEffect(() => {
        const row = rowRef.current
        const probe = probeRef.current
        if (!row || !probe) return

        const measure = () => {
            const card = row.querySelector<HTMLElement>('.slider__item')
            const number = row.querySelector<HTMLElement>('.slider__number')
            if (!card || !number) return

            const { paddingLeft, paddingRight } = getComputedStyle(card)
            const collapsedWidth =
                number.offsetWidth + parseFloat(paddingLeft) + parseFloat(paddingRight)
            const available = Math.max(
                0,
                Math.min(TEXT_MAX_WIDTH, row.clientWidth - collapsedWidth - PANEL_GAP)
            )

            // Текст занимает ровно столько, сколько нужно, но не больше свободного места
            setTextWidths(
                [...probe.children].map((item) =>
                    Math.min(available, Math.ceil(item.getBoundingClientRect().width) + 1)
                )
            )
        }

        measure()

        const observer = new ResizeObserver(measure)
        observer.observe(row)
        return () => observer.disconnect()
    }, [])

    // Первый кадр без transition, иначе открытая по умолчанию карточка выезжает при загрузке
    useEffect(() => {
        const frame = requestAnimationFrame(() => setAnimated(true))
        return () => cancelAnimationFrame(frame)
    }, [])

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

                <div
                    ref={rowRef}
                    className="advantages__slider mt-[75px] lg:mt-[100px] flex flex-col items-start lg:flex-row lg:flex-wrap gap-4"
                >
                    {advantagesPoints.map((item, index) => {
                        const isOpen = openIndex === index
                        const textWidth = textWidths[index] ?? 0

                        return (
                            <button
                                type="button"
                                key={index}
                                aria-expanded={isOpen}
                                onClick={() => toggleItem(index)}
                                className={`slider__item box-border flex items-center h-[104px] px-6 sm:px-10 bg-white text-blue rounded-lg cursor-pointer text-left hover:bg-opacity-90 motion-reduce:transition-none ${
                                    animated ? 'transition-shadow duration-300 ease-out' : ''
                                } ${isOpen ? 'shadow-lg' : 'shadow-none'}`}
                            >
                                <span className="slider__number text-[72px] font-bold leading-none select-none">
                                    {index + 1}
                                </span>

                                {/* Выезжающая панель: ширина анимируется в px, поэтому переход плавный */}
                                <span
                                    className={`overflow-hidden motion-reduce:transition-none ${
                                        animated
                                            ? 'transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                                            : ''
                                    }`}
                                    style={{ width: isOpen ? textWidth + PANEL_GAP : 0 }}
                                >
                                    {/* Ширина текста фиксирована, чтобы строки не переверстывались на каждом кадре */}
                                    <span
                                        className={`block break-words motion-reduce:transition-none ${TEXT_CLASSES} ${
                                            animated ? 'transition-opacity duration-300 ease-out' : ''
                                        } ${isOpen ? 'opacity-100 delay-200' : 'opacity-0'}`}
                                        style={{ width: textWidth, marginLeft: PANEL_GAP }}
                                    >
                                        {item}
                                    </span>
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Замер натуральной ширины текста: каждая карточка выезжает ровно под свой текст */}
                <div
                    ref={probeRef}
                    aria-hidden
                    className="pointer-events-none absolute -left-[9999px] top-0 invisible"
                >
                    {advantagesPoints.map((item, index) => (
                        <span
                            key={index}
                            className={`inline-block whitespace-nowrap ${TEXT_CLASSES}`}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Advantages
