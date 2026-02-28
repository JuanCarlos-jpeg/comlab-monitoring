import bgImage from "../../assets/images/Mapua White Background 1.png";

const FullPageBackground = ({ children }) => {
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                overflow: 'auto',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                fontFamily: 'Inter, sans-serif'
            }}
        >
            <div
                style={{
                    minHeight: '100vh',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    padding: '2rem 2rem 2rem 280px'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default FullPageBackground;