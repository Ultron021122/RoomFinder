'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { messages, patterns, roles } from '@/utils/constants';
import { Alert } from '@/utils/alert';
import { Progress } from "@nextui-org/react";

interface PropertyData {
    // Property Details
    propertytypeid: number;
    vchtitle: string;
    intnumberrooms: number;
    intnumberbathrooms: number;
    intmaxoccupacy: number;
    /*
    bnfurnished: boolean;
    vchfurnituretype: string;
    decrentalcost: number;
    dtavailabilitydate: Date;
    intmincontractduration: number;
    intmaxcontractduration: number;
    decpropertyrating: number;
    bnstudyzone: boolean;
    vchbuildingsecurity: string;
    vchtransportationaccess: string;
    vchpropertyrules: string;
    */
    vchdescription: string;
    // Property Address
    vchexteriornumber: string;
    vchinteriornumber: string;
    vchstreet: string;
    vchaddrescomplement: string;
    vchneighborhood: string;
    vchmunicipality: string;
    vchstateprovince: string;
    intzip: number;
    vchcountry: string;
    // Property services
    // /*
    // bnwaterincluded: boolean;
    // bnelectricityincluded: boolean;
    // bninternetincluded: boolean;
    // bngasincluded: boolean;
    // bnheatingincluded: boolean;
    // bnaireconditioningincluded: boolean;
    // bnlaundryincluded: boolean;
    // bnparkingincluded: boolean;
    // bncleaningincluded: boolean;
    // bncabletvincluded: boolean;
    // // Property images
    // // Additional features
    // decarea: number;
    // fldistanceuniversity: number;
    // vchadditionalfeatures: string;
    // */
}

const MultiStepForm: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [step, setStep] = useState<number>(1);
    const { control, register, handleSubmit, formState: { errors }, watch, reset, setValue, setError, clearErrors } = useForm<PropertyData>({ mode: "onChange" });

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const onSubmit = async (data: PropertyData) => {
        console.log(data);
    };

    // Dark Mode 
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const setDarkModeFromMediaQuery = () => setDarkMode(darkModeMediaQuery.matches);

        setDarkModeFromMediaQuery();
        darkModeMediaQuery.addEventListener('change', setDarkModeFromMediaQuery);

        setIsLoaded(true);

        return () => {
            darkModeMediaQuery.removeEventListener('change', setDarkModeFromMediaQuery);
        };
    }, []);

    if (!isLoaded) {
        return null;
    }

    return (
        <div className="h-full max-w-screen-2xl mx-auto bg-zinc-200 dark:bg-gray-900">
            <div className="mx-auto">
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
                    <div className='gap-9 sm:col-span-2'>
                        <Progress size="sm" aria-label="Loading..." value={(step / 4) * 100} />
                    </div>
                    <div className="flex flex-col gap-9 sm:col-span-2">
                        <div className="rounded-sm border border-gray-300 shadow-default dark:border-gray-800">
                            <div className="border-b border-gray-300 px-[26px] py-4 dark:border-gray-800">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Nueva Propiedad
                                </h2>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="p-[26px]">
                                    {step === 1 && (
                                        <div>
                                            <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                                {/* Property Title */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchtitle", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchtitle.required

                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchtitle"
                                                            id="vchtitle"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchtitle"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Nombre de la propiedad
                                                        </label>
                                                        {errors?.vchtitle && (
                                                            <Alert message={errors?.vchtitle.message} />
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Exterior number */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchexteriornumber", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchexteriornumber.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchexteriornumber"
                                                            id="vchexteriornumber"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchexteriornumber"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Número exterior
                                                        </label>
                                                        {errors?.vchexteriornumber && (
                                                            <Alert message={errors?.vchexteriornumber.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                                {/* Interior number */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchinteriornumber", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchinteriornumber.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchinteriornumber"
                                                            id="vchinteriornumber"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchinteriornumber"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Número interior
                                                        </label>
                                                        {errors?.vchinteriornumber && (
                                                            <Alert message={errors?.vchinteriornumber.message} />
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Street */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchstreet", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchstreet.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchstreet"
                                                            id="vchstreet"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchstreet"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Nombre de la calle
                                                        </label>
                                                        {errors?.vchstreet && (
                                                            <Alert message={errors?.vchstreet.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                                {/* Address Complement */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchaddrescomplement", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchaddrescomplement.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchaddrescomplement"
                                                            id="vchaddrescomplement"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchaddrescomplement"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Complemento de dirección
                                                        </label>
                                                        {errors?.vchaddrescomplement && (
                                                            <Alert message={errors?.vchaddrescomplement.message} />
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Neighborhood */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchneighborhood", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchsuburb.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchneighborhood"
                                                            id="vchneighborhood"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchneighborhood"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Colonia
                                                        </label>
                                                        {errors?.vchneighborhood && (
                                                            <Alert message={errors?.vchneighborhood.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                                {/* Municipality */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchmunicipality", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchmunicipality.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchmunicipality"
                                                            id="vchmunicipality"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchmunicipality"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Complemento de dirección
                                                        </label>
                                                        {errors?.vchmunicipality && (
                                                            <Alert message={errors?.vchmunicipality.message} />
                                                        )}
                                                    </div>
                                                </div>
                                                {/* State / Province */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchstateprovince", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchstate.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchstateprovince"
                                                            id="vchstateprovince"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchstateprovince"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Estado / Provincia
                                                        </label>
                                                        {errors?.vchstateprovince && (
                                                            <Alert message={errors?.vchstateprovince.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                                {/* ZIP */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("intzip", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.intzip.required
                                                                },
                                                            })}
                                                            type="number"
                                                            name="intzip"
                                                            id="intzip"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="intzip"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Código postal
                                                        </label>
                                                        {errors?.intzip && (
                                                            <Alert message={errors?.intzip.message} />
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Country */}
                                                <div className="w-full xl:w-1/2">
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchcountry", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchcountry.required
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchcountry"
                                                            id="vchcountry"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label
                                                            htmlFor="vchcountry"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Pais
                                                        </label>
                                                        {errors?.vchcountry && (
                                                            <Alert message={errors?.vchcountry.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {step === 2 && (
                                        <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                            {/* Number of rooms */}
                                            <div className="w-full xl:w-1/2">
                                                <div className="relative z-0 w-full group">
                                                    <input
                                                        {...register("intnumberrooms", {
                                                            required: {
                                                                value: true,
                                                                message: messages.intnumberrooms.required
                                                            },
                                                        })}
                                                        type="text"
                                                        name="intnumberrooms"
                                                        id="intnumberrooms"
                                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                    <label
                                                        htmlFor="intnumberrooms"
                                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                    >
                                                        Código postal
                                                    </label>
                                                    {errors?.intnumberrooms && (
                                                        <Alert message={errors?.intnumberrooms.message} />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Number bathrooms */}
                                            <div className="w-full xl:w-1/2">
                                                <div className="relative z-0 w-full group">
                                                    <input
                                                        {...register("intnumberbathrooms", {
                                                            required: {
                                                                value: true,
                                                                message: messages.intnumberbathrooms.required
                                                            },
                                                        })}
                                                        type="text"
                                                        name="intnumberbathrooms"
                                                        id="intnumberbathrooms"
                                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                    <label
                                                        htmlFor="intnumberbathrooms"
                                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                    >
                                                        Pais
                                                    </label>
                                                    {errors?.intnumberbathrooms && (
                                                        <Alert message={errors?.intnumberbathrooms.message} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {step === 3 && (
                                        <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                            {/* Maxima ocupacidad */}
                                            <div className="w-full xl:w-1/2">
                                                <div className="relative z-0 w-full group">
                                                    <input
                                                        {...register("intmaxoccupacy", {
                                                            required: {
                                                                value: true,
                                                                message: messages.intmaxoccupacy.required
                                                            },
                                                        })}
                                                        type="number"
                                                        name="intmaxoccupacy"
                                                        id="intmaxoccupacy"
                                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                    <label
                                                        htmlFor="intmaxoccupacy"
                                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                    >
                                                        Maxima ocupacidad
                                                    </label>
                                                    {errors?.intmaxoccupacy && (
                                                        <Alert message={errors?.intmaxoccupacy.message} />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Number bathrooms */}
                                            <div className="w-full xl:w-1/2">
                                                <div className="relative z-0 w-full group">
                                                    <input
                                                        {...register("intnumberbathrooms", {
                                                            required: {
                                                                value: true,
                                                                message: messages.intnumberbathrooms.required
                                                            },
                                                        })}
                                                        type="number"
                                                        name="intnumberbathrooms"
                                                        id="intnumberbathrooms"
                                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=""
                                                        autoComplete="off"
                                                    />
                                                    <label
                                                        htmlFor="intnumberbathrooms"
                                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                    >
                                                        Numero de baños
                                                    </label>
                                                    {errors?.intnumberbathrooms && (
                                                        <Alert message={errors?.intnumberbathrooms.message} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {step === 4 && (
                                        <>
                                            {/* Tipo de propiedad */}
                                            < div className='mb-4'>
                                                <FormControl
                                                    className="w-full xl:w-1/2 mb-2"
                                                    variant="standard"
                                                    sx={{
                                                        '.MuiInput-underline:after': {
                                                            borderBottomColor: darkMode === true ? '#3b82f6' : '#2563eb',
                                                        },
                                                        '.MuiInput-underline:before': {
                                                            borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                                            borderBottomWidth: '2px',
                                                        },
                                                        '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                            borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                                        },
                                                    }}
                                                >
                                                    <InputLabel
                                                        id="type-property-label"
                                                        className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                                        sx={{
                                                            color: darkMode === true ? '#9ca3af' : '#6b7280',
                                                            fontSize: '0.875rem',
                                                            lineHeight: '1.25rem',
                                                        }}
                                                    >
                                                        Tipo de propiedad
                                                    </InputLabel>
                                                    <Controller
                                                        name="propertytypeid"
                                                        control={control}
                                                        defaultValue={1}
                                                        rules={{
                                                            required: {
                                                                value: true,
                                                                message: messages.roleid.required
                                                            }
                                                        }}
                                                        render={({ field }) => (
                                                            <Select
                                                                labelId="type-property-label"
                                                                id="roleid"
                                                                label="Tipo de propiedad"
                                                                className="text-sm"
                                                                sx={{
                                                                    fontFamily: '__Inter_aaf875',
                                                                    fontSize: '0.875rem',
                                                                    lineHeight: '1.25rem',
                                                                    fontStyle: 'normal',
                                                                    color: darkMode ? "white" : "#111827",
                                                                    '.MuiSvgIcon-root ': {
                                                                        fill: darkMode ? "white !important" : "#111827 !important",
                                                                    }
                                                                }}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        sx: {
                                                                            backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                                                                            color: darkMode ? "#fff" : "#111827",
                                                                            maxHeight: '200px',
                                                                        },
                                                                    },
                                                                }}
                                                                {...field}
                                                            >
                                                                {
                                                                    roles.map((rol, index) => (
                                                                        <MenuItem
                                                                            value={rol.roleid}
                                                                            key={index}
                                                                            sx={{
                                                                                fontSize: '0.875rem',
                                                                                lineHeight: '1.25rem',
                                                                                '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                                                                '&.Mui-selected:hover': {
                                                                                    backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                                                    color: darkMode ? '#3b82f6' : '#fff',
                                                                                }, // Style when selected and hovered
                                                                                '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                                                            }}
                                                                        >
                                                                            {rol.vchname}
                                                                        </MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        )}
                                                    />
                                                    <FormHelperText
                                                        sx={{
                                                            color: darkMode ? '#d1d5db' : '#4b5563',
                                                        }}
                                                    >
                                                        Selecciona un tipo de usuario
                                                    </FormHelperText>
                                                    {errors?.propertytypeid && (
                                                        <Alert message={errors?.propertytypeid.message} />
                                                    )}
                                                </FormControl>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between mt-4">
                                        {step > 1 ? (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                            >
                                                Atras
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2 invisible">Placeholder</div>
                                        )}
                                        {step < 4 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Siguiente
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Enviar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default MultiStepForm;