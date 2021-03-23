const hyperlinks = (base) => {
    return {
        facebook: `https://www.facebook.com/sharer.php?u=${base}`,
        twitter: `https://twitter.com/intent/tweet?url=${base}&text=Pocket%20Share&via=`,
        reddit: `https://reddit.com/submit?url=${base}&title=Pocket%20Share`
    }
}

const Socials = (props) => (
    <div></div>
)

export default Socials;