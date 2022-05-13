import '../styles/globals.css'
import Router from 'next/router'
import { useState } from 'react'
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
import { css } from "@emotion/react";
import Head from 'next/head'
import { MoralisProvider } from "react-moralis";
import Navbar from '../components/navbar'
import Footer from '../components/footer'

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#03c2fc");
  const override = css`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  `;

  Router.events.on('routeChangeStart', () => setLoading(true)); Router.events.on('routeChangeComplete', () => setLoading(false)); Router.events.on('routeChangeError', () => setLoading(false));

  if (loading == true) return (
    <div className="min-h-full">
      <ClimbingBoxLoader color={color} loading={loading} css={override} size={50}/>
    </div>
  )

  return (
    <MoralisProvider serverUrl="https://5r8o1vqlushl.usemoralis.com:2053/server" appId="03pWyek3gS2z51Qu8GWpjCLx4M5OWHIRtyqHJk3p">
      <div className="bg-gradient-to-br from-indigo-800 via-cyan-800 to-cyan-900 min-h-full min-w-full flex flex-col min-h-screen">
          <Head>
            <title>NFTio Marketplace</title>
            <link rel="icon" href="/logo.png"></link>
            <link rel="stylesheet" href="https://unpkg.com/flowbite@1.4.3/dist/flowbite.min.css" />
          </Head>

          <Navbar />

            <div className="min-h-screen">
              <Component {...pageProps} />
            </div>

          <Footer />
      </div>
    </MoralisProvider>
  )
}

export default MyApp
