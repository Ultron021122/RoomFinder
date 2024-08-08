'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import Link from "next/link";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

const MultiStepForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="h-full max-w-screen-2xl mx-auto bg-zinc-200 dark:bg-gray-900">
            <div className="mx-auto">
                <Breadcrumb pageName="Propiedades" />
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
                    <div className='sm:col-span-3'>
                        <ol className="items-center flex w-full max-w-4xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
                            <li className={`after:border-1 flex items-center ${step >= 1 ? 'text-primary-700 dark:text-primary-500' : ''} after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10`}>
                                <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                                    <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Principales
                                </span>
                            </li>
                            <li className={`after:border-1 flex items-center ${step >= 2 ? 'text-primary-700 dark:text-primary-500' : ''} after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10`}>
                                <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                                    <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Direccion
                                </span>
                            </li>
                            <li className={`after:border-1 flex items-center ${step >= 3 ? 'text-primary-700 dark:text-primary-500' : ''} after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10`}>
                                <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                                    <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Servicios
                                </span>
                            </li>
                            <li className={`flex shrink-0 items-center ${step >= 4 ? 'text-primary-700 dark:text-primary-500' : ''}`}>
                                <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Adicionales
                            </li>
                        </ol>
                    </div>
                    <div className="flex flex-col gap-9 sm:col-span-2">
                        <div className="rounded-sm border border-gray-300 shadow-default dark:border-gray-800">
                            <div className="border-b border-gray-300 px-[26px] py-4 dark:border-gray-800">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Nueva Propiedad
                                </h2>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="p-[26px]">
                                    {step === 1 && (
                                        <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> First Name </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    id="first_name"
                                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                                    placeholder="Enter your first name"
                                                    required
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> First Name </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    id="last_name"
                                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                                    placeholder="Enter your last name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {step === 2 && (
                                        <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email"
                                                    className="w-full rounded border-[1.5px] border-gray-300 bg-white px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Enter your address"
                                                    className="w-full rounded border-[1.5px] border-gray-300 bg-white px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {step === 3 && (
                                        <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder="Enter your city"
                                                    className="w-full rounded border-[1.5px] border-gray-300 bg-white px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    placeholder="Enter your state"
                                                    className="w-full rounded border-[1.5px] border-gray-300 bg-white px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {step === 4 && (
                                        <div className="mb-[18px] flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    ZIP Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="zip"
                                                    value={formData.zip}
                                                    onChange={handleChange}
                                                    placeholder="Enter your ZIP code"
                                                    className="w-full rounded border-[1.5px] border-gray-300 bg-white px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between mt-4">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {step < 4 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Submit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiStepForm;