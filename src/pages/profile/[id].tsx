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

const pocketsByDate = (x, y) => {
    if (x.createdAt < y.createdAt) return 1;
    if (x.createdAt > y.createdAt) return -1;
    return 0;
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export async function getStaticProps({ params }) {
    const { data, error } = await preload(`${process.env.NEXTAUTH_URL}/api/profile/${params.id}`)

    if (error) {
        return {
            notFound: true,
        }
    }

    data.pockets = data.pockets.sort(pocketsByDate)

    return {
        props: { data },
        revalidate: 2,
    }
}

const Profile = (props) => (
    <Layout>
        <Head>
            <title>My page title!</title>
        </Head>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-9">
                    <div className="page-header mb-4">
                        <div className="media">
                            <img alt="Image" className="avatar avatar-lg mt-1" src={props.data.image} />
                            <div className="media-body ml-3">
                                <h1 className="mb-0">{props.data.name}</h1>
                                <p className="lead">{props.data.profession}</p>
                            </div>
                        </div>
                    </div>
                    {props.data.pockets.map(pocket => <Card {...pocket} key={pocket.id} />)}
                </div>
            </div>
        </div>
    </Layout>
)

export default Profile
