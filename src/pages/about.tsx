import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../components/layout';

export async function getStaticProps() {
    return {
        props: {

        }
    }
}

const Index: React.FunctionComponent = () => (
    <Layout>
        <Head>
            <title>My page title!</title>
        </Head>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-9">
                    <div className="page-header mb-2"></div>
                    <div className="col-12">
                        <h1>Pocket Share</h1>
                        <p>Thanks for checking out PocketShare!</p>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
)

export default Index
