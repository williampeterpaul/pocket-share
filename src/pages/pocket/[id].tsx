import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout';
import Card from '../../components/card';

const preload = async (url: RequestInfo) => {
    try {
        const options: RequestInit = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }

        const response = await fetch(url, options);
        const json = await response.json()

        return json;
    } catch (error) {
        return {
            data: undefined,
            error: 'Invalid server response'
        }
    }
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export async function getStaticProps({ params }) {
    const { data, error } = await preload(`${process.env.NEXTAUTH_URL}/api/pocket/${params.id}`)

    if (error) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data },
        revalidate: 2,
    }
}

const Pocket = (props) => (
    <Layout>
        <Head>
            <title>My page title!</title>
        </Head>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-9">
                    <div className="page-header mb-4">
                    </div>
                    <Card {...props.data} />
                </div>
            </div>
        </div>
    </Layout>
)

export default Pocket
