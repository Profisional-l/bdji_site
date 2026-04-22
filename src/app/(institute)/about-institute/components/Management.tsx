import React from 'react';
import Image from 'next/image';
import Lyashenko from '@/../public/people/lyashenko_director_sibd.png';
import Kovgar from '@/../public/people/Kovgar_secretary_sibd.jpg';
import management from '@/data/about-institute/management';

const Management = () => {
    return (
        <section className="management flex-center">
            <div className="management__wrapper wrapper--mt flex flex-col lg:gap-[50px]">
                <h2 className="wwtitle--bold">{management.title}</h2>

                <div className="lg:flex lg:gap-[60px] max-lg:mt-[30px] xl:gap-[80px] 2xl:gap-[100px]">
                    <Image
                        src={Lyashenko}
                        className="h-auto min-w-[250px] lg:min-w-[400px] lg:w-[400px] xl:w-[500px]"
                        alt={management.director.name}
                    />
                    <div className="flex flex-col gap-[8px] justify-center max-lg:mt-[30px]">
                        <h3 className="font-semibold text-[20px] leading-[1.15]">
                            {management.director.name}
                        </h3>
                        <p className="leading-[1.2]">
                            {management.director.position}
                            <br />
                            {management.director.degree}
                            <br />
                        </p>
                        <span>{management.director.phone}</span>
                            {management.director.address}
                        <span>{management.director.email}</span>
                    </div>
                </div>

                <div className="lg:flex max-lg:mt-[50px] lg:gap-[50px]">
                    <Image
                        src={Kovgar}
                        className="h-auto lg:min-w-[400px] lg:w-[400px] xl:w-[500px]"
                        alt={management.specialist.name}
                    />
                    <div className="flex flex-col gap-[8px] justify-center max-lg:mt-[30px]">
                        <h3 className="font-semibold text-[20px] leading-[1.15]">
                            {management.specialist.name}
                        </h3>
                        <p className="leading-[1.2]">
                            {management.specialist.position}                            
                            <br />
                            {management.specialist.degree}
                        </p>
                        <span>{management.specialist.phone}</span>
                            {management.specialist.address}
                        <span>{management.specialist.email}</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Management;
