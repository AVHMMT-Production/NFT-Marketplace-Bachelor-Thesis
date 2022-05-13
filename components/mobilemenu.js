import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'

export default function MobileMenu (){
    return (
        <Menu>
            {({ open }) => (
                <>
                <span className="rounded-md shadow-sm">
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-cyan-500 shadow-lg shadow-cyan-500/50  hover:shadow-cyan-700/50 rounded-md hover:bg-cyan-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                    <span>Menu</span>
                    <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        />
                    </svg>
                    </Menu.Button>
                </span>

                <Transition
                    show={open}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                    static
                    className="absolute right-0 w-56 mt-2 origin-top-right bg-gradient-to-br from-indigo-800 via-cyan-800 to-cyan-900 border border-indigo-400 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                    >

                    <div className="py-1">
                        <Menu.Item>
                        {({ active }) => (
                            <Link href="/">
                                <div
                                href="/"
                                className={`${
                                    active
                                    ? "py-2 text-fuchsia-600 hover:text-indigo-400 hover:px-3:py-2 rounded-md text-sm font-medium"
                                    : "text-gray-300 hover:text-indigo-400  px-3 py-2 rounded-md text-sm font-medium"
                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                >
                                Home
                                </div>
                            </Link>
                        )}
                        </Menu.Item>
                        <Menu.Item>
                        {({ active }) => (
                            <Link href="/feed">
                                <div
                                href="/feed"
                                className={`${
                                    active
                                    ? "py-2 hover:text-indigo-400 hover:px-3:py-2 rounded-md text-sm font-medium"
                                    : "text-gray-300 hover:text-blue-700  px-3 py-2 rounded-md text-sm font-medium"
                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                >
                                Feed
                                </div>
                            </Link>
                        )}
                        </Menu.Item>
                        <Menu.Item>
                        {({ active }) => (
                            <Link href="/create">
                                <div
                                href="/create"
                                className={`${
                                    active
                                    ? "py-2 text-fuchsia-600 hover:text-indigo-400 hover:px-3:py-2 rounded-md text-sm font-medium"
                                    : "text-gray-300 hover:text-blue-700  px-3 py-2 rounded-md text-sm font-medium"
                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                >
                                Create
                                </div>
                            </Link>
                        )}
                        </Menu.Item>
                        <Menu.Item>
                        {({ active }) => (
                            <Link href="/dashboard">
                                <div
                                href="/dashboard"
                                className={`${
                                    active
                                    ? "py-2 text-fuchsia-600 hover:text-indigo-400 hover:px-3:py-2 rounded-md text-sm font-medium"
                                    : "text-gray-300 hover:text-blue-700  px-3 py-2 rounded-md text-sm font-medium"
                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                >
                                Dashboard
                                </div>
                            </Link>
                        )}
                        </Menu.Item>
                    </div>
                    </Menu.Items>
                </Transition>
                </>
            )}
        </Menu>
    )
}
