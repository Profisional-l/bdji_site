import React from 'react';
import Link from 'next/link'
import Image from 'next/image'

import { Table, ConfigProvider, } from "antd";
import Clip from '@/../public/icons/clip.svg'

import { dataSource, dataSourceMath } from '@/data/schedule/scheduleTableData';

import { columns } from '@/data/schedule/scheduleTableData'

import { scheduleText } from '@/data/schedule/scheduleText';

const ScheduleContent = () => {
    return (
        <section className="schedule flex-center">
            <div className="schedule__wrapper wrapper--my">
                <h2 className="wwtitle--bold mb-[25px]">{scheduleText.headline}</h2>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                fontSize: 16,
                                fontFamily: 'Montserrat',
                                borderColor: '#FFFFFF',
                                headerBg: '#E9F3FF',
                                rowHoverBg: 'none',
                                headerSplitColor: '#FFFFFF',
                                colorBgContainer: '#F2F8FF',
                            },
                        },
                    }}
                >
                    <Table style={{ margin: '10px 0' }} dataSource={dataSourceMath} columns={columns.mmf} pagination={false} size={'large'} scroll={{ x: 'max-content' }} />
                    <Table style={{ margin: '10px 0' }} dataSource={dataSource} columns={columns.phys} pagination={false} size={'large'} scroll={{ x: 'max-content' }} />
                    <Table style={{ margin: '10px 0' }} dataSource={dataSource} columns={columns.fmo} pagination={false} size={'large'} scroll={{ x: 'max-content' }} />
                </ ConfigProvider>

                <div className="document flex items-center gap-[10px] mt-[20px]">
                    <Image src={Clip} height={32} alt='#' />
                    <Link href={'https://bdji.bsu.by/files/prilozhenie_1.pdf'} className="underline underline-offset-4 hover:text-red" target="_blank" rel='noopener noreferrer'>{scheduleText.application}</Link>
                </div>
            </div>
        </section>
    )
}

export default ScheduleContent


