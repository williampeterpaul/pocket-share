import Link from 'next/link'

const Annotation = (props) => {
    const {
        annotation: {
            geometry: {
                x,
                y
            },
            data: {
                productId,
                name,
                brand
            }
        }
    } = props;

    return (
        <div
            style={{
                position: 'absolute',
                background: 'black',
                color: 'white',
                top: `${y}%`,
                left: `${x}%`,
                borderRadius: '2%',
                padding: 10,
                fontSize: 12,
                zIndex: 1300
            }}>
            <p>{name} — <b>{brand}</b></p>
            {productId && <Link href={`/product/${productId}`}><a>View product</a></Link>}
        </div>
    )
}

export default Annotation
