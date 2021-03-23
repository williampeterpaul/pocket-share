import { withRouter } from 'next/router';
import Link from 'next/link'

const Header = (props) => {
    const path = props.router.asPath;
    const sub = path.split('/');
    sub[0] = 'Home';

    return (
        <div className="navbar bg-white breadcrumb-bar">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {sub.map((element, index) => {
                        const first = index === 0;
                        return <li key={index} className="breadcrumb-item text-capitalize">
                            {first ? <Link href="/">{element}</Link> : element}
                        </li>
                    })}
                </ol>
            </nav>
        </div>
    )
}

export default withRouter(Header);