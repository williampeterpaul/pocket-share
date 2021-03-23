import React from 'react';
import Head from 'next/head'
import Layout from '../components/layout';
import { useInput } from '../hooks/input';
import { useSession, signIn } from 'next-auth/client'
import { useSubmit } from '../hooks/submit';

const Account = ({ updateSession, updateAlert }) => {
    const [session, loading] = useSession()

    const { value: valueName, bind: bindName } = useInput('');
    const { value: valueBio, bind: bindBio } = useInput('');
    const { value: valueProfession, bind: bindProfession } = useInput('');

    const body = {
        name: valueName || undefined,
        bio: valueBio || undefined,
        profession: valueProfession || undefined
    }

    const { bind: bindSubmit } = useSubmit('PUT', '/api/account', body, (response: Response) => {
        updateAlert(response.status, response.statusText);

        if (response.status === 200) {
            session.user = { ...session.user, ...body }
            updateSession(session);
        }
    });

    if (loading) {
        return null
    }

    if (!session) {
        signIn();
        return null;
    }

    return (
        <Layout>
            <Head>
                <title>My page title!</title>
            </Head>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-lg-3 mb-3">
                        <ul className="nav nav-tabs flex-lg-column" role="tablist">
                            <li className="nav-item">
                                <a aria-controls="profile" aria-selected="true" className="nav-link active" data-toggle="tab" href="#profile" id="profile-tab" role="tab">Your Profile</a>
                            </li>
                            <li className="nav-item">
                                <a aria-controls="notifications" aria-selected="false" className="nav-link" data-toggle="tab" href="#notifications" id="notifications-tab" role="tab">Email Notifications</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xl-8 col-lg-9">
                        <div className="card">
                            <div className="card-body">
                                <div className="media mb-4">
                                    <img alt="Image" className="avatar avatar-lg" src="/profile.jpg" />
                                    <div className="media-body ml-3">
                                        <div className="custom-file custom-file-naked d-block mb-1">
                                            <input className="custom-file-input d-none " id="avatar-file" type="file" />
                                            <label className="custom-file-label position-relative" htmlFor="avatar-file">
                                                <span className="btn btn-primary">Upload avatar</span></label>
                                        </div>
                                        <small>For best results, use an image at least 256px by 256px in either .jpg or .png format</small>
                                    </div>
                                </div>
                                <form {...bindSubmit}>
                                    <div className="form-group row align-items-center">
                                        <label className="col-3">Email</label>
                                        <div className="col">
                                            <input className="form-control disabled" readOnly name="profile-email" placeholder="Enter your email address"
                                                type="email" value={session.user.email} />
                                        </div>
                                    </div>
                                    <div className="form-group row align-items-center">
                                        <label className="col-3">Nickname</label>
                                        <div className="col">
                                            <input className="form-control" placeholder={session.user.name} pattern="[a-zA-Z0-9]+"
                                                title="Must be Alphanumeric" minLength={2} maxLength={20} type="text" {...bindName} />
                                        </div>
                                    </div>
                                    <div className="form-group row align-items-center">
                                        <label className="col-3">Profession</label>
                                        <div className="col">
                                            <input className="form-control" placeholder={session.user.profession} pattern="[a-zA-Z0-9 ]+"
                                                title="Must be Alphanumeric" minLength={2} maxLength={20} type="text" {...bindProfession} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-3">Bio</label>
                                        <div className="col">
                                            <textarea className="form-control" placeholder={session.user.bio || 'Tell us a little about yourself'}
                                                title="Must be no greater than 150 characters" minLength={1} maxLength={150} name="profile-bio" rows={4} {...bindBio}></textarea>
                                            <small>This will be displayed on your public profile</small>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary" type="submit">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Account
